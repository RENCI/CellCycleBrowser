// Controller-view for the browser area

var React = require("react");
var CellDataStore = require("../stores/CellDataStore");
var MapStore = require("../stores/MapStore");
//var CellDataSelectContainer = require("../containers/CellDataSelectContainer");
var Species = require("../components/Species");

function getStateFromStores() {
  return {
    cellDataList: CellDataStore.getCellDataList(),
    cellData: CellDataStore.getCellData(),
    map: MapStore.getMap()
  };
}

function getStateFromCellDataStore() {
  return {
    cellDataList: CellDataStore.getCellDataList(),
    cellData: CellDataStore.getCellData(),
  };
};

function getStateFromMapStore() {
  return {
    map: MapStore.getMap()
  };
}

var BrowserContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStores();
  },
  componentDidMount: function () {
    CellDataStore.addChangeListener(this.onCellDataChange);
    MapStore.addChangeListener(this.onMapChange);
  },
  componentWillUnmount: function() {
    CellDataStore.removeChangeListener(this.onCellDataChange);
    MapStore.removeChangeListener(this.onMapChange);
  },
  onCellDataChange: function () {
    this.setState(getStateFromCellDataStore());
  },
  onMapChange: function () {
    this.setState(getStateFromMapStore());
  },
  render: function() {
    var speciesData = this.state.cellDataList.length > 0
                    ? this.state.cellData.species
                    : [];

    var species = speciesData.map(function (species, i) {
      return (
        <Species
          key={i}
          name={species.name}
          cells={species.cells} />
      );
    });

    return (
      <div>
        <h2>Browser</h2>
          {species}
      </div>
    );
  }
});

module.exports = BrowserContainer;
