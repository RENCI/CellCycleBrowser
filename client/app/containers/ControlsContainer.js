var React = require("react");
var ModelStore = require("../stores/ModelStore");
var SliderContainer = require("./SliderContainer");
var WebAPIUtils = require("../utils/WebAPIUtils");

function getStateFromStore() {
  return {
    model: ModelStore.getModel()
  };
}

function testSlider(value) {
  console.log(value);
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
    WebAPIUtils.sendParameter({
      species: data.species.name,
      value: data.value
    });
  },
  render: function () {
    if (!this.state.model) return null;

    var sliders = this.state.model.species.map(function (species, i) {
      function handleChange(value) {
        this.handleSliderChange({
          species: species,
          value: value
        });
      };

      return (
        <SliderContainer
          key={i}
          label={species.name}
          min={species.min}
          max={species.max}
          initialValue={species.value}
          onChange={handleChange.bind(this)} />
      );
    }.bind(this));

    return (
      <div>
        <h2>Controls</h2>
        {sliders}
      </div>
    );
  }
});

module.exports = ControlsContainer;
