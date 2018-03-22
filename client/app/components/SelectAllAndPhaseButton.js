var React = require("react");
var PropTypes = require("prop-types");

var style = {
  height: "100%",
  pointerEvents: "all"
};

function SelectAllAndPhaseButton(props) {
  return (
    <button
      className="btn btn-xs btn-success"
      style={style}
      data-toggle="tooltip"
      data-container="body"
      data-placement="auto top"
      data-animation="false"
      title="Select all cell features and phase"
      onClick={props.onClick}>
        <span className="glyphicon glyphicon-saved"></span>
    </button>
  );
}

SelectAllAndPhaseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

module.exports = SelectAllAndPhaseButton;
