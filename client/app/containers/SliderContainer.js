var React = require("react");
var PropTypes = React.PropTypes;
var Slider = require("../components/Slider");

var SliderContainer = React.createClass ({
  propTypes: {
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    steps: PropTypes.number,
    initialValue: PropTypes.number,
    onChange: PropTypes.func.isRequired
  },
  getDefaultProps: function () {
    return {
      label: "",
      min: 0,
      max: 1,
      steps: 100,
      initialValue: 0.5
    };
  },
  getInitialState: function () {
    return {
      value: this.props.initialValue
    };
  },
  handleChange: function (sliderValue) {
    var value = this.sliderToValue(sliderValue);

    this.setState({
      value: value
    });

    this.props.onChange(value);
  },
  componentWillReceiveProps: function (nextProps) {
    // Clamp value
    var value = Math.min(nextProps.max, Math.max(this.state.value, nextProps.min));

    if (value !== this.state.value) {
      this.setState({
        value: value
      });
    }
  },
  sliderToValue: function (sliderValue) {
    return this.props.min + sliderValue / this.props.steps * (this.props.max - this.props.min);
  },
  valueToSlider: function (value) {
    return (value - this.props.min) / (this.props.max - this.props.min) * this.props.steps;
  },
  render: function () {
    return (
      <Slider
        label={this.props.label}
        min={0}
        max={this.props.steps}
        value={this.valueToSlider(this.state.value)}
        onChange={this.handleChange} />
    );
  }
});

module.exports = SliderContainer;
