var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var FlowCytometryContainer = require("../containers/FlowCytometryContainer");
var InformationHover = require("./InformationHover");
var FlowCytometryInformation = require("./FlowCytometryInformation");

function FlowCytometryArea(props) {
  // Create information hover for flow cytometry
  var information = <InformationHover>
    <FlowCytometryInformation />
  </InformationHover>

  return (
    <VisualizationContainer info={information}>
      <FlowCytometryContainer />
    </VisualizationContainer>
  );
}

module.exports = FlowCytometryArea;
