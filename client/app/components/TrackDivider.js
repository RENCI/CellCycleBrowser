var React = require("react");
var PropTypes = require("prop-types");

var outerHeight = 12;
var innerHeight = 4;

var outerStyle = {
  width: "100%",
  height: outerHeight,
  backgroundColor: "rgba(0, 0, 0, 0)"
};

function SpeciesDivider(props) {
  var innerStyle = {
    width: "100%",
    height: innerHeight,
    marginTop: (outerHeight - innerHeight) / 2,
    borderRadius: innerHeight / 2,
    backgroundColor: "#999",
    opacity: props.visible ? 1 : 0,
    pointerEvents: "none",
    float: "left"
  };

  return (
    <div
      style={outerStyle}
      onDragEnter={props.onDragEnter}
      onDragOver={props.onDragOver}
      onDragLeave={props.onDragLeave}
      onDrop={props.onDrop}>
        <div style={innerStyle}></div>
    </div>
  );
}

SpeciesDivider.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};

module.exports = SpeciesDivider;
