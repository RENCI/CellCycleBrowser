var React = require("react");
var PropTypes = React.PropTypes;

var iconStyle = {
  color: "#aaa",
  pointerEvents: "none"
};

function InformationHover(props) {
  return (
    <div className="text-left">
      <label
        className="text-left"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto right"
        title={"Information"}>
          <span
            className="glyphicon glyphicon-info-sign"
            style={iconStyle}>
          </span>
      </label>
    </div>
  );
}

module.exports = InformationHover;
