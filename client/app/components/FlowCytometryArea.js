var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var FlowCytometryContainer = require("../containers/FlowCytometryContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var SaveSvgButtonContainer = require("../containers/SaveSvgButtonContainer");
var FlowCytometryInformation = require("./FlowCytometryInformation");

function FlowCytometryArea(props) {
  return (
    <div>
      <InformationHoverContainer>
        <FlowCytometryInformation />
      </InformationHoverContainer>
      <SaveSvgButtonContainer />
      <VisualizationContainer>
        <FlowCytometryContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = FlowCytometryArea;
