var React = require("react");
var SimulationControlStore = require("../stores/SimulationControlStore");
var PhaseStore = require("../stores/PhaseStore");
var RunSimulationButtonContainer = require("../containers/RunSimulationButtonContainer");
var SimulationParameterSliders = require("../components/SimulationParameterSliders");
var SpeciesValueSliders = require("../components/SpeciesValueSliders");
var SpeciesPhaseSliders = require("../components/SpeciesPhaseSliders");
var SpeciesSpeciesSliders = require("../components/SpeciesSpeciesSliders");
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

function getStateFromPhaseStore() {
  return {
    activePhase: PhaseStore.getPhase()
  };
}

var ControlsContainer = React.createClass ({
  getInitialState: function () {
    return {
      controls: null,
      activePhase: getStateFromPhaseStore().activePhase
    };
  },
  componentDidMount: function () {
    SimulationControlStore.addChangeListener(this.onSimulationControlStoreChange);
    PhaseStore.addChangeListener(this.onPhaseStoreChange);
  },
  componentWillUnmount: function () {
    SimulationControlStore.removeChangeListener(this.onSimulationControlStoreChange);
    PhaseStore.removeChangeListener(this.onPhaseStoreChange);
  },
  onSimulationControlStoreChange: function () {
    this.setState(getStateFromSimulationControlStore());
  },
  onPhaseStoreChange: function () {
    this.setState(getStateFromPhaseStore());
  },
  handleSimulationParameterChange: function (data) {
    ViewActionCreators.changeSimulationParameter(
      data.parameter, data.value
    );
  },
  handleSpeciesSliderChange: function (data) {
    ViewActionCreators.changeSpeciesInitialValue(
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
        <SpeciesValueSliders
          species={this.state.controls.species}
          values={this.state.controls.speciesInitialValues}
          onChange={this.handleSpeciesSliderChange} />
        <SpeciesPhaseSliders
          species={this.state.controls.species}
          phases={this.state.controls.phases}
          matrix={this.state.controls.speciesPhaseMatrix}
          activePhase={this.state.activePhase}
          onChange={this.handleSpeciesPhaseSliderChange} />
        <SpeciesSpeciesSliders
          species={this.state.controls.species}
          phases={this.state.controls.phases}
          matrices={this.state.controls.speciesSpeciesMatrices}
          activePhase={this.state.activePhase}
          onChange={this.handleSpeciesSpeciesSliderChange} />
      </div>
    );
  }
});

module.exports = ControlsContainer;
