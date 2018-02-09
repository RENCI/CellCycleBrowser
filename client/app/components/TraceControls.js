var React = require("react");
var PropTypes = React.PropTypes;
var TraceControlContainer = require("../containers/TraceControlContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

function TraceControls(props) {
  var controlStyle = {
    width: props.width,
    minWidth: props.width
  };

  var isAverage = props.traces[0].name === "Average";

  var buttons = props.traces.map(function (trace, i) {
    var labelStyle = {
      marginRight: 5,
      verticalAlign: "middle",
      lineHeight: props.height + "px",
      color: trace.selected ? "#000" : "#ccc",
      overflow: "hidden"
    };

    var divStyle = {
      display: "flex",
      height: props.height,
      borderRadius: "5px",
      backgroundColor: trace.highlight === "primary" ? "#ccc" :
                       trace.highlight === "secondary" ? "#f0f0f0" :
                       null
    };

    function handleMouseOver() {
      ViewActionCreators.highlightTrace(trace);
    }

    function handleMouseLeave() {
      ViewActionCreators.highlightTrace(null);
    }

    return (
      <div
        key={i}
        style={divStyle}
        onMouseOver={trace.selected ? handleMouseOver : null}
        onMouseLeave={trace.selected ? handleMouseLeave : null}>
          <div className="text-right small" style={labelStyle}>
            {isAverage ? "" : trace.name}
          </div>
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
