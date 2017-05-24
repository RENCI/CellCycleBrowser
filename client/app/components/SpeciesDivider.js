var React = require("react");
var PropTypes = React.PropTypes;

function SpeciesDivider(props) {
  var style = {
    width: "100%",
    height: 6,
    borderRadius: 2,
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: "#999",
    opacity: props.visible ? 1 : 0
  };

  return (
    <div
      style={style}
      data-index={props.index}
      onDragOver={props.onDragOver}
      onDragLeave={props.onDragLeave}
      onDrop={props.onDrop}>
    </div>
  );
}

SpeciesDivider.propTypes = {
  index: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};

module.exports = SpeciesDivider;
