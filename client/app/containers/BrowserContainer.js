// Controller-view for the browser area

var React = require("react");
var DataStore = require("../stores/DataStore");
var AlignmentStore = require("../stores/AlignmentStore");
var TrajectoryStore = require("../stores/TrajectoryStore");
var PhaseStore = require("../stores/PhaseStore");
var PhaseColorStore = require("../stores/PhaseColorStore");
var PhaseOverlayStore = require("../stores/PhaseOverlayStore");
var BrowserControls = require("../components/BrowserControls");
var TimeScaleArea = require("../components/TimeScaleArea");
var TrackSortContainer = require("../containers/TrackSortContainer");
var Phases = require("../components/Phases");
var Species = require("../components/Species");
var ViewActionCreators = require("../actions/ViewActionCreators");

var speciesDividerStyle = {
  width: "100%",
  height: 4,
  borderRadius: 2,
  marginTop: 5,
  marginBottom: 5,
  backgroundColor: "#31708f",
  opacity: 0
};

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
  };
}

function getStateFromAlignmentStore() {
  return {
    alignment: AlignmentStore.getAlignment()
  };
}

function getStateFromTrajectoryStore() {
  return {
    activeTrajectory: TrajectoryStore.getTrajectory()
  };
}

function getStateFromPhaseStore() {
  return {
    activePhase: PhaseStore.getPhase()
  };
}

function getStateFromPhaseColorStore() {
  return {
    phaseColorScale: PhaseColorStore.getColorScale()
  };
}

function getStateFromPhaseOverlayStore() {
  return {
    showPhaseOverlay: PhaseOverlayStore.getShow(),
    phaseOverlayOpacity: PhaseOverlayStore.getOpacity()
  };
}

var BrowserContainer = React.createClass({
  getInitialState: function () {
    this.dragSpeciesIndex = null;
    this.dividerIndex = null;

    return {
      data: DataStore.getData(),
      alignment: AlignmentStore.getAlignment(),
      activeTrajectory: TrajectoryStore.getTrajectory(),
      activePhase: PhaseStore.getPhase(),
      phaseColorScale: PhaseColorStore.getColorScale(),
      showPhaseOverlay: PhaseOverlayStore.getShow(),
      phaseOverlayOpacity: PhaseOverlayStore.getOpacity()
    };
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onDataChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
    TrajectoryStore.addChangeListener(this.onTrajectoryChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);
    PhaseOverlayStore.addChangeListener(this.onPhaseOverlayChange);
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onDataChange);
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
    TrajectoryStore.removeChangeListener(this.onTrajectoryChange);
    PhaseStore.removeChangeListener(this.onPhaseChange);
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
    PhaseOverlayStore.removeChangeListener(this.onPhaseOverlayChange);
  },
  componentDidUpdate: function () {
    // Enable tooltips
    // Placing here to capture any elements that might not have been drawn
    // before data was loaded
    $("[data-toggle='tooltip']").tooltip();
  },
  onDataChange: function () {
    this.setState(getStateFromDataStore());
  },
  onAlignmentChange: function () {
    this.setState(getStateFromAlignmentStore());
  },
  onTrajectoryChange: function () {
    this.setState(getStateFromTrajectoryStore());
  },
  onPhaseChange: function () {
    this.setState(getStateFromPhaseStore());
  },
  onPhaseColorChange: function () {
    this.setState(getStateFromPhaseColorStore());
  },
  onPhaseOverlayChange: function () {
    this.setState(getStateFromPhaseOverlayStore());
  },
  handleSpeciesMouseDown: function (e) {
    this.dragSpeciesIndex = +e.currentTarget.dataset.index;

    e.preventDefault();
  },
  handleSpeciesDividerMouseEnter: function (e) {
  },
  handleSpeciesDividerMouseLeave: function () {
  },
  handleSpeciesDividerMouseUp: function (e) {
    var index = +e.currentTarget.dataset.index;

    if (this.dragSpeciesIndex !== null &&
        this.dragSpeciesIndex !== index &&
        (this.dragSpeciesIndex !== index - 1)) {
      ViewActionCreators.insertTrack(this.dragSpeciesIndex, index);
    }

    this.dragSpeciesIndex = null;
  },
  render: function() {
    var tracks = this.state.data.tracks;

    if (tracks.length < 1) return null;

    // Create GUI components for each track
    var trackComponents = tracks.map(function(track, i) {
      return (
        <div key={i}>
          <div
            style={speciesDividerStyle}
            data-index={track.index}
            onMouseEnter={this.handleSpeciesDividerMouseEnter}
            onMouseLeave={this.handleSpeciesDividerMouseLeave}
            onMouseUp={this.handleSpeciesDividerMouseUp}>
          </div>
          <Species
            species={track}
            phases={this.state.showPhaseOverlay ? this.state.data.phases : [[]]}
            phaseAverage={this.state.showPhaseOverlay ? this.state.data.phaseAverage: []}
            timeExtent={this.state.data.timeExtent}
            activePhases={this.state.showPhaseOverlay ? this.state.activeTrajectory.phases : []}
            activePhase={this.state.activePhase}
            phaseColorScale={this.state.phaseColorScale}
            phaseOverlayOpacity={this.state.phaseOverlayOpacity}
            onMouseDown={this.handleSpeciesMouseDown} />
        </div>
      );
    }.bind(this));

    return (
      <div>
        <BrowserControls />
        <TimeScaleArea
          timeExtent={this.state.data.timeExtent}
          alignment={this.state.alignment} />
        <Phases
          phases={this.state.data.phases}
          phaseAverage={this.state.data.phaseAverage}
          timeExtent={this.state.data.timeExtent}
          activeTrajectory={this.state.activeTrajectory}
          activePhase={this.state.activePhase}
          colorScale={this.state.phaseColorScale} />
        <TrackSortContainer />
        {trackComponents}
      </div>
    );
  }
});

module.exports = BrowserContainer;
