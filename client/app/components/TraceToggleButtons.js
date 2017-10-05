var React = require("react");
var PropTypes = React.PropTypes;
var ToggleButtonContainer = require("../containers/ToggleButtonContainer");

function TraceToggleButtons(props) {
  var style = {
    width: "100%",
    height: props.height,
    cursor: "pointer"
  };

  var buttons = props.traces.map(function (trace, i) {
    function handleClick() {
      props.onClick(trace);
    }

    return (
      <div key={i} style={style}>
        <ToggleButtonContainer
          selected={trace.selected}
          onClick={handleClick} />
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

TraceToggleButtons.propTypes = {
  traces: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = TraceToggleButtons;
