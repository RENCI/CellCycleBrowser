var React = require("react");
var PropTypes = React.PropTypes;

function ToggleButton(props) {
  var style = {
    width: "100%",
    height: "100%",
    borderLeft: "1px solid #ccc"
  };

  var classes ="btn-default" + (props.selected ? " active" : "");

  return (
    <label
      className={classes}
      style={style}
      data-value={props.value}
      onClick={props.onClick}>
    </label>
  );
}

ToggleButton.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  selected: PropTypes.bool,
  height: PropTypes.number,
  onClick: PropTypes.func
};

ToggleButton.defaultProps = {
  height: 20,
  selected: false
};

module.exports = ToggleButton;
