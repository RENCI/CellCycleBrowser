var React = require("react");
var SimulationControlStore = require("../stores/SimulationControlStore");
var PhaseStore = require("../stores/PhaseStore");
var RunSimulationButtonContainer = require("../containers/RunSimulationButtonContainer");
var SimulationParameterSliders = require("../components/SimulationParameterSliders");
var ExpressionLevelSliders = require("../components/ExpressionLevelSliders");
var SpeciesPhaseSliders = require("../components/SpeciesPhaseSliders");
var SpeciesSpeciesSliders = require("../components/SpeciesSpeciesSliders");
var PhaseColorStore = require("../stores/PhaseColorStore");
var ViewActionCreators = require("../actions/ViewActionCreators");
var WebAPIUtils = require("../utils/WebAPIUtils");

var style = {
  marginTop: 10
};

var runSimulationStyle = {
  marginBottom: 10
};

function getStateFromSimulationControlStore() {
  return {
    controls: SimulationControlStore.getControls()
  };
}

function getStateFromPhaseColorStore() {
  return {
    phaseColorScale: PhaseColorStore.getColorScale()
  };
}

function getStateFromPhaseStore() {
  return {
    activePhase: PhaseStore.getPhase()
  };
}

var ControlsContainer = React.createClass ({
  getInitialState: function () {
    return {
      controls: SimulationControlStore.getControls(),
      phaseColorScale: PhaseColorStore.getColorScale(),
      activePhase: PhaseStore.getPhase(),
      collapseToggle: false
    };
  },
  componentDidMount: function () {
    SimulationControlStore.addChangeListener(this.onSimulationControlChange);
    PhaseColorStore.addChangeListener(this.onPhaseColorChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
  },
  componentWillUnmount: function () {
    SimulationControlStore.removeChangeListener(this.onSimulationControlChange);
    PhaseColorStore.removeChangeListener(this.onPhaseColorChange);
    PhaseStore.removeChangeListener(this.onPhaseChange);
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
  handleCollapse: function () {
    this.setState({
      collapseToggle: !this.state.collapseToggle
    });
  },
  handleSimulationParameterChange: function (data) {
    ViewActionCreators.changeSimulationParameter(
      data.parameter, data.value
    );
  },
  handleExpressionLevelSliderChange: function (data) {
    ViewActionCreators.changeSpeciesExpressionLevel(
      data.species, data.value
    );
  },
  handleSpeciesPhaseSliderChange: function (data) {
    ViewActionCreators.changeSpeciesPhaseInteraction(
      data.species, data.phase, data.value
    );
  },
  handleSpeciesSpeciesSliderChange: function (data) {
    ViewActionCreators.changeSpeciesSpeciesInteraction(
      data.phase, data.upstream, data.downstream, data.value
    );
  },
  handleButtonClick: function () {
    WebAPIUtils.runSimulation();
  },
  render: function () {
    if (!this.state.controls) return null;

    return (
      <div className="panel panel-default" style={style}>
        <div style={runSimulationStyle}>
          <RunSimulationButtonContainer />
        </div>
        <SimulationParameterSliders
          parameters={this.state.controls.parameters}
          onChange={this.handleSimulationParameterChange} />
        <ExpressionLevelSliders
          species={this.state.controls.species}
          values={this.state.controls.speciesExpressionLevels}
          onChange={this.handleExpressionLevelSliderChange}
          onCollapse={this.handleCollapse} />
        <SpeciesPhaseSliders
          species={this.state.controls.species}
          phases={this.state.controls.phases}
          matrix={this.state.controls.speciesPhaseMatrix}
          phaseColorScale={this.state.phaseColorScale}
          activePhase={this.state.activePhase}
          onChange={this.handleSpeciesPhaseSliderChange}
          onCollapse={this.handleCollapse} />
        <SpeciesSpeciesSliders
          species={this.state.controls.species}
          phases={this.state.controls.phases}
          matrices={this.state.controls.speciesSpeciesMatrices}
          phaseColorScale={this.state.phaseColorScale}
          activePhase={this.state.activePhase}
          onChange={this.handleSpeciesSpeciesSliderChange}
          onCollapse={this.handleCollapse} />
      </div>
    );
  }
});

module.exports = ControlsContainer;
