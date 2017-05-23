var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var GrowthCurveContainer = require("../containers/GrowthCurveContainer");

function GrowthCurveArea(props) {
  return (
    <VisualizationContainer>
      <GrowthCurveContainer />
    </VisualizationContainer>
  );
}

module.exports = GrowthCurveArea;
