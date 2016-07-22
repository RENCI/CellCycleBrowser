// Controller-view for the browser area

var React = require("react");
var CellDataStore = require("../stores/CellDataStore");
var MapStore = require("../stores/MapStore");
var CellDataSelectContainer = require("./CellDataSelectContainer");
var FeatureSelectContainer = require("./FeatureSelectContainer");
var Species = require("../components/Species");

function species(species, i) {
  return (
    <Species
      key={i}
      name={species.name}
      cells={species.cells} />
  );
}

function features(cellData) {
  if (cellData.species.length === 0) return [];

  return cellData.species[0].cells[0].features;
}

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
  handleFeatureChange: function (e) {
    console.log(e);
  },
  render: function() {
    var speciesData = this.state.cellDataList.length > 0
                    ? this.state.cellData.species
                    : [];

    return (
      <div>
        <h2>Browser</h2>
        <CellDataSelectContainer
          cellDataList={this.state.cellDataList} />
        <FeatureSelectContainer
          featureList={features(this.state.cellData)}
          onChange={this.handleFeatureChange} />
        {speciesData.map(species)}
      </div>
    );
  }
});

module.exports = BrowserContainer;
