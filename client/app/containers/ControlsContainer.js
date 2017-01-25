var React = require("react");
var SimulationControlStore = require("../stores/SimulationControlStore");
var RunSimulationButtonContainer = require("../containers/RunSimulationButtonContainer");
var SimulationParameterSliders = require("../components/SimulationParameterSliders");
var SpeciesValueSliders = require("../components/SpeciesValueSliders");
var SpeciesPhaseSliders = require("../components/SpeciesPhaseSliders");
var SpeciesSpeciesSliders = require("../components/SpeciesSpeciesSliders");
var ViewActionCreators = require("../actions/ViewActionCreators");
var WebAPIUtils = require("../utils/WebAPIUtils");

function getStateFromStore() {
  return {
    controls: SimulationControlStore.getControls()
  };
}

var ControlsContainer = React.createClass ({
  getInitialState: function () {
    return {
      controls: null
    };
  },
  componentDidMount: function () {
    SimulationControlStore.addChangeListener(this.onSimulationControlStoreChange);
  },
  componentWillUnmount: function () {
    SimulationControlStore.removeChangeListener(this.onSimulationControlStoreChange);
  },
  onSimulationControlStoreChange: function () {
    this.setState(getStateFromStore());
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
      <div>
        <h2>Controls</h2>
        <div className="panel">
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
          onChange={this.handleSpeciesPhaseSliderChange} />
        <SpeciesSpeciesSliders
          species={this.state.controls.species}
          phases={this.state.controls.phases}
          matrices={this.state.controls.speciesSpeciesMatrices}
          onChange={this.handleSpeciesSpeciesSliderChange} />
      </div>
    );
  }
});

module.exports = ControlsContainer;
