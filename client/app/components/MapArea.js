var React = require("react");
var MapControls = require("./MapControls");
var VisualizationContainer = require("../containers/VisualizationContainer");
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var SaveSvgButtonContainer = require("../containers/SaveSvgButtonContainer");
var MapInformation = require("./MapInformation");

function MapArea() {
  return (
    <div>
      <MapControls />
      <div>
        <InformationHoverContainer>
          <MapInformation />
        </InformationHoverContainer>
        <SaveSvgButtonContainer />
        <VisualizationContainer>
          <MapVisualizationContainer />
        </VisualizationContainer>
      </div>
    </div>
  );
}

module.exports = MapArea;
