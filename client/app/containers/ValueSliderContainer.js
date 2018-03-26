var React = require("react");
var PropTypes = require("prop-types");
var ValueSlider = require("../components/ValueSlider");

class ValueSliderContainer extends React.Component {
  constructor() {
    super();

    this.trackClick = true;

    // Need to bind this to callback functions here
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentWillUnmount() {
    // Unregister mouse events
    this.unregisterMouseCallbacks();
  }

  updateSVG(e, sliderMin, sliderMax) {
    // Save svg element and create an svg point for transforming coordinates
    // XXX: Get this after rendering?
    this.svg = e.currentTarget;
    this.svgPoint = this.svg.createSVGPoint();

    // Create function for converting to value from slider position
    this.toValue = function (x) {
      var v = this.props.min + (x - sliderMin) / (sliderMax - sliderMin) * (this.props.max - this.props.min);
      return Math.min(Math.max(this.props.min, v), this.props.max);
    }
  }

  transformPoint(e) {
    this.svgPoint.x = e.clientX;
    this.svgPoint.y = e.clientY;

    var point = this.svgPoint.matrixTransform(this.svg.getScreenCTM().inverse());

    return this.toValue(point.x);
  }

  handleMouseDown(e, sliderMin, sliderMax) {
    e.preventDefault();

    this.updateSVG(e, sliderMin, sliderMax);

    // Register to receive mouse events on the whole document
    this.registerMouseCallbacks();

    this.trackClick = false;
  }

  handleClick(e, sliderMin, sliderMax) {
    if (this.trackClick) {
      this.updateSVG(e, sliderMin, sliderMax);

      var value = this.transformPoint(e);

      this.props.onChange(value);
    }

    this.trackClick = true;
  }

  handleMouseMove(e) {
    e.stopPropagation();

    var value = this.transformPoint(e);

    // Make sure it is possible to select zero
    if ((this.props.value > 0 && value < 0) ||
        (this.props.value < 0 && value > 0)) {
      value = 0;
    }

    this.props.onChange(value);
  }

  handleMouseUp() {
    // Unregister mouse events
    this.unregisterMouseCallbacks();
  }

  handleDoubleClick(e) {
    e.preventDefault();

    this.props.onChange(this.props.initialValue);
  }

  registerMouseCallbacks() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  unregisterMouseCallbacks() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    var initialValueColor = "white";
    var handleColor = initialValueColor;

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
          width={this.props.width}
          handleRadius={this.props.handleRadius}
          handleColor={handleColor}
          initialValueColor={initialValueColor}
          onMouseDown={this.handleMouseDown}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick} />
      </div>
    );
  }
}

ValueSliderContainer.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  initialValue: PropTypes.number,
  value: PropTypes.number,
  handleRadius: PropTypes.number,
  handleColorScale: PropTypes.func,
  onChange: PropTypes.func,
  width: PropTypes.number
};

ValueSliderContainer.defaultProps = {
  min: 0,
  max: 1,
  step: 0.1,
  initialValue: 0.5,
  value: 0.5,
  handleRadius: 8,
  handleColorScale: null
};

module.exports = ValueSliderContainer;
