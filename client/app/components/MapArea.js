var React = require("react");
var MapControls = require("../components/MapControls");
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");

function MapArea(props) {
  return (
    <div>
      <MapControls />
      <MapVisualizationContainer />
    </div>
  );
}

module.exports = MapArea;
