var React = require("react");
var MapControls = require("./MapControls");
var VisualizationContainer = require("../containers/VisualizationContainer");
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");
var InformationHover = require("./InformationHover");
var MapInformation = require("./MapInformation");

function MapArea() {
  // Create information hover for map
  var information = <InformationHover>
    <MapInformation />
  </InformationHover>

  return (
    <div>
      <MapControls />
      <VisualizationContainer info={information}>
        <MapVisualizationContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = MapArea;
