var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var DistributionContainer = require("../containers/DistributionContainer");

function DistributionArea(props) {
  return (
    <VisualizationContainer>
      <DistributionContainer />
    </VisualizationContainer>
  );
}

module.exports = DistributionArea;
