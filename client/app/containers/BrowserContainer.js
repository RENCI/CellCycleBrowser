// Controller-view for the browser area

var React = require("react");
var DataStore = require("../stores/DataStore");
var TrajectoryStore = require("../stores/TrajectoryStore");
var PhaseStore = require("../stores/PhaseStore");
var PhaseColorStore = require("../stores/PhaseColorStore");
var PhaseOverlayStore = require("../stores/PhaseOverlayStore");
var BrowserControls = require("../components/BrowserControls");
var Phases = require("../components/Phases");
var Species = require("../components/Species");

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
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

// Enable bootstrap tooltips
// XXX: This will search the entire page, should perhaps use selector within
// this element
function tooltips() {
  $(".cell").tooltip({
    container: "body",
    placement: "auto top",
    animation: false
  });
}

var BrowserContainer = React.createClass({
  getInitialState: function () {
    return {
      data: DataStore.getData(),
      activeTrajectory: TrajectoryStore.getTrajectory(),
      activePhase: PhaseStore.getPhase(),
      phaseColorScale: PhaseColorStore.getColorScale(),
      showPhaseOverlay: PhaseOverlayStore.getShow(),
      phaseOverlayOpacity: PhaseOverlayStore.getOpacity()
    };
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onDataChange);
    TrajectoryStore.addChangeListener(this.onTrajectoryChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);
    PhaseOverlayStore.addChangeListener(this.onPhaseOverlayChange);
    tooltips();
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onDataChange);
    TrajectoryStore.removeChangeListener(this.onTrajectoryChange);
    PhaseStore.removeChangeListener(this.onPhaseChange);
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
    PhaseOverlayStore.removeChangeListener(this.onPhaseOverlayChange);
  },
  componentDidUpdate: function () {
    tooltips();
  },
  onDataChange: function () {
    this.setState(getStateFromDataStore());
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
    var species = this.state.data.species;

    if (species.length < 1) return null;

    // Create GUI components for each species
    var speciesComponents = species.map(function(species, i) {
      return (
        <Species
          key={i}
          species={species}
          phases={this.state.showPhaseOverlay ? this.state.data.phases : [[]]}
          phaseAverage={this.state.showPhaseOverlay ? this.state.data.phaseAverage: []}
          timeExtent={this.state.data.timeExtent}
          activePhases={this.state.showPhaseOverlay ? this.state.activeTrajectory.phases : []}
          activePhase={this.state.activePhase}
          phaseColorScale={this.state.phaseColorScale}
          phaseOverlayOpacity={this.state.phaseOverlayOpacity} />
      );
    }.bind(this));

    return (
      <div>
        <BrowserControls
          timeExtent={this.state.data.timeExtent} />
        <Phases
          phases={this.state.data.phases}
          phaseAverage={this.state.data.phaseAverage}
          timeExtent={this.state.data.timeExtent}
          activeTrajectory={this.state.activeTrajectory}
          activePhase={this.state.activePhase}
          colorScale={this.state.phaseColorScale} />
        {speciesComponents}
      </div>
    );
  }
});

module.exports = BrowserContainer;
