var React = require("react");
var ModelStore = require("../stores/ModelStore");
var ModelParameterSliders = require("../components/ModelParameterSliders");
var SpeciesValueSliders = require("../components/SpeciesValueSliders");
var SpeciesPhaseSliders = require("../components/SpeciesPhaseSliders");
var ViewActionCreators = require("../actions/ViewActionCreators");
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
    ViewActionCreators.changeSpeciesValue(data.species.name, data.value);
  },
  handleSpeciesPhaseSliderChange: function (data) {
    ViewActionCreators.changeSpeciesPhaseValue(data.species.name, data.phase.name, data.value);
  },
  handleButtonClick: function (data) {
    WebAPIUtils.runModel(ModelStore.getModel());
  },
  render: function () {
    if (!this.state.model) return null;

    return (
      <div>
        <h2>Controls</h2>
        <div className="panel">
          <button
            type="button"
            className="btn btn-success"
            style={{width: "100%"}}
            onClick={this.handleButtonClick}>
              Run Model
          </button>
        </div>
        <ModelParameterSliders />
        <SpeciesValueSliders
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
