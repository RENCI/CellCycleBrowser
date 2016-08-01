// Controller-view for the browser area

var React = require("react");
var CellDataStore = require("../stores/CellDataStore");
var ModelStore = require("../stores/ModelStore");
var FeatureStore = require("../stores/FeatureStore");
var AlignmentStore = require("../stores/AlignmentStore");
var BrowserControls = require("../components/BrowserControls");
var Species = require("../components/Species");

function getStateFromCellDataStore() {
  return {
    cellDataList: CellDataStore.getCellDataList(),
    cellData: CellDataStore.getCellData(),
  };
};

function getStateFromModelStore() {
  return {
    model: ModelStore.getModel()
  };
}

function getStateFromFeatureStore() {
  return {
    featureList: FeatureStore.getFeatureList(),
    featureKey: FeatureStore.getFeatureKey()
  };
}

function getStateFromAlignmentStore() {
  return {
    alignment: AlignmentStore.getAlignment()
  }
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
      model: null,
      featureList: [],
      featureKey: "",
      alignment: getStateFromAlignmentStore().alignment
    }
  },
  componentDidMount: function () {
    CellDataStore.addChangeListener(this.onCellDataChange);
    ModelStore.addChangeListener(this.onModelChange);
    FeatureStore.addChangeListener(this.onFeatureChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
    tooltips();
  },
  componentWillUnmount: function() {
    CellDataStore.removeChangeListener(this.onCellDataChange);
    ModelStore.removeChangeListener(this.onModelChange);
    FeatureStore.removeChangeListener(this.onFeatureChange);
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
  },
  componentDidUpdate: function () {
    tooltips();
  },
  onCellDataChange: function () {
    this.setState(getStateFromCellDataStore());
  },
  onModelChange: function () {
    this.setState(getStateFromModelStore());
  },
  onFeatureChange: function () {
    this.setState(getStateFromFeatureStore());
  },
  onAlignmentChange: function () {
    this.setState(getStateFromAlignmentStore());
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
          featureKey={this.state.featureKey}
          alignment={this.state.alignment} />
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
