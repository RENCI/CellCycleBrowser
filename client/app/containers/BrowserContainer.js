// Controller-view for the browser area

var React = require("react");
var DataStore = require("../stores/DataStore");
var AlignmentStore = require("../stores/AlignmentStore");
var TrajectoryStore = require("../stores/TrajectoryStore");
var PhaseColorStore = require("../stores/PhaseColorStore");
var PhaseOverlayStore = require("../stores/PhaseOverlayStore");
var BrowserControls = require("../components/BrowserControls");
var TimeScaleArea = require("../components/TimeScaleArea");
var TrackSort = require("../components/TrackSort");
var PhaseTrack = require("../components/PhaseTrack");
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
      phaseColorScale: PhaseColorStore.getColorScale(),
      showPhaseOverlay: PhaseOverlayStore.getShow(),
      phaseOverlayOpacity: PhaseOverlayStore.getOpacity()
    };
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onDataChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
    TrajectoryStore.addChangeListener(this.onTrajectoryChange);
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);
    PhaseOverlayStore.addChangeListener(this.onPhaseOverlayChange);
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onDataChange);
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
    TrajectoryStore.removeChangeListener(this.onTrajectoryChange);
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
  onPhaseColorChange: function () {
    this.setState(getStateFromPhaseColorStore());
  },
  onPhaseOverlayChange: function () {
    this.setState(getStateFromPhaseOverlayStore());
  },
  render: function() {
    var tracks = this.state.data.tracks;
    var phaseTracks = this.state.data.phaseTracks;

    if (tracks.length < 1) return null;

    // Create GUI components for each track
    var trackComponents = tracks.map(function (track, i) {
      return (
        <div key={i}>
          <TrackDividerContainer
            index={track.index} />
          <Track
            track={track}
            timeExtent={this.state.data.timeExtent}
            phaseColorScale={this.state.phaseColorScale}
            phaseOverlayOpacity={this.state.phaseOverlayOpacity}
            showPhaseOverlay={this.state.showPhaseOverlay} />
        </div>
      );
    }.bind(this));

    // Create GUI components for each phase track
    var phaseTrackComponents = phaseTracks.map(function (track, i) {
      return (
        <PhaseTrack
          key={i}
          track={track}
          timeExtent={this.state.data.timeExtent}
          activeTrajectory={this.state.activeTrajectory}
          activePhase={this.state.activePhase}
          colorScale={this.state.phaseColorScale}
          alignment={this.state.alignment} />
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
        {phaseTrackComponents}
        <TrackSort />
        {trackComponents}
        <TrackDividerContainer
          index={tracks.length} />
      </div>
    );
  }
});

module.exports = BrowserContainer;
