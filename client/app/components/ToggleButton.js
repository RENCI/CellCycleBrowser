var React = require("react");
var PropTypes = React.PropTypes;

function ToggleButton(props) {
  var style = {
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc"
  };

  var classes ="btn btn-default" + (props.selected ? " active" : "");

  return (
    <div
      className={classes}
      style={style}
      onClick={props.onClick}>
    </div>
  );
}

ToggleButton.propTypes = {
  selected: PropTypes.bool,
  height: PropTypes.number,
  onClick: PropTypes.func
};

ToggleButton.defaultProps = {
  height: 20,
  selected: false
};

module.exports = ToggleButton;
