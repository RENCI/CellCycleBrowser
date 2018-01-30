var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  position: "absolute",
  marginTop: 4,
  left: 20,
  pointerEvents: "none"
};

var iconStyle = {
  color: "#aaa",
  pointerEvents: "all"
};

function InformationHover(props) {
  return (
    <div className="text-left" style={divStyle}>
      <label
        className="text-left"
        data-toggle="popover"
        data-container="body"
        data-html="true"
        data-placement="auto right"
        data-trigger="hover">
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
