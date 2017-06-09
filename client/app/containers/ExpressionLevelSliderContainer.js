var React = require("react");
var PropTypes = React.PropTypes;
var ExpressionLevelSlider = require("../components/ExpressionLevelSlider");

var ExpressionLevelSliderContainer = React.createClass ({
  propTypes: {
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  },
  getDefaultProps: function () {
    return {
      label: "",
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.5
    };
  },
  getInitialState: function () {
    return {
      initialValue: this.props.value,
      value: this.props.value,
      dragging: false
    };
  },
  handleMouseDown: function () {
    this.setState({
      dragging: true
    });
  },
  handleMouseMove: function (value) {
    if (this.state.dragging) {
      this.setState({
        value: value
      });

      this.props.onChange(value);
    }
  },
  handleMouseUp: function () {
    this.setState({
      dragging: false
    });
  },
  handleDoubleClick: function () {
    console.log(e);
  },
  render: function () {
    return (
      <ExpressionLevelSlider
        label={this.props.label}
        initialValue={this.state.initialValue}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        value={this.state.value}
        width={200}
        handleRadius={8}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onDoubleClick={this.handleDoubleClick} />
    );
  }
});

module.exports = ExpressionLevelSliderContainer;
