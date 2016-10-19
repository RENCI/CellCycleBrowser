var React = require("react");
var ModelStore = require("../stores/ModelStore");
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
  handleSliderChange: function (data) {
    console.log(data);

    WebAPIUtils.sendParameter({
      species: data.species.name,
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
        <InitialValueSliders
          species={this.state.model.species}
          onChange={this.handleSliderChange} />
        <SpeciesPhaseSliders
          species={this.state.model.species}
          phases={this.state.model.phases}
          onChange={this.handleSliderChange} />
        <button
          type="button"
          className="btn btn-info"
          style={{width: "100%"}}
          onClick={this.handleButtonClick}>
            Run Model
        </button>
      </div>
    );
  }
});

module.exports = ControlsContainer;
