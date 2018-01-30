var React = require("react");
var VisualizationContainer = require("../containers/VisualizationContainer");
var TimeSeriesContainer = require("../containers/TimeSeriesContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var SaveSvgButtonContainer = require("../containers/SaveSvgButtonContainer");
var TimeSeriesInformation = require("./TimeSeriesInformation");

function TimeSeriesArea(props) {
  return (
    <div>
      <InformationHoverContainer>
        <TimeSeriesInformation />
      </InformationHoverContainer>
      <SaveSvgButtonContainer />
      <VisualizationContainer>
        <TimeSeriesContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = TimeSeriesArea;
