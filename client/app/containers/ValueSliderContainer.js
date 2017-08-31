var React = require("react");
var PropTypes = React.PropTypes;
var ReactDOM = require("react-dom");
var ValueSlider = require("../components/ValueSlider");

var ValueSliderContainer = React.createClass ({
  propTypes: {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    initialValue: PropTypes.number,
    value: PropTypes.number,
    handleRadius: PropTypes.number,
    handleColorScale: PropTypes.func,
    onChange: PropTypes.func
  },
  getDefaultProps: function () {
    return {
      min: 0,
      max: 1,
      step: 0.1,
      initialValue: 0.5,
      value: 0.5,
      handleRadius: 8,
      handleColorScale: null
    };
  },
  getInitialState: function () {
    return {
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
  componentDidUpdate() {
    if (this.state.width !== this.refs.wrapper.clientWidth) {
      this.resize();
    }
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
      var v = this.props.min + (x - sliderMin) / (sliderMax - sliderMin) * (this.props.max - this.props.min);
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

    this.props.onChange(value);
  },
  handleMouseMove: function (e) {
    e.stopPropagation();

    var value = this.transformPoint(e);

    // Make sure it is possible to select zero
    if ((this.props.value > 0 && value < 0) ||
        (this.props.value < 0 && value > 0)) {
      value = 0;
    }

    this.props.onChange(value);
  },
  handleMouseUp: function () {
    // Unregister mouse events
    this.unregisterMouseCallbacks();
  },
  handleDoubleClick: function (e) {
    e.preventDefault();

    this.props.onChange(this.props.initialValue);
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
    var handleColor = initialValueColor = "white";

    if (this.props.handleColorScale) {
      handleColor = this.props.handleColorScale(this.props.value);
      initialValueColor = this.props.handleColorScale(this.props.initialValue);
    }

    return (
      <div ref="wrapper">
        <ValueSlider
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          initialValue={this.props.initialValue}
          value={this.props.value}
          width={this.state.width}
          handleRadius={this.props.handleRadius}
          handleColor={handleColor}
          initialValueColor={initialValueColor}
          onMouseDown={this.handleMouseDown}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick} />
      </div>
    );
  }
});

module.exports = ValueSliderContainer;
