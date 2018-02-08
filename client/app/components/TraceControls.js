var React = require("react");
var PropTypes = React.PropTypes;
var TraceControlContainer = require("../containers/TraceControlContainer");

function TraceControls(props) {
  var divStyle = {
    display: "flex",
    height: props.height
  };

  var controlStyle = {
    width: props.width
  };

  var isAverage = props.traces[0].name === "Average";

  var buttons = props.traces.map(function (trace, i) {
    var labelStyle = {
      marginRight: 5,
      verticalAlign: "middle",
      lineHeight: props.height + "px",
      color: trace.selected ? "#000" : "#ccc",
      flex: "1"
    };

    return (
      <div key={i} style={divStyle}>
        {isAverage ? null :
          <div className="text-right small" style={labelStyle}>
            {trace.name}
          </div>}
        <div style={controlStyle}>
          <TraceControlContainer
            trace={trace} />
        </div>
      </div>
    );
  });

  return (
    <div style={{marginTop: isAverage ? 0 : 1}}>
      {buttons}
    </div>
  );
}

TraceControls.propTypes = {
  traces: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

module.exports = TraceControls;
