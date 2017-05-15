var React = require("react");
var PropTypes = React.PropTypes;
var ModelSelectContainer = require("../containers/ModelSelectContainer");

var outerStyle = {
  marginTop: -1,
  marginBottom: -1
};

function Model(props) {
  return (
    <div style={outerStyle}>
      <ModelSelectContainer />
    </div>
  );
}

module.exports = Model;
