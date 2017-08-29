var React = require("react");
var PropTypes = React.PropTypes;
var ToggleButtonContainer = require("../containers/ToggleButtonContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

function TraceToggleButtonContainers(props) {
  var style = {
    width: props.width,
    height: props.height,
    cursor: "pointer"
  };

  var buttons = props.traces.map(function (trace, i) {
    function handleClick() {
      ViewActionCreators.selectTrace(trace, !trace.selected);
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

TraceToggleButtonContainers.propTypes = {
  traces: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

module.exports = TraceToggleButtonContainers;
