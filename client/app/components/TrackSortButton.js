var React = require("react");
var PropTypes = require("prop-types");

var iconStyle = {
  color: "#aaa",
  pointerEvents: "none"
};

var buttonClasses = "btn btn-default btn-sm";

function TrackSortButton(props) {
  return (
    <label
      className={buttonClasses}
      data-toggle="tooltip"
      data-container="body"
      data-placement="auto top"
      data-value={props.value}
      title={props.toolTip}
      onClick={props.onClick}>
        <span
          className="glyphicon glyphicon-sort-by-attributes"
          style={iconStyle} />
    </label>
  );
}

TrackSortButton.propTypes = {
  value: PropTypes.string.isRequired,
  toolTip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = TrackSortButton;
