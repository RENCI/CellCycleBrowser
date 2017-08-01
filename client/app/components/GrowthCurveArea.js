var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var GrowthCurveContainer = require("../containers/GrowthCurveContainer");
var InformationHover = require("./InformationHover");
var GrowthCurveInformation = require("./GrowthCurveInformation");

function GrowthCurveArea(props) {
  // Create information hover for growth curve
  var information = <InformationHover>
    <GrowthCurveInformation />
  </InformationHover>

  return (
    <VisualizationContainer info={information}>
      <GrowthCurveContainer />
    </VisualizationContainer>
  );
}

module.exports = GrowthCurveArea;
