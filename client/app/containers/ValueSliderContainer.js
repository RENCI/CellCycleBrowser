var React = require("react");
var PropTypes = React.PropTypes;
var ReactDOM = require("react-dom");
var ValueSlider = require("../components/ValueSlider");

var ValueSliderContainer = React.createClass ({
  propTypes: {
    // initialValue: PropTypes.number XXX: Should have initialValue here
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    handleRadius: PropTypes.number,
    onChange: PropTypes.func
  },
  getDefaultProps: function () {
    return {
      label: "",
      rightLabel: "",
      sup: "",
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.5,
      handleRadius: 8,
      labelCol: 2
    };
  },
  getInitialState: function () {
    return {
      initialValue: this.props.value,
      value: this.props.value,
      width: 200
    };
  },
  componentDidMount: function () {
    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUnmount: function () {
    window.removeEventListener("resize", this.onResize);

    // Unregister mouse events
    this.unregisterMouseCallbacks();
  },
  onResize: function () {
    this.resize();
  },
  resize: function () {
    this.setState({
      width: this.refs.wrapper.clientWidth
    });
  },
  updateSVG: function (e, sliderMin, sliderMax) {
    // Save svg element and create an svg point for transforming coordinates
    // XXX: Get this after rendering?
    this.svg = e.currentTarget;
    this.svgPoint = this.svg.createSVGPoint();

    // Create function for converting to value from slider position
    this.toValue = function (x) {
      var v = this.props.min + (x - sliderMin) / (sliderMax - sliderMin) * (this.props.max - this.props.min)
      return Math.min(Math.max(this.props.min, v), this.props.max);
    }
  },
  transformPoint: function (e) {
    this.svgPoint.x = e.clientX;
    this.svgPoint.y = e.clientY;

    var point = this.svgPoint.matrixTransform(this.svg.getScreenCTM().inverse());

    return this.toValue(point.x);
  },
  handleMouseDown: function (e, sliderMin, sliderMax) {
    e.preventDefault();

    this.updateSVG(e, sliderMin, sliderMax);

    // Register to receive mouse events on the whole document
    this.registerMouseCallbacks();
  },
  handleClick: function (e, sliderMin, sliderMax) {
    this.updateSVG(e, sliderMin, sliderMax);

    var value = this.transformPoint(e);

    this.setState({
      value: value
    });

    this.props.onChange(value);
  },
  handleMouseMove: function (e) {
    e.stopPropagation();

    var value = this.transformPoint(e);

    this.setState({
      value: value
    });

    this.props.onChange(value);
  },
  handleMouseUp: function () {
    // Unregister mouse events
    this.unregisterMouseCallbacks();
  },
  handleDoubleClick: function (e) {
    e.preventDefault();

    this.setState({
      value: this.state.initialValue
    });

    this.props.onChange(this.state.initialValue);
  },
  registerMouseCallbacks: function () {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  },
  unregisterMouseCallbacks: function () {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  },
  render: function () {
    return (
      <div ref="wrapper">
        <ValueSlider
          initialValue={this.state.initialValue}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.value}
          width={this.state.width}
          handleRadius={this.props.handleRadius}
          onMouseDown={this.handleMouseDown}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick} />
      </div>
    );
  }
});

module.exports = ValueSliderContainer;
