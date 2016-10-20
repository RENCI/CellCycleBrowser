var React = require("react");
var ModelStore = require("../stores/ModelStore");
var ModelParameterSliders = require("../components/ModelParameterSliders");
var InitialValueSliders = require("../components/InitialValueSliders");
var SpeciesPhaseSliders = require("../components/SpeciesPhaseSliders");
var WebAPIUtils = require("../utils/WebAPIUtils");

function getStateFromStore() {
  return {
    model: ModelStore.getModel()
  };
}

var ControlsContainer = React.createClass ({
  getInitialState: function () {
    return {
      model: null
    };
  },
  componentDidMount: function () {
    ModelStore.addChangeListener(this.onModelChange);
  },
  componentWillUnmount: function () {
    ModelStore.removeChangeListener(this.onModelChange);
  },
  onModelChange: function () {
    this.setState(getStateFromStore());
  },
  handleSpeciesSliderChange: function (data) {
    console.log(data);

    WebAPIUtils.sendParameter({
      species: data.species.name,
      value: data.value
    });
  },
  handleSpeciesPhaseSliderChange: function (data) {
    console.log(data);

    WebAPIUtils.sendParameter({
      species: data.species.name,
      phase: data.phase.name,
      value: data.value
    });
  },
  handleButtonClick: function (data) {
    console.log("CLICK!");
  },
  render: function () {
    if (!this.state.model) return null;

    return (
      <div>
        <h2>Controls</h2>
        <div className="panel">
          <button
            type="button"
            className="btn btn-info"
            style={{width: "100%"}}
            onClick={this.handleButtonClick}>
              Run Model
          </button>
        </div>
        <ModelParameterSliders />
        <InitialValueSliders
          species={this.state.model.species}
          onChange={this.handleSpeciesSliderChange} />
        <SpeciesPhaseSliders
          model={this.state.model}
          onChange={this.handleSpeciesPhaseSliderChange} />
      </div>
    );
  }
});

module.exports = ControlsContainer;
