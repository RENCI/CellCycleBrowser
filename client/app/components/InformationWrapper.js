var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  color: "black",
  backgroundColor: "white",
  padding: 5,
  marginLeft: -5,
  marginRight: -5,
  borderRadius: 3
};

function InformationWrapper(props) {
  return (
    <div style={divStyle}>
      {props.children}
    </div>
  );
}

module.exports = InformationWrapper;
