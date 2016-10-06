var React = require("react");
var PropTypes = React.PropTypes;
var Slider = require("../components/Slider");

var SliderContainer = React.createClass ({
  propTypes: {
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    initialValue: PropTypes.number,
    onChange: PropTypes.func.isRequired
  },
  getDefaultProps: function () {
    return {
      label: "",
      min: 0,
      max: 1,
      step: 0.1,
      initialValue: 0.5
    };
  },
  getInitialState: function () {
    return {
      value: this.props.initialValue
    };
  },
  handleChange: function (value) {
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
  render: function () {
    return (
      <Slider
        label={this.props.label}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        value={this.state.value}
        onChange={this.handleChange} />
    );
  }
});

module.exports = SliderContainer;
