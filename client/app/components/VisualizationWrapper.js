var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");

var style = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderRadius: 5
};

function VisualizationWrapper(props) {
  return (
    <div style={style}>
      {props.children}
    </div>
  );
}

module.exports = VisualizationWrapper;
