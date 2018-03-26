var React = require("react");
var MapControls = require("./MapControls");
var VisualizationWrapper = require("./VisualizationWrapper");
var VisualizationContainer = require("../containers/VisualizationContainer");
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var SaveSvgButtonContainer = require("../containers/SaveSvgButtonContainer");
var MapInformation = require("./MapInformation");

function MapArea() {
  return (
    <div>
      <MapControls />
      <VisualizationWrapper>
        <InformationHoverContainer>
          <MapInformation />
        </InformationHoverContainer>
        <SaveSvgButtonContainer />
        <VisualizationContainer>
          <MapVisualizationContainer />
        </VisualizationContainer>
      </VisualizationWrapper>
    </div>
  );
}

module.exports = MapArea;
