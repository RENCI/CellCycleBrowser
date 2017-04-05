var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ModelStore = require("./ModelStore");
var CellDataStore = require("./CellDataStore");
var SimulationOutputStore = require("./SimulationOutputStore");
var FeatureStore = require("./FeatureStore");
var AlignmentStore = require("./AlignmentStore");

var CHANGE_EVENT = "change";

// Input data sets
var model = {};
var cellData = {};
var simulationOutput = [];

// Input parameters
var feature = "";
var alignment = "";

// Output data
var data = {
  species: [],
  phases: [],
  timeExtent: []
};

function updateData() {
  var data = {};

  // Get data for each species
  data.species = mapSpecies(cellData, model);

  // Compute time extent across all data
  data.timeExtent = computeTimeExtent(data.species);

  // Map phase time steps to actual time
  data.phases = mapPhases(simulationOutput);

  return data;

  function mapSpecies(cellData, model) {
    // Get the list of species present in cell data or model
    var cellSpecies = cellData.species;
    var modelSpecies = model.species ? model.species : [];
    var allSpecies = [];

    cellSpecies.concat(modelSpecies).forEach(function(species) {
      if (allSpecies.indexOf(species.name) === -1) allSpecies.push(species.name);
    });

    // Combine cell data and simulation output per species
    return allSpecies.map(function(species) {
      // Cell data for this species
      var cd = [];
      for (var i = 0; i < cellSpecies.length; i++) {
        if (cellSpecies[i].name === species) {
          cd = cellSpecies[i].cells.map(function(cell) {
            var featureIndex = cell.features.map(function(d) {
              return d.name;
            }).indexOf(feature);

            return {
              name: cell.name,
              values: cell.features[featureIndex].values.map(function(d, i, a) {
                return {
                  start: d.time,
                  stop: i < a.length - 1 ? a[i + 1].time : d.time + (d.time - a[i - 1].time),
                  value: d.value
                };
              })
            };
          });

          break;
        }
      }

      // Simulation output for this species
      var so = [];
      simulationOutput.forEach(function(trajectory) {
        var index = trajectory.species.map(function(s) {
          return s.name;
        }).indexOf(species);

        if (index >= 0) {
          so.push(trajectory.timeSteps.map(function(d, j, a) {
            return {
              value: trajectory.species[index].values[j],
              start: d,
              stop: j < a.length - 1 ? a[j + 1] : d + (d - a[j - 1])
            };
          }));
        }
      });

      return {
        name: species,
        cellData: cd,
        simulationOutput: so
      };
    });
  }

  function computeTimeExtent(species) {
    var timeExtent = [];

    species.forEach(function(species) {
      species.cellData.forEach(function(d) {
        var first = d.values[0];
        var last = d.values[d.values.length - 1];

        timeExtent.push(first.start, last.stop);
      });

      species.simulationOutput.forEach(function(d) {
        var first = d[0];
        var last = d[d.length - 1];

        timeExtent.push(first.start, last.stop);
      });
    });

    return [ Math.min.apply(null, timeExtent), Math.max.apply(null, timeExtent) ];
  }

  function mapPhases(simulationOutput) {
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
}

var DataStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getData: function () {
    return data;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE:
      AppDispatcher.waitFor([ModelStore.dispatchToken,
                             CellDataStore.dispatchToken,
                             SimulationOutputStore.dispatchToken,
                             FeatureStore.dispatchToken]);

      model = ModelStore.getModel();
      cellData = CellDataStore.getCellData();
      simulationOutput = SimulationOutputStore.getSimulationOutput();
      feature = FeatureStore.getFeatureList()[FeatureStore.getFeatureKey()];
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_MODEL:
      AppDispatcher.waitFor([ModelStore.dispatchToken]);
      model = ModelStore.getModel();
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_CELL_DATA:
      AppDispatcher.waitFor([CellDataStore.dispatchToken,
                             FeatureStore.dispatchToken]);
      cellData = CellDataStore.getCellData();
      feature = FeatureStore.getFeatureList()[FeatureStore.getFeatureKey()];
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.RECEIVE_SIMULATION_OUTPUT:
      AppDispatcher.waitFor([SimulationOutputStore.dispatchToken]);
      simulationOutput = SimulationOutputStore.getSimulationOutput();
      state = Constants.SIMULATION_OUTPUT_VALID;
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_FEATURE:
      AppDispatcher.waitFor([FeatureStore.dispatchToken]);
      feature = FeatureStore.getFeatureList()[FeatureStore.getFeatureKey()];
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_ALIGNMENT:
      AppDispatcher.waitFor([AlignmentStore.dispatchToken]);
      alignment = AlignmentStore.getAlignment();
      data = updateData();
      DataStore.emitChange();
      break;
  }
});

module.exports = DataStore;
