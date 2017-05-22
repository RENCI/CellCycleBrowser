var React = require("react");
var MapControls = require("../components/MapControls");
var VisualizationContainer = require("../containers/VisualizationContainer");
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");

function MapArea(props) {
  return (
    <div>
      <MapControls />
      <VisualizationContainer>
        <MapVisualizationContainer />
      </VisualizationContainer>
    </div>
  );
}

module.exports = MapArea;
