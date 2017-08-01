var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var TimeSeriesContainer = require("../containers/TimeSeriesContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var TimeSeriesInformation = require("./TimeSeriesInformation");

function TimeSeriesArea(props) {
  return (
    <div>
      <InformationHoverContainer>
        <TimeSeriesInformation />
      </InformationHoverContainer>
      <VisualizationContainer>
        <TimeSeriesContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = TimeSeriesArea;
