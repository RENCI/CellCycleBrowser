var React = require("react");
var PropTypes = React.PropTypes;
var ToggleButtonContainer = require("../containers/ToggleButtonContainer");

function TraceControls(props) {
  var divStyle = {
    display: "flex",
    height: props.height
  };

  var toggleStyle = {
    cursor: "pointer",
    width: props.width
  };

  var buttons = props.traces.map(function (trace, i) {
    function handleClick() {
      props.onClick(trace);
    }

    var labelStyle = {
      marginRight: 5,
      verticalAlign: "middle",
      lineHeight: props.height + "px",
      color: trace.selected ? "#000" : "#ccc",
      flex: "1"
    };

    var isAverage = trace.name === "Average";

    return (
      <div key={i} style={divStyle}>
        {isAverage ? null :
          <div className="text-right small" style={labelStyle}>
            {trace.name}
          </div>}
        <div style={toggleStyle}>
          <ToggleButtonContainer
            selected={trace.selected}
            onClick={handleClick} />
        </div>
      </div>
    );
  });

  var isAverage = props.traces[0].name === "Average";

  return (
    <div style={{marginTop: isAverage ? 0 : 1}}>
      {buttons}
    </div>
  );
}

TraceControls.propTypes = {
  traces: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = TraceControls;
