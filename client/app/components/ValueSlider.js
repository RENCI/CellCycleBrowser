var React = require("react");
var PropTypes = React.PropTypes;

function ValueSlider(props) {
  var strokeWidth = 2;
  var r = props.handleRadius;
  var margin = r + strokeWidth / 2;
  var innerWidth = props.width - margin * 2;
  var height = margin * 2;
  var initialValueRadius = r / 2;

  function toSlider(v) {
    var value = (v - props.min) / (props.max - props.min) * innerWidth;
    return Math.min(Math.max(0, value), innerWidth);
  }

  var gTransform = "translate(" + margin + "," + margin + ")";

  var lineStyle = {
    stroke: "#ccc",
    strokeWidth: 1,
    strokeLinecap: "round",
    pointerEvents: "none"
  };

  var foregroundLineStyle = {
    stroke: "#aaa",
    strokeWidth: strokeWidth,
    pointerEvents: "none"
  };

  var initialValueStyle = {
    fill: "#aaa"
  };

  var handleStyle = {
    fill: props.handleColor,
    stroke: "#aaa",
    strokeWidth: strokeWidth,
    cursor: "pointer"
  };

  function onMouseDown(e) {
    if (e.target !== e.currentTarget) {
      // Must have come from the handle
      props.onMouseDown(e, margin, props.width - margin);
    }
  }

  function onClick(e) {
    props.onClick(e, margin, props.width - margin);
  }

  function ignoreEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <svg
      width={"100%"}
      height={height}
      onMouseDown={onMouseDown}
      onClick={onClick}>
        <g transform={gTransform}>
          <line
            x1={0}
            x2={innerWidth}
            style={lineStyle} />
          <line
            x1={toSlider(props.initialValue)}
            x2={toSlider(props.value)}
            style={foregroundLineStyle} />
          <circle
            cx={toSlider(props.initialValue)}
            r={initialValueRadius}
            style={initialValueStyle}
            onClick={ignoreEvent}
            onDoubleClick={props.onDoubleClick} />
          <circle
            cx={toSlider(props.value)}
            r={r}
            style={handleStyle} />
      </g>
    </svg>
  );
}

ValueSlider.propTypes = {
  initialValue: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  handleRadius: PropTypes.number.isRequired,
  handleColor: PropTypes.string.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired
};

module.exports = ValueSlider;
