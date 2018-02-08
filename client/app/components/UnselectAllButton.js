var React = require("react");
var PropTypes = React.PropTypes;

var style = {
  height: "100%",
  pointerEvents: "all"
};

function UnselectAllButton(props) {
  return (
    <button
      className="btn btn-xs btn-danger"
      style={style}
      data-toggle="tooltip"
      data-container="body"
      data-placement="auto top"
      data-animation="false"
      title="Unselect all cell features"
      onClick={props.onClick}>
        <span className="glyphicon glyphicon-remove"></span>
    </button>
  );
}

UnselectAllButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

module.exports = UnselectAllButton;
