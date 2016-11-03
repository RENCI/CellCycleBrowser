// Controller-view for the browser area

var React = require("react");
var CellDataStore = require("../stores/CellDataStore");
var ModelStore = require("../stores/ModelStore");
var FeatureStore = require("../stores/FeatureStore");
var SimulationOutputStore = require("../stores/SimulationOutputStore");
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

function getStateFromSimulationOutputStore() {
  return {
    simulationOutput: SimulationOutputStore.getSimulationOutput()
  }
}

function getStateFromAlignmentStore() {
  return {
    alignment: AlignmentStore.getAlignment()
  }
}

// Enable bootstrap tooltips
// XXX: This will search the entire page, should perhaps use selector within
// this element
function tooltips() {
  $(".cell").tooltip({
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
      simulationOutput: getStateFromSimulationOutputStore().simulationOutput,
      alignment: getStateFromAlignmentStore().alignment
    };
  },
  componentDidMount: function () {
    CellDataStore.addChangeListener(this.onCellDataChange);
    ModelStore.addChangeListener(this.onModelChange);
    FeatureStore.addChangeListener(this.onFeatureChange);
    SimulationOutputStore.addChangeListener(this.onSimulationOutputChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
    tooltips();
  },
  componentWillUnmount: function() {
    CellDataStore.removeChangeListener(this.onCellDataChange);
    ModelStore.removeChangeListener(this.onModelChange);
    FeatureStore.removeChangeListener(this.onFeatureChange);
    SimulationOutputStore.removeChangeListener(this.onSimulationOutputChange);
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
  onSimulationOutputChange: function () {
    this.setState(getStateFromSimulationOutputStore());
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
      // Get simulation output data for this species
      var simulationData = null;
      if (this.state.simulationOutput) {
        // Search for name in case indeces have been switched
        var index = this.state.simulationOutput.species.map(function (s) {
          return s.name;
        }).indexOf(species.name);

        if (index >= 0) {
          simulationData = [this.state.simulationOutput.species[index].values];
        }
      }

      return (
        <Species
          key={i}
          name={species.name}
          cells={species.cells}
          featureKey={this.state.featureKey}
          simulationData={simulationData}
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
