var React = require("react");
var PropTypes = require("prop-types");

var style = {
  height: "100%",
  pointerEvents: "all"
};

function SelectAllButton(props) {
  return (
    <button
      className="btn btn-xs btn-success"
      style={style}
      data-toggle="tooltip"
      data-container="body"
      data-placement="auto top"
      data-animation="false"
      title="Select all cell features"
      onClick={props.onClick}>
        <span className="glyphicon glyphicon-ok"></span>
    </button>
  );
}

SelectAllButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

module.exports = SelectAllButton;
