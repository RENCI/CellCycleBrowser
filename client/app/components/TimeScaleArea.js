var React = require("react");
var PropTypes = React.PropTypes;
var AlignmentSelectContainer = require("../containers/AlignmentSelectContainer");
var TimeScaleContainer = require("../containers/TimeScaleContainer");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5,
  marginTop: 0,
  marginBottom: 10
};

var alignmentStyle = {
  marginLeft: -6,
  marginBottom: -1
};

var labelStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 5,
  fontWeight: "bold"
};

var rowStyle = {
  marginLeft: -1,
  marginRight: -1
};

var timeLineStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  borderLeft: "1px solid #ccc"
};

function TimeScale(props) {
  var unit = props.alignment === "justify" ? "(%)" : "(h)";

  return (
    <div>
      <div style={alignmentStyle}>
        <AlignmentSelectContainer />
      </div>
      <div className="text-left" style={outerStyle}>
        <div className="row" style={rowStyle}>
          <div className="col-xs-2">
            <div style={labelStyle}>
              Time {unit}
            </div>
          </div>
          <div className="col-xs-10 text-left" style={timeLineStyle}>
            <TimeScaleContainer
              timeExtent={props.timeExtent}
              alignment={props.alignment} />
          </div>
        </div>
      </div>
    </div>
  );
}

TimeScale.propTypes = {
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  alignment: PropTypes.string.isRequired
};

module.exports = TimeScale;
