var React = require("react");
var PropTypes = React.PropTypes;
var d3 = require("d3");

function ExpressionLevelSlider(props) {
  var strokeWidth = 2;
  var r = props.handleRadius;
  var margin = r + strokeWidth / 2;
  var innerWidth = props.width - margin * 2;
  var height = margin * 2;
  var initialValueRadius = r / 3;

  var sliderScale = d3.scaleLinear()
      .domain([props.min, props.max])
      .range([0, innerWidth])
      .clamp(true);

  var gTransform = "translate(" + margin + "," + margin + ")";

  var svgStyle = {
    pointerEvents: "all"
  };

  var backgroundLineStyle = {
    stroke: "#ccc",
    strokeWidth: strokeWidth,
    strokeLinecap: "round"
  };

  var foregroundLineStyle = {
    stroke: "#aaa",
    strokeWidth: strokeWidth
  };

  var initialValueStyle = {
    fill: "#aaa"
  };

  var valueStyle = {
    fill: "#fff",
    stroke: "#aaa",
    strokeWidth: strokeWidth
  };

  function onMouseMove(e) {
    var svg = e.currentTarget;
    var svgPoint = svg.createSVGPoint();

    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;

    var point = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

    props.onMouseMove(sliderScale.invert(point.x - margin));
  };

  return (
    <form className="form-horizontal">
      <div className="form-group">
        <label
          className="control-label col-xs-2">
            {props.label}
        </label>
        <div className="col-xs-10">
          <svg
            width={props.width}
            height={height}
            style={svgStyle}
            onMouseMove={onMouseMove}>
              <g transform={gTransform}>
                <line
                  x1={0}
                  x2={innerWidth}
                  style={backgroundLineStyle} />
                <line
                  x1={sliderScale(props.initialValue)}
                  x2={sliderScale(props.value)}
                  style={foregroundLineStyle} />
                <circle
                  cx={sliderScale(props.initialValue)}
                  r={initialValueRadius}
                  style={initialValueStyle}
                  onDoubleClick={props.onDoubleClick} />
                <circle
                  cx={sliderScale(props.value)}
                  r={r}
                  style={valueStyle}
                  onMouseDown={props.onMouseDown}
                  onMouseUp={props.onMouseUp} />
            </g>
          </svg>
        </div>
      </div>
    </form>
  );
}

ExpressionLevelSlider.propTypes = {
  label: PropTypes.string.isRequired,
  initialValue: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  handleRadius: PropTypes.number.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired
};

module.exports = ExpressionLevelSlider;
