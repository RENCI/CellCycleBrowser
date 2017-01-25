var React = require("react");
var PropTypes = React.PropTypes;


function RunSimulationButton(props) {
  return (
    <button
      type="button"
      className={"btn btn-success" + (props.disabled ? " disabled" : "")}
      style={{width: "100%"}}
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
