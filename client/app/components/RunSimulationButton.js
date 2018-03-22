var React = require("react");
var PropTypes = require("prop-types");

var divStyle = {
  width: "100%",
  display: "flex"
};

var buttonStyle = {
  flexGrow: 1
};

function RunSimulationButton(props) {
  return (
    <div className="btn-group" style={divStyle}>
      <button
        type="button"
        className={"btn btn-success" + (props.disabled ? " disabled" : "")}
        style={buttonStyle}
        onClick={props.onClick}>
          {props.label}
      </button>
      {!props.disabled ? null :
        <button
          type="button"
          className="btn btn-danger"
          onClick={props.onCancel}>
            <span>&times;</span>
        </button>}
    </div>
  );
}

RunSimulationButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

module.exports = RunSimulationButton;
