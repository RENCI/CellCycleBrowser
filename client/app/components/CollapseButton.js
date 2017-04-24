var React = require("react");
var PropTypes = React.PropTypes;

var buttonStyle = {
  width: 35,
  borderColor: "#ddd",
  borderTop: "none",
  borderLeft: "none",
  borderWidth: "2px"
};

function CollapseButton(props) {
  return (
    <button
      type="button"
      className="btn btn-default"
      data-toggle="collapse"
      data-target={"#" + props.targetId}
      style={buttonStyle}
      onClick={props.onClick}>
        {props.text}
    </button>
  );
}

CollapseButton.propTypes = {
  text: PropTypes.string.isRequired,
  targetId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = CollapseButton;
