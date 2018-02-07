var React = require("react");
var PropTypes = React.PropTypes;

function UnselectAllButton(props) {
  return (
    <button
      type="button"
      className="btn btn-xs btn-danger"
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
