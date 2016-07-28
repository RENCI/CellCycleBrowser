// Controller-view for the browser area

var React = require("react");
var CellDataStore = require("../stores/CellDataStore");
var MapStore = require("../stores/MapStore");
var FeatureStore = require("../stores/FeatureStore");
var BrowserControls = require("../components/BrowserControls");
var Species = require("../components/Species");

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

function getStateFromFeatureStore() {
  return {
    featureList: FeatureStore.getFeatureList(),
    featureKey: FeatureStore.getFeatureKey()
  };
}

// Enable bootstrap tooltips
function tooltips() {
  $('[data-toggle="tooltip"]').tooltip({
    container: "body",
    placement: "auto top",
    animation: false
  });
}

var BrowserContainer = React.createClass({
  getInitialState: function () {
    return {
      cellDataList: [],
      cellData: null,
      map: null,
      featureList: [],
      featureKey: ""
    }
  },
  componentDidMount: function () {
    CellDataStore.addChangeListener(this.onCellDataChange);
    MapStore.addChangeListener(this.onMapChange);
    FeatureStore.addChangeListener(this.onFeatureChange);
    tooltips();
  },
  componentWillUnmount: function() {
    CellDataStore.removeChangeListener(this.onCellDataChange);
    MapStore.removeChangeListener(this.onMapChange);
    FeatureStore.removeChangeListener(this.onFeatureChange);
  },
  componentDidUpdate: function () {
    tooltips();
  },
  onCellDataChange: function () {
    this.setState(getStateFromCellDataStore());
  },
  onMapChange: function () {
    this.setState(getStateFromMapStore());
  },
  onFeatureChange: function () {
    this.setState(getStateFromFeatureStore());
  },
  render: function() {
    if (!this.state.featureKey) return null;

    var speciesData = this.state.cellDataList.length > 0
                    ? this.state.cellData.species
                    : [];

    var species = speciesData.map(function (species, i) {
      return (
        <Species
          key={i}
          name={species.name}
          cells={species.cells}
          featureKey={this.state.featureKey} />
      );
    }.bind(this));

    return (
      <div>
        <h2>Browser</h2>
        <BrowserControls
          cellDataList={this.state.cellDataList}
          featureList={this.state.featureList} />
        {species}
      </div>
    );
  }
});

module.exports = BrowserContainer;
