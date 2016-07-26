// Controller-view for the map area

var React = require("react");
var PropTypes = React.PropTypes;
var MapStore = require("../stores/MapStore");
var MapControls = require("../components/MapControls");
var MapVisualizationContainer = require("./MapVisualizationContainer");

function getStateFromStore() {
  return {
    mapList: MapStore.getMapList(),
    map: MapStore.getMap()
  };
}

var MapContainer = React.createClass({
  getInitialState: function () {
    return {
      mapList: [],
      map: null
    };
  },
  componentDidMount: function () {
    MapStore.addChangeListener(this.onMapChange);
  },
  componentWillUnmount: function() {
    MapStore.removeChangeListener(this.onMapChange);
  },
  onMapChange: function () {
    this.setState(getStateFromStore());
  },
  render: function () {
    if (!this.state.map) return null;

    return (
      <div>
        <h2>Map</h2>
        <MapControls mapList={this.state.mapList} />
        <MapVisualizationContainer map={this.state.map} />
      </div>
    );
  }
});

module.exports = MapContainer;
