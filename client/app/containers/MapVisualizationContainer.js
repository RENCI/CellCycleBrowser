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

var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5
};

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
  getInitialState: function () {
    return {
      model: null,
      phase: PhaseStore.getPhase(),
      phaseColorScale: PhaseColorStore.getColorScale()
    };
  },
  componentDidMount: function() {
    // Create visualiztion function
    this.networkMap = NetworkMap()
        .on("selectPhase", this.handleSelectPhase)
        .on("selectSpecies", this.handleSelectSpecies);

    SimulationControlStore.addChangeListener(this.onSimulationControlChange);
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);
    PhaseStore.addChangeListener(this.onPhaseChange);

    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUnmount: function () {
    SimulationControlStore.removeChangeListener(this.onSimulationControlChange);
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
    PhaseStore.removeChangeListener(this.onPhaseChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(state);

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
  onResize: function () {
    this.resize();
  },
  drawVisualization: function (state) {
    if (!state.model) return;

    this.networkMap
        .phaseColorScale(state.phaseColorScale)
        .selectPhase(state.phase);

    d3.select(this.getNode())
        .datum(state.model)
        .call(this.networkMap);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    this.networkMap
        .width(width)
        .height(width);

    this.drawVisualization(this.state);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  handleSelectPhase: function (phase) {
    ViewActionCreators.selectPhase(phase);
  },
  handleSelectSpecies: function (species) {
    networkMap.selectSpecies(species);
  },
  render: function () {
    return <div style={divStyle}></div>
  }
});

module.exports = MapVisualizationContainer;
