// Controller-view for the map area

var React = require("react");
var MapStore = require("../stores/MapStore");
var MapSelectContainer = require("../containers/MapSelectContainer");
var MapVisualizationContainer = require("../containers/MapVisualizationContainer");

function getStateFromStore() {
  return {
    maps: MapStore.getMaps(),
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
    var maps = this.state.maps.map(function (map, i) {
      return {
        value: i,
        name: map.name
      };
    });

    return (
      <div>
        <h2>Map</h2>
        <MapSelectContainer
          maps={maps}/>
        <MapVisualizationContainer map={this.state.map} />
      </div>
    );
  }
});

module.exports = MapContainer;
