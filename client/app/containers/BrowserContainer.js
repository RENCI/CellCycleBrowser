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

    // Get the list of species present in cell data or model
    var cellSpecies = this.state.cellData.species;
    var modelSpecies = this.state.model.species;
    var allSpecies = [];

    cellSpecies.forEach(function(species) {
      if (allSpecies.indexOf(species.name) === -1) allSpecies.push(species.name);
    });

    modelSpecies.forEach(function(species) {
      if (allSpecies.indexOf(species.name) === -1) allSpecies.push(species.name);
    });

    // Get time extent across cell and simulation data
    var timeExtent = [];

    if (this.state.cellData.species.length > 0) {
      var values = this.state.cellData.species[0].cells[0].features[0].values.map(function(d) {
        return d.time;
      });

      timeExtent.push(Math.min.apply(null, values));
      timeExtent.push(Math.max.apply(null, values));
    }

    if (this.state.simulationOutput.length > 0) {
      var values = [].concat.apply([], this.state.simulationOutput.map(function(trajectory) {
        return trajectory.timeSteps;
      }));

      timeExtent.push(Math.min.apply(null, values));
      timeExtent.push(Math.max.apply(null, values));
    }

    timeExtent = [ Math.min.apply(null, timeExtent), Math.max.apply(null, timeExtent) ];

    // Create GUI components for each species
    var speciesComponents = allSpecies.map(function(species, i) {
      // Cell data
      var cellData = [];
      for (var i = 0; i < cellSpecies.length; i++) {
        if (cellSpecies[i].name === species) {
          cellData = cellSpecies[i].cells;
          break;
        }
      }

      // Simulation output
      var simulationData = [];
      this.state.simulationOutput.forEach(function(trajectory) {
        var index = trajectory.species.map(function(s) {
          return s.name;
        }).indexOf(species);

        if (index >= 0) {
          simulationData.push(trajectory.timeSteps.map(function(d, i) {
            return {
              value: trajectory.species[index].values[i],
              time: d
            };
          }));
        }
      });

      return (
        <Species
          key={i}
          name={species}
          cells={cellData}
          featureKey={this.state.featureKey}
          simulationData={simulationData}
          timeExtent={timeExtent}
          alignment={this.state.alignment} />
      );
    }.bind(this));

    return (
      <div>
        <h2>Browser</h2>
        <BrowserControls
          cellDataList={this.state.cellDataList}
          featureList={this.state.featureList}
          timeExtent={timeExtent} />
        {speciesComponents}
      </div>
    );
  }
});

module.exports = BrowserContainer;
