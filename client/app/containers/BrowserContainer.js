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
var TrackSort = require("../components/TrackSort");
var Phases = require("../components/Phases");
var Track = require("../components/Track");
var TrackDividerContainer = require("../containers/TrackDividerContainer");
var InformationHoverContainer = require("./InformationHoverContainer");
var BrowserInformation = require("../components/BrowserInformation");
var d3 = require("d3");

var refName = "ref";

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
  onDataChange: function () {
    // XXX: I think this is necessary because we are getting state from a store
    // here that is already being retrieved in a parent component. Try passing
    // down that state instead?
    if (this.refs[refName]) {
      this.setState(getStateFromDataStore());
    }
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
  render: function() {
    var tracks = this.state.data.tracks;

    if (tracks.length < 1) return null;

    // Create GUI components for each track
    var trackComponents = tracks.map(function(track, i) {
      return (
        <div key={i}>
          <TrackDividerContainer
            index={track.index} />
          <Track
            track={track}
            phases={this.state.showPhaseOverlay ? this.state.data.phases : [[]]}
            phaseAverage={this.state.showPhaseOverlay ? this.state.data.phaseAverage: []}
            timeExtent={this.state.data.timeExtent}
            activePhases={this.state.showPhaseOverlay ? this.state.activeTrajectory.phases : []}
            activePhase={this.state.activePhase}
            phaseColorScale={this.state.phaseColorScale}
            phaseOverlayOpacity={this.state.phaseOverlayOpacity} />
        </div>
      );
    }.bind(this));

    return (
      <div ref={refName}>
        <InformationHoverContainer>
          <BrowserInformation />
        </InformationHoverContainer>
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
        <TrackSort />
        {trackComponents}
        <TrackDividerContainer
          index={tracks.length} />
      </div>
    );
  }
});

module.exports = BrowserContainer;
