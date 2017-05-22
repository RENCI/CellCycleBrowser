var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var SimulationControlStore = require("../stores/SimulationControlStore");
var PhaseColorStore = require("../stores/PhaseColorStore");
var PhaseStore = require("../stores/PhaseStore");
var d3 = require("d3");
var NetworkMap = require("../visualizations/NetworkMap");
var ViewActionCreators = require("../actions/ViewActionCreators");
var Constants = require("../constants/Constants");

function getStateFromSimulationControlStore() {
  var controls = SimulationControlStore.getControls();

  // Convert controls to model
  // XXX: Use consistent represention for both?
  var model = {};

  model.phases = controls.phases.map(function(d) {
    return {
      name: d
    };
  });

  model.species = controls.species.map(function(d) {
    return {
      name: d,
      min: controls.speciesInitialValues[d].min,
      max: controls.speciesInitialValues[d].max,
      value: controls.speciesInitialValues[d].value
    };
  });

  model.speciesPhaseMatrix = controls.species.map(function(species) {
    return controls.phases.map(function(phase) {
      return controls.speciesPhaseMatrix[species][phase].value;
    });
  });

  model.speciesMatrices = controls.phases.map(function(phase) {
    return controls.species.map(function(species1) {
      return controls.species.map(function(species2) {
        return species1 === species2 ? 0 :
          controls.speciesSpeciesMatrices[phase][species1][species2].value;
      });
    });
  });

  return {
    model: model
  };
}

function getStateFromPhaseColorStore() {
  return {
    phaseColorScale: PhaseColorStore.getColorScale()
  };
}

function getStateFromPhaseStore() {
  return {
    phase: PhaseStore.getPhase()
  };
}

var MapVisualizationContainer = React.createClass ({
  // Don't make propsTypes required, as a warning is given for the first render
  // if using React.cloneElement, as  in VisualizationContainer
  propTypes: {
    width: PropTypes.number
  },
  getInitialState: function () {
    // Create visualization function
    this.networkMap = NetworkMap()
        .on("selectPhase", this.handleSelectPhase)
        .on("selectSpecies", this.handleSelectSpecies);

    return {
      model: null,
      phase: PhaseStore.getPhase(),
      phaseColorScale: PhaseColorStore.getColorScale()
    };
  },
  componentDidMount: function() {
    SimulationControlStore.addChangeListener(this.onSimulationControlChange);
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
  },
  componentWillUnmount: function () {
    SimulationControlStore.removeChangeListener(this.onSimulationControlChange);
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
    PhaseStore.removeChangeListener(this.onPhaseChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props, state);

    return false;
  },
  onSimulationControlChange: function () {
    this.setState(getStateFromSimulationControlStore());
  },
  onPhaseColorChange: function () {
    this.setState(getStateFromPhaseColorStore());
  },
  onPhaseChange: function () {
    this.setState(getStateFromPhaseStore());
  },
  drawVisualization: function (props, state) {
    if (!state.model) return;

    this.networkMap
        .width(props.width)
        .height(props.width)
        .phaseColorScale(state.phaseColorScale)
        .selectPhase(state.phase);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.model)
        .call(this.networkMap);
  },
  handleSelectPhase: function (phase) {
    ViewActionCreators.selectPhase(phase);
  },
  handleSelectSpecies: function (species) {
    networkMap.selectSpecies(species);
  },
  render: function () {
    return <div></div>
  }
});

module.exports = MapVisualizationContainer;
