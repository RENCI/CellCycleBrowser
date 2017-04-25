var React = require("react");
var PropTypes = React.PropTypes;

var buttonStyle = {
  width: 35,
  borderColor: "#ccc",
  marginTop: -1,
  marginLeft: -1,
  marginBottom: -1,
  borderWidth: 1
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
