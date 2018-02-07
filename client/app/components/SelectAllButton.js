var React = require("react");
var PropTypes = React.PropTypes;

function SelectAllButton(props) {
  return (
    <button
      type="button"
      className="btn btn-xs btn-success"
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
