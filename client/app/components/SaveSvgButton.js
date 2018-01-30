var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  position: "absolute",
  marginTop: 4,
  right: 20
};

function SaveSvgButton(props) {
  return (
    <a style={divStyle} href={"javascript:;"}>
      <span
        className="glyphicon glyphicon-download-alt"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Save SVG"
        onClick={props.onClick}>
      </span>
    </a>
  );
}

SaveSvgButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

module.exports = SaveSvgButton;
