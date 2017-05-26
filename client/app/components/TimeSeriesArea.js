var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var TimeSeriesContainer = require("../containers/TimeSeriesContainer");

function TimeSeriesArea(props) {
  return (
    <VisualizationContainer>
      <TimeSeriesContainer />
    </VisualizationContainer>
  );
}

module.exports = TimeSeriesArea;
