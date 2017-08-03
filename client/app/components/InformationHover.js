var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  position: "absolute",
  marginTop: 4,
  marginLeft: 5
};

var iconStyle = {
  color: "#aaa",
  pointerEvents: "none"
};

function InformationHover(props) {
  return (
    <div className="text-left" style={divStyle}>
      <label
        className="text-left"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto right"
        data-html="true">
          <span
            className="glyphicon glyphicon-info-sign"
            style={iconStyle} />
      </label>
      <div className="hidden">
        {props.children}
      </div>
    </div>
  );
}

module.exports = InformationHover;
