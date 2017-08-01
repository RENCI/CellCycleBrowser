var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var TimeSeriesContainer = require("../containers/TimeSeriesContainer");
var InformationHover = require("./InformationHover");
var TimeSeriesInformation = require("./TimeSeriesInformation");

function TimeSeriesArea(props) {
  // Create information hover for time series
  var information = <InformationHover>
    <TimeSeriesInformation />
  </InformationHover>

  return (
    <VisualizationContainer info={information}>
      <TimeSeriesContainer />
    </VisualizationContainer>
  );
}

module.exports = TimeSeriesArea;
