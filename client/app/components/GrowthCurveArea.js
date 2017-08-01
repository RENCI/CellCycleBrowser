var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var GrowthCurveContainer = require("../containers/GrowthCurveContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var GrowthCurveInformation = require("./GrowthCurveInformation");

function GrowthCurveArea(props) {
  return (
    <div>
      <InformationHoverContainer>
        <GrowthCurveInformation />
      </InformationHoverContainer>
      <VisualizationContainer>
        <GrowthCurveContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = GrowthCurveArea;
