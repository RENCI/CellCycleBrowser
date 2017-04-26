var React = require("react");
var PropTypes = React.PropTypes;

var style = {
  width: "100%"
};

function RunSimulationButton(props) {
  return (
    <button
      type="button"
      className={"btn btn-success" + (props.disabled ? " disabled" : "")}
      style={style}
      onClick={props.onClick}>
        {props.label}
    </button>
  );
}

RunSimulationButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = RunSimulationButton;
