// Controller-view for the map area

var React = require("react");
var MapStore = require("../stores/MapStore");
var MapSelectContainer = require("./MapSelectContainer");
var MapVisualizationContainer = require("./MapVisualizationContainer");

function getStateFromStore() {
  return {
    mapList: MapStore.getMapList(),
    map: MapStore.getMap()
  };
}

var MapContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStore();
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
    if (this.state.mapList.length === 0) {
      return null;
    }
    else {
      return (
        <div>
          <h2>Map</h2>
          <MapSelectContainer mapList={this.state.mapList} />
          <MapVisualizationContainer map={this.state.map} />
        </div>
      );
    }
  }
});

module.exports = MapContainer;
