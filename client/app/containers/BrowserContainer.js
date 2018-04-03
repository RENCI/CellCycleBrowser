// Controller-view for the browser area

var React = require("react");
var ReactDOM = require("react-dom");
var DataStore = require("../stores/DataStore");
var AlignmentStore = require("../stores/AlignmentStore");
var TrajectoryStore = require("../stores/TrajectoryStore");
var PhaseColorStore = require("../stores/PhaseColorStore");
var PhaseOverlayStore = require("../stores/PhaseOverlayStore");
var BrowserControls = require("../components/BrowserControls");
var TimeScaleArea = require("../components/TimeScaleArea");
var TrackSort = require("../components/TrackSort");
var PhaseTrackContainer = require("../containers/PhaseTrackContainer");
var TrackContainer = require("../containers/TrackContainer");
var TrackDividerContainer = require("../containers/TrackDividerContainer");
var InformationHoverContainer = require("./InformationHoverContainer");
var BrowserInformation = require("../components/BrowserInformation");
var RenderUtils = require("../utils/RenderUtils");

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

class BrowserContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      data: DataStore.getData(),
      alignment: AlignmentStore.getAlignment(),
      activeTrajectory: TrajectoryStore.getTrajectory(),
      phaseColorScale: PhaseColorStore.getColorScale(),
      showPhaseOverlay: PhaseOverlayStore.getShow(),
      phaseOverlayOpacity: PhaseOverlayStore.getOpacity(),
      processing: false
    };

    // Need to bind this to callback functions here
    this.onDataChange = this.onDataChange.bind(this);
    this.onAlignmentChange = this.onAlignmentChange.bind(this);
    this.onTrajectoryChange = this.onTrajectoryChange.bind(this);
    this.onPhaseColorChange = this.onPhaseColorChange.bind(this);
    this.onPhaseOverlayChange = this.onPhaseOverlayChange.bind(this);
  }

  componentDidMount() {
    DataStore.addChangeListener(this.onDataChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
    TrajectoryStore.addChangeListener(this.onTrajectoryChange);
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);
    PhaseOverlayStore.addChangeListener(this.onPhaseOverlayChange);

    RenderUtils.hideAlert();
  }

  componentWillUnmount() {
    DataStore.removeChangeListener(this.onDataChange);
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
    TrajectoryStore.removeChangeListener(this.onTrajectoryChange);
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
    PhaseOverlayStore.removeChangeListener(this.onPhaseOverlayChange);
  }

  shouldComponentUpdate(props, state) {
    return !state.processing;
  }

  componentWillReceiveProps() {
    this.updateState();
  }

  componentDidUpdate() {
    RenderUtils.hideAlert();
  }

  onDataChange() {
    this.updateState(getStateFromDataStore());
  }

  onAlignmentChange() {
    this.updateState(getStateFromAlignmentStore());
  }

  onTrajectoryChange() {
    this.updateState(getStateFromTrajectoryStore());
  }

  onPhaseColorChange() {
    this.updateState(getStateFromPhaseColorStore());
  }

  onPhaseOverlayChange() {
    this.updateState(getStateFromPhaseOverlayStore());
  }

  updateState(state) {
    // XXX: I think this is necessary because we are getting state from a store
    // here that is already being retrieved in a parent component. Try passing
    // down that state instead?
    if (!this.div) return;

    RenderUtils.showAlert("Processing Data...");

    this.setState({
      processing: true
    }, function () {
      setTimeout(function () {
        if (!this.div) return;

        this.setState({
          processing: false
        });

        if (state) this.setState(state);
      }.bind(this), 0);
    });
  }

  render() {
    var tracks = this.state.data.tracks;

    if (tracks.length < 1) return null;

    // Create GUI components for each track
    var trackComponents = tracks.map(function (track, i) {
      return (
        <div key={track.id}>
          <TrackDividerContainer
            index={track.index} />
          {track.phaseTrack ?
            <PhaseTrackContainer
              track={track}
              timeExtent={this.state.data.timeExtent}
              activeTrajectory={this.state.activeTrajectory}
              activePhase={this.state.activePhase}
              colorScale={this.state.phaseColorScale}
              alignment={this.state.alignment}
              shiftRight={this.state.data.hasDendrogram}
              processing={false} />
            :
            <TrackContainer
              track={track}
              timeExtent={this.state.data.timeExtent}
              phaseColorScale={this.state.phaseColorScale}
              phaseOverlayOpacity={this.state.phaseOverlayOpacity}
              showPhaseOverlay={this.state.showPhaseOverlay}
              shiftRight={this.state.data.hasDendrogram}
              processing={false} />}
        </div>
      );
    }.bind(this));

    return (
      <div ref={div => this.div = div}>
        <InformationHoverContainer>
          <BrowserInformation />
        </InformationHoverContainer>
        <BrowserControls />
        <TimeScaleArea
          timeExtent={this.state.data.timeExtent}
          alignment={this.state.alignment}
          shiftRight={this.state.data.hasDendrogram} />
        <TrackSort />
        {trackComponents}
        <TrackDividerContainer
          index={tracks.length} />
      </div>
    );
  }
}

module.exports = BrowserContainer;
