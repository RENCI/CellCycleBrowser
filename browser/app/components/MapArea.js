var React = require("react");
var PropTypes = React.PropTypes;
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");

function MapArea(props) {
  return (
    <div>
      <h2>Map</h2>
      <MapVisualizationContainer map={props.maps[0]} />
    </div>
  );
}

MapArea.propTypes = {
  maps: PropTypes.arrayOf(PropTypes.object).isRequired
};

module.exports = MapArea;
