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
  marginLeft: 10,
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
  return (
    <div>
      <div style={alignmentStyle}>
        <AlignmentSelectContainer />
      </div>
      <div className="text-left" style={outerStyle}>
        <div className="row" style={rowStyle}>
          <div className="col-md-2">
            <div style={labelStyle}>
              Time (h)
            </div>
          </div>
          <div className="col-md-10 text-left" style={timeLineStyle}>
            <TimeScaleContainer timeExtent={props.timeExtent} />
          </div>
        </div>
      </div>
    </div>
  );
}

TimeScale.propTypes = {
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired
};

module.exports = TimeScale;
