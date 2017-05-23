var React = require("react");
var PropTypes = React.PropTypes;

function SpeciesDivider(props) {
  var style = {
    width: "100%",
    height: 4,
    borderRadius: 2,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#31708f",
    opacity: props.visible ? 1 : 0
  };

  return (
    <div
      style={style}
      data-index={props.index}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onMouseUp={props.onMouseUp}>
    </div>
  );
}

SpeciesDivider.propTypes = {
  index: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired
};

module.exports = SpeciesDivider;
