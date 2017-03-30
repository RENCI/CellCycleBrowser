// Controller-view for the browser area

var React = require("react");
var CellDataStore = require("../stores/CellDataStore");
var ModelStore = require("../stores/ModelStore");
var FeatureStore = require("../stores/FeatureStore");
var SimulationOutputStore = require("../stores/SimulationOutputStore");
var AlignmentStore = require("../stores/AlignmentStore");
var TrajectoryStore = require("../stores/TrajectoryStore");
var PhaseStore = require("../stores/PhaseStore");
var PhaseOverlayStore = require("../stores/PhaseOverlayStore");
var BrowserControls = require("../components/BrowserControls");
var Phases = require("../components/Phases");
var Species = require("../components/Species");

var DataStore = require("../stores/DataStore");

function computeTimeExtent(cellData, simulationOutput) {
  // Get time extent across cell and simulation data
  var timeExtent = [];

  if (cellData.species.length > 0) {
    var values = cellData.species[0].cells[0].features[0].values.map(function(d) {
      return d.time;
    });

    timeExtent.push(Math.min.apply(null, values));
    timeExtent.push(Math.max.apply(null, values));
  }

  if (simulationOutput.length > 0) {
    var values = [].concat.apply([], simulationOutput.map(function(trajectory) {
      return trajectory.timeSteps;
    }));

    timeExtent.push(Math.min.apply(null, values));
    timeExtent.push(Math.max.apply(null, values));
  }

  return [ Math.min.apply(null, timeExtent), Math.max.apply(null, timeExtent) ];
}

function phaseData(simulationOutput) {
  // Map phase time steps to actual time
  return simulationOutput.map(function(trajectory) {
    var timeSteps = trajectory.timeSteps;

    return trajectory.phases.map(function(phase) {
      return {
        name: phase.name,
        start: timeSteps[phase.start],
        stop: timeSteps[phase.stop],
        subPhases: phase.subPhases.map(function(subPhase) {
          return {
            name: subPhase.name,
            start: timeSteps[subPhase.start],
            stop: timeSteps[subPhase.stop]
          };
        }).sort(function(a, b) {
          return a.start - b.start;
        })
      };
    }).sort(function(a, b) {
      return a.start - b.start;
    });
  });
}

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
  }
}

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

function getStateFromTrajectoryStore() {
  return {
    activeTrajectory: TrajectoryStore.getTrajectory()
  }
}

function getStateFromPhaseStore() {
  return {
    activePhase: PhaseStore.getPhase()
  }
}

function getStateFromPhaseOverlayStore() {
  return {
    showPhaseOverlay: PhaseOverlayStore.getShow(),
    phaseOverlayOpacity: PhaseOverlayStore.getOpacity()
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
      data: getStateFromDataStore().data,
      cellDataList: [],
      cellData: null,
      model: null,
      featureList: [],
      featureKey: "",
      simulationOutput: getStateFromSimulationOutputStore().simulationOutput,
      alignment: getStateFromAlignmentStore().alignment,
      activeTrajectory: getStateFromTrajectoryStore().activeTrajectory,
      activePhase: getStateFromPhaseStore().activePhase,
      showPhaseOverlay: getStateFromPhaseOverlayStore().showPhaseOverlay,
      phaseOverlayOpacity: getStateFromPhaseOverlayStore().phaseOverlayOpacity
    };
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onDataChange);
    CellDataStore.addChangeListener(this.onCellDataChange);
    ModelStore.addChangeListener(this.onModelChange);
    FeatureStore.addChangeListener(this.onFeatureChange);
    SimulationOutputStore.addChangeListener(this.onSimulationOutputChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
    TrajectoryStore.addChangeListener(this.onTrajectoryChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
    PhaseOverlayStore.addChangeListener(this.onPhaseOverlayChange);
    tooltips();
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onDataChange);
    CellDataStore.removeChangeListener(this.onCellDataChange);
    ModelStore.removeChangeListener(this.onModelChange);
    FeatureStore.removeChangeListener(this.onFeatureChange);
    SimulationOutputStore.removeChangeListener(this.onSimulationOutputChange);
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
    TrajectoryStore.removeChangeListener(this.onTrajectoryChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
    PhaseOverlayStore.removeChangeListener(this.onPhaseOverlayChange);
  },
  componentDidUpdate: function () {
    tooltips();
  },
  onDataChange: function () {
    this.setState(getStateFromDataStore());
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
  onTrajectoryChange: function () {
    this.setState(getStateFromTrajectoryStore());
  },
  onPhaseChange: function () {
    this.setState(getStateFromPhaseStore());
  },
  onPhaseOverlayChange: function () {
    this.setState(getStateFromPhaseOverlayStore());
  },
  render: function() {
    if (!this.state.featureKey) return null;

// XXX: TEST DATA
//this.state.simulationOutput = testData;

    var allPhaseData = phaseData(this.state.simulationOutput);

    // Get the list of species present in cell data or model
    var cellSpecies = this.state.cellData.species;
    var modelSpecies = this.state.model.species ? this.state.model.species : [];
    var allSpecies = [];

    cellSpecies.forEach(function(species) {
      if (allSpecies.indexOf(species.name) === -1) allSpecies.push(species.name);
    });

    modelSpecies.forEach(function(species) {
      if (allSpecies.indexOf(species.name) === -1) allSpecies.push(species.name);
    });

    var timeExtent = computeTimeExtent(this.state.cellData, this.state.simulationOutput);

    // Create GUI components for each species
    var speciesComponents = allSpecies.map(function(species, i) {
      // Cell data
      var cellData = [];
      for (var j = 0; j < cellSpecies.length; j++) {
        if (cellSpecies[j].name === species) {
          cellData = cellSpecies[j].cells;
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
          simulationData.push(trajectory.timeSteps.map(function(d, j) {
            return {
              value: trajectory.species[index].values[j],
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
          phases={this.state.showPhaseOverlay ? this.state.activeTrajectory.phases : []}
          phaseData={this.state.showPhaseOverlay ? allPhaseData : [[]]}
          timeExtent={timeExtent}
          alignment={this.state.alignment}
          activePhase={this.state.activePhase}
          phaseOverlayOpacity={this.state.phaseOverlayOpacity} />
      );
    }.bind(this));

    return (
      <div>
        <h2>Browser</h2>
        <BrowserControls
          cellDataList={this.state.cellDataList}
          featureList={this.state.featureList}
          timeExtent={timeExtent} />
        <Phases
          phaseData={allPhaseData}
          timeExtent={timeExtent}
          alignment={this.state.alignment}
          activeTrajectory={this.state.activeTrajectory}
          activePhase={this.state.activePhase} />
        {speciesComponents}
      </div>
    );
  }
});

module.exports = BrowserContainer;
