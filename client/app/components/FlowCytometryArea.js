var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var FlowCytometryContainer = require("../containers/FlowCytometryContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var FlowCytometryInformation = require("./FlowCytometryInformation");

function FlowCytometryArea(props) {
  return (
    <div>
      <InformationHoverContainer>
        <FlowCytometryInformation />
      </InformationHoverContainer>
      <VisualizationContainer>
        <FlowCytometryContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = FlowCytometryArea;
