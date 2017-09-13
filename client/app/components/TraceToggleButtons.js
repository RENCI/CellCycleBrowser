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

  return (
    <div style={{marginTop: props.traces.length > 1 ? 1 : 0}}>
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
