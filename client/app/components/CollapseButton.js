var React = require("react");
var PropTypes = React.PropTypes;

var buttonStyle = {
  borderColor: "#ccc",
  marginTop: -1,
  marginLeft: -1,
  marginBottom: -1,
  borderWidth: 1,
  color: "#aaa"
};

function CollapseButton(props) {
  return (
    <button
      type="button"
      className="btn btn-default text-center"
      style={buttonStyle}
      onClick={props.onClick}>
        {props.collapse ?
          <span className="glyphicon glyphicon-plus" /> :
          <span className="glyphicon glyphicon-minus" />}
    </button>
  );
}

CollapseButton.propTypes = {
  collapse: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = CollapseButton;
