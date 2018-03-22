var React = require("react");
var PropTypes = require("prop-types");

function ComputeModelFitButton(props) {
  return (
    <button
      type="button"
      className={"btn btn-success" + (props.disabled ? " disabled" : "")}
      onClick={props.onClick}>
        {props.label}
    </button>
  );
}

ComputeModelFitButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = ComputeModelFitButton;
