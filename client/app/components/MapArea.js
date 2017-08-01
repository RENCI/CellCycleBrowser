var React = require("react");
var MapControls = require("./MapControls");
var VisualizationContainer = require("../containers/VisualizationContainer");
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");
var InformationHoverContainer = require("../containers/InformationHoverContainer");
var MapInformation = require("./MapInformation");

function MapArea() {
  return (
    <div>
      <MapControls />
      <div>
        <InformationHoverContainer>
          <MapInformation />
        </InformationHoverContainer>
        <VisualizationContainer>
          <MapVisualizationContainer />
        </VisualizationContainer>
      </div>
    </div>
  );
}

module.exports = MapArea;
