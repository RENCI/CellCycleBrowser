var React = require("react");

var divStyle = {
  width: 500
};

function InformationWrapper(props) {
  return (
    <div style={divStyle}>
      {props.children}
    </div>
  );
}

module.exports = InformationWrapper;
