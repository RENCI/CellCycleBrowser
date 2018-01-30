var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var GrowthCurveContainer = require("../containers/GrowthCurveContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var SaveSvgButtonContainer = require("../containers/SaveSvgButtonContainer");
var GrowthCurveInformation = require("./GrowthCurveInformation");

function GrowthCurveArea(props) {
  return (
    <div>
      <InformationHoverContainer>
        <GrowthCurveInformation />
      </InformationHoverContainer>
      <SaveSvgButtonContainer />
      <VisualizationContainer>
        <GrowthCurveContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = GrowthCurveArea;
