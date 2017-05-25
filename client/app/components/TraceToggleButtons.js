var React = require("react");
var PropTypes = React.PropTypes;
var ToggleButton = require("./ToggleButton");
var ViewActionCreators = require("../actions/ViewActionCreators");

function TraceToggleButtons(props) {
  var style = {
    width: props.width,
    height: props.height,
    marginLeft: "auto",
    marginRight: 0
  };

  var buttons = props.traces.map(function (trace, i) {
    function handleClick() {
      ViewActionCreators.selectTrace(trace, !trace.selected);
    }

    return (
      <div key={i} style={style}>
        <ToggleButton
          selected={trace.selected}
          onClick={handleClick} />
      </div>
    );
  });

  return (
    <div style={{marginTop: -1}}>
      {buttons}
    </div>
  );
}

TraceToggleButtons.propTypes = {
  traces: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

module.exports = TraceToggleButtons;
