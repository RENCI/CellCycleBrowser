var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var SimulationControlStore = require("../stores/SimulationControlStore");
var PhaseColorStore = require("../stores/PhaseColorStore");
var InteractionColorStore = require("../stores/InteractionColorStore");
var PhaseStore = require("../stores/PhaseStore");
var d3 = require("d3");
//var NetworkMap = require("../visualizations/NetworkMap");
var LinearNetworkMap2 = require("../visualizations/LinearNetworkMap2");
var ViewActionCreators = require("../actions/ViewActionCreators");

var interactionColorScale = InteractionColorStore.getColorScale();

function createModel(controls) {
  // Convert controls to model
  // XXX: Use consistent represention for both?
  var model = {};

  model.phases = controls.phases.map(function(d) {
    return {
      name: d
    };
  });

  model.species = controls.species.map(function(d) {
/*
    return {
      name: d,
      min: controls.speciesExpressionLevels[d].min,
      max: controls.speciesExpressionLevels[d].max,
      value: controls.speciesExpressionLevels[d].exponent
    };
*/
    return {
      name: d,
      min: controls.speciesDegradations[d].min,
      max: controls.speciesDegradations[d].max,
      value: controls.speciesDegradations[d].exponent
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

  return model;
}

function getStateFromSimulationControlStore() {
  return {
    model: createModel(SimulationControlStore.getControls())
  }
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

class MapVisualizationContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.linearNetworkMap = LinearNetworkMap2()
        .on("selectPhase", this.handleSelectPhase)
        .on("selectSpecies", this.handleSelectSpecies);

    this.state = {
      model: createModel(SimulationControlStore.getControls()),
      phase: PhaseStore.getPhase(),
      phaseColorScale: PhaseColorStore.getColorScale()
    };

    // Need to bind this to callback functions here
    this.onSimulationControlChange = this.onSimulationControlChange.bind(this);
    this.onPhaseColorChange = this.onPhaseColorChange.bind(this);
    this.onPhaseChange = this.onPhaseChange.bind(this);
  }

  componentDidMount() {
    SimulationControlStore.addChangeListener(this.onSimulationControlChange);
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
  }

  componentWillUnmount() {
    SimulationControlStore.removeChangeListener(this.onSimulationControlChange);
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
    PhaseStore.removeChangeListener(this.onPhaseChange);
  }

  shouldComponentUpdate(props, state) {
    this.drawVisualization(props, state);

    return false;
  }

  onSimulationControlChange() {
    this.setState(getStateFromSimulationControlStore());
  }

  onPhaseColorChange() {
    this.setState(getStateFromPhaseColorStore());
  }

  onPhaseChange() {
    this.setState(getStateFromPhaseStore());
  }

  drawVisualization(props, state) {
    if (!state.model) return;

    this.linearNetworkMap
        .width(props.width)
        .height(props.width * this.state.model.phases.length * 0.5)
        .phaseColorScale(state.phaseColorScale)
        .interactionColorScale(interactionColorScale)
        .selectPhase(state.phase);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.model)
        .call(this.linearNetworkMap);
  }

  handleSelectPhase(phase) {
    ViewActionCreators.selectPhase(phase);
  }

  handleSelectSpecies(species) {
    networkMap.selectSpecies(species);
  }

  render() {
    return <div></div>
  }
}

// Don't make propsTypes required, as a warning is given for the first render
// if using React.cloneElement, as  in VisualizationContainer
MapVisualizationContainer.propTypes = {
  width: PropTypes.number
};

module.exports = MapVisualizationContainer;
