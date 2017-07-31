var React = require("react");
var MapControls = require("./MapControls");
var VisualizationContainer = require("../containers/VisualizationContainer");
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");
var InformationHover = require("./InformationHover");

function MapArea() {
  return (
    <div>
      <MapControls />
      <VisualizationContainer info={<InformationHover />}>
        <MapVisualizationContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = MapArea;
