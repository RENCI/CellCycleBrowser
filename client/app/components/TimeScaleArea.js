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
  marginLeft: -5,
  marginBottom: -1
};

var labelStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  fontWeight: "bold"
};

var rowStyle = {
  margin: 0
};

var columnStyle = {
  paddingLeft: 0
};

var timeLineStyle = {
  padding: 0,
  borderLeft: "1px solid #ccc"
};

function TimeScale(props) {
  var unit = props.alignment === "justify" ? "(%)" : "(h)";

  var col1 = props.shiftRight ? "col-xs-3" : "col-xs-2";
  var col2 = props.shiftRight ? "col-xs-9" : "col-xs-10";

  return (
    <div>
      <div style={alignmentStyle}>
        <AlignmentSelectContainer shiftRight={props.shiftRight} />
      </div>
      <div className="text-left" style={outerStyle}>
        <div className="row" style={rowStyle}>
          <div className={col1} style={columnStyle}>
            <div style={labelStyle}>
              Time {unit}
            </div>
          </div>
          <div className={col2 + " text-left"} style={timeLineStyle}>
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
  alignment: PropTypes.string.isRequired,
  shiftRight: PropTypes.bool.isRequired
};

module.exports = TimeScale;
