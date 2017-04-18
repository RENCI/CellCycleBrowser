var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var SimulationControlStore = require("../stores/SimulationControlStore");
var PhaseStore = require("../stores/PhaseStore");
var d3 = require("d3");
//var ChordMap = require("../visualizations/ChordMap");
var NetworkMap = require("../visualizations/NetworkMap");
var ViewActionCreators = require("../actions/ViewActionCreators");
var Constants = require("../constants/Constants");

// TODO: Move to css file
var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5
};

var networkMap;

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

function getStateFromPhaseStore() {
  return {
    phase: PhaseStore.getPhase()
  };
}

var MapVisualizationContainer = React.createClass ({
  getInitialState: function () {
    return {
      model: null,
      phase: PhaseStore.getPhase()
    };
  },
  componentDidMount: function() {
    networkMap = NetworkMap();

    networkMap
        .on("selectPhase", this.handleSelectPhase)
        .on("selectSpecies", this.handleSelectSpecies);

    SimulationControlStore.addChangeListener(this.onSimulationControlChange);
    PhaseStore.addChangeListener(this.onPhaseChange);

    this.resize();

    window.addEventListener("resize", function() {
      // TODO: Create a store with window resize. Move event listener to
      // top-level container and create a view action there
      this.onResize();
    }.bind(this));
  },
  componentWillUnmount: function () {
    SimulationControlStore.removeChangeListener(this.onSimulationControlChange);
    PhaseStore.removeChangeListener(this.onPhaseChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawMap(state);

    return false;
  },
  onSimulationControlChange: function () {
    this.setState(getStateFromSimulationControlStore());
  },
  onPhaseChange: function () {
    this.setState(getStateFromPhaseStore());
  },
  onResize: function () {
    this.resize();
  },
  drawMap: function (state) {
    if (!state.model) return;

    networkMap.selectPhase(state.phase);

    d3.select(this.getNode())
        .datum(state.model)
        .call(networkMap);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    networkMap
        .width(width)
        .height(width);

    this.drawMap(this.state);
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
    return <div className="Map" style={divStyle}></div>
  }
});

module.exports = MapVisualizationContainer;
