var React = require("react");
var PropTypes = React.PropTypes;

function ToggleButton(props) {
  var style = {
    width: "100%",
    height: "100%",
    backgroundColor: props.mouseDown ||
                     (props.selected && props.mouseOver) ? "#ccc" :
                     props.selected ? "#ddd" : "#fff",
    border: "1px solid",
    borderRadius: 5,
    borderColor: props.mouseOver ? "#999" : "#bbb"
  };

  return (
    <div
      style={style}
      data-toggle="tooltip"
      data-container="body"
      data-placement="auto top"
      data-animation="false"
      title="Toggle time series display"
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onClick={props.onClick}>
    </div>
  );
}

ToggleButton.propTypes = {
  selected: PropTypes.bool.isRequired,
  mouseOver: PropTypes.bool.isRequired,
  mouseDown: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = ToggleButton;
