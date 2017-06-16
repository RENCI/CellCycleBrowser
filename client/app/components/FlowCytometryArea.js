var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var FlowCytometryContainer = require("../containers/FlowCytometryContainer");

function FlowCytometryArea(props) {
  return (
    <VisualizationContainer>
      <FlowCytometryContainer />
    </VisualizationContainer>
  );
}

module.exports = FlowCytometryArea;
