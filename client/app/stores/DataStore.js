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
var alignment = AlignmentStore.getAlignment();

// Output data
var data = {
  species: [],
  phases: [],
  phaseAverage: [],
  timeExtent: []
};

function updateData() {
  // Get data for each species
  data.species = mapSpecies(cellData, model);

  // Compute time extent across all data
  data.timeExtent = computeTimeExtent(data.species);

  // Align data
  alignData(data.species, data.timeExtent, alignment);

  // Average data
  averageData(data.species);

  // Map phase time steps to actual time
  data.phases = mapPhases(simulationOutput, data.timeExtent, alignment);

  // Average phases
  data.phaseAverage = averagePhases(data.phases);

  function mapSpecies(cellData, model) {
    // Get the list of species present in cell data or model
    var cellSpecies = cellData.species ? cellData.species : [];
    var modelSpecies = model.species ? model.species : [];
    var speciesNames = [];

    cellSpecies.concat(modelSpecies).forEach(function (species) {
      if (speciesNames.indexOf(species.name) === -1) speciesNames.push(species.name);
    });

    // Combine cell data and simulation output per species
    return speciesNames.map(function (speciesName) {
      // Cell data for this species
      var cd = [];
      for (var i = 0; i < cellSpecies.length; i++) {
        if (cellSpecies[i].name === speciesName) {
          cd = cellSpecies[i].cells.map(function (cell) {
            var featureIndex = cell.features.map(function (d) {
              return d.name;
            }).indexOf(feature);

            return {
              name: cell.name,
              values: cell.features[featureIndex].values.map(function (d, i, a) {
                return {
                  start: d.time,
                  stop: i < a.length - 1 ? a[i + 1].time : d.time + (d.time - a[i - 1].time),
                  value: d.value
                };
              }).filter(function (d) {
                return !isNaN(d.value);
              })
            };
          });

          break;
        }
      }

      // Simulation output for this species
      var so = [];
      simulationOutput.forEach(function (trajectory) {
        var index = trajectory.species.map(function (s) {
          return s.name;
        }).indexOf(speciesName);

        if (index >= 0) {
          so.push(trajectory.timeSteps.map(function (d, j, a) {
            return {
              value: trajectory.species[index].values[j],
              start: d,
              stop: j < a.length - 1 ? a[j + 1] : d + (d - a[j - 1])
            };
          }));
        }
      });

      return {
        name: speciesName,
        cellData: cd,
        cellDataExtent: dataExtent(cd.map(function(d) { return d.values; })),
        simulationOutput: so,
        simulationOutputExtent: dataExtent(so)
      };
    });
  }

  function dataExtent(timeSeries) {
    if (timeSeries.length === 0) return [];

    var min = Math.min.apply(null, timeSeries.map(function (d) {
      return Math.min.apply(null, d.map(function (d) { return d.value; }));
    }));

    var max = Math.max.apply(null, timeSeries.map(function (d) {
      return Math.max.apply(null, d.map(function (d) { return d.value; }));
    }));

    return [min, max];
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

  function alignData(species, timeExtent, alignment) {
    species.forEach(function (species) {
      species.cellData.map(function (d) {
        return d.values;
      }).forEach(align);

      species.simulationOutput.forEach(align);
    });

    function align(timeSeries) {
      if (alignment === "left") {
        var shift = timeExtent[0] - timeSeries[0].start;

        timeSeries.forEach(function(d) {
          d.start += shift;
          d.stop += shift;
        });
      }
      else if (alignment === "right") {
        var shift = timeExtent[1] - timeSeries[timeSeries.length - 1].stop;

        timeSeries.forEach(function(d) {
          d.start += shift;
          d.stop += shift;
        });
      }
      else if (alignment === "justify") {
        // Domain and range
        var d0 = timeSeries[0].start;
        var dw = timeSeries[timeSeries.length - 1].stop - d0;
        var r0 = timeExtent[0];
        var rw = timeExtent[1] - r0;

        function justify(x) {
          return r0 + (x - d0) / dw * rw;
        }

        timeSeries.forEach(function(d) {
          d.start = justify(d.start);
          d.stop = justify(d.stop);
        });
      }
    }
  }

  function averageData(species) {
    species.forEach( function(species) {
      species.cellDataAverage = average(species.cellData.map(function (d) { return d.values; }));
      species.simulationOutputAverage = average(species.simulationOutput);
    });

    function average(timeSeries) {
      if (timeSeries.length === 0) return [];

      // Get the average time step
      var allTimeSteps = [].concat.apply([], timeSeries);

      var delta = allTimeSteps.reduce(function (p, c) {
        return p + (c.stop - c.start);
      }, 0) / allTimeSteps.length;

      // Generate time steps
      var start = Math.min.apply(null, timeSeries.map( function(d) {
        return d[0].start;
      }));

      var stop = Math.max.apply(null, timeSeries.map( function(d) {
        return d[d.length - 1].stop;
      }));

      var timeSteps = [];
      var n = (stop - start) / delta;
      for (var i = 0; i < n; i++) {
        var t = start + i * delta;

        timeSteps.push({
          start: t,
          stop: t + delta
        });
      }

      // Keep track of time step per array
      var t = timeSeries.map(function () {
        return 0;
      });

      timeSteps.forEach(function (timeStep) {
        var value = 0;
        var count = 0;

        timeSeries.forEach(function (d, i) {
          // Find overlapping time steps
          for (var j = t[i]; j < d.length; j++) {
            if (d[j].stop >= timeStep.start && d[j].start < timeStep.stop) {
              value += d[j].value;
              count++;
              t[i] = j;
            }
            else if (d[j].start >= timeStep.stop) {
              break;
            }
          }
        });

        timeStep.value = count > 0 ? value / count : 0;
      });

      return timeSteps;
    }
  }

  function mapPhases(simulationOutput, timeExtent, alignment) {
    return simulationOutput.map(function(trajectory) {
      var timeSteps = trajectory.timeSteps;

      // XXX: Return a closure to save state
      function align(x) {
        if (alignment === "left") {
          var shift = timeExtent[0] - timeSteps[0];

          return x + shift;
        }
        else if (alignment === "right") {
          var shift = timeExtent[1] - timeSteps[timeSteps.length - 1];

          return x + shift;
        }
        else if (alignment === "justify") {
          // Domain and range
          var d0 = timeSteps[0];
          var dw = timeSteps[timeSteps.length - 1] - d0;
          var r0 = timeExtent[0];
          var rw = timeExtent[1] - r0;

          return r0 + (x - d0) / dw * rw
        }
      }

      return trajectory.phases.map(function(phase) {
        return {
          name: phase.name,
          start: align(timeSteps[phase.start]),
          stop: align(timeSteps[phase.stop]),
          subPhases: phase.subPhases.map(function(subPhase) {
            return {
              name: subPhase.name,
              start: align(timeSteps[subPhase.start]),
              stop: align(timeSteps[subPhase.stop])
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

  function averagePhases(phases) {
    var average = [];

    phases.forEach(function (trajectory, i) {
      trajectory.forEach(function (phase, j) {
        if (i === 0) {
          average.push({
            name: phase.name,
            start: 0,
            stop: 0
          });
        }

        average[j].start += phase.start;
        average[j].stop += phase.stop;
      });
    });

    average.forEach(function (phase) {
      phase.start /= phases.length;
      phase.stop /= phases.length;
    });

    return average;
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
      updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_MODEL:
      AppDispatcher.waitFor([ModelStore.dispatchToken]);
      model = ModelStore.getModel();
      updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_CELL_DATA:
      AppDispatcher.waitFor([CellDataStore.dispatchToken,
                             FeatureStore.dispatchToken]);
      cellData = CellDataStore.getCellData();
      feature = FeatureStore.getFeatureList()[FeatureStore.getFeatureKey()];
      updateData();
      DataStore.emitChange();
      break;

    case Constants.RECEIVE_SIMULATION_OUTPUT:
      AppDispatcher.waitFor([SimulationOutputStore.dispatchToken]);
      simulationOutput = SimulationOutputStore.getSimulationOutput();
      state = Constants.SIMULATION_OUTPUT_VALID;
      updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_FEATURE:
      AppDispatcher.waitFor([FeatureStore.dispatchToken]);
      feature = FeatureStore.getFeatureList()[FeatureStore.getFeatureKey()];
      updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_ALIGNMENT:
      AppDispatcher.waitFor([AlignmentStore.dispatchToken]);
      alignment = AlignmentStore.getAlignment();
      updateData();
      DataStore.emitChange();
      break;
  }
});

module.exports = DataStore;