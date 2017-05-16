var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataSetStore = require("./DataSetStore");
var SimulationOutputStore = require("./SimulationOutputStore");
var AlignmentStore = require("./AlignmentStore");

var CHANGE_EVENT = "change";

// Inputs
var dataSets = [];
var simulationOutput = [];
var alignment = AlignmentStore.getAlignment();

// Output data
var data = {
  tracks: [],
  phases: [],
  phaseAverage: [],
  timeExtent: []
};

function updateData() {
  // Get data for each track
  data.tracks = createTracks(dataSets, simulationOutput);

  // Compute time extent across all data
  data.timeExtent = computeTimeExtent(data.tracks);

  // Align data
  alignData(data.tracks, data.timeExtent, alignment);

  // Average data
  averageData(data.tracks);

  // Map phase time steps to actual time
  data.phases = mapPhases(simulationOutput, data.timeExtent, alignment);

  // Average phases
  data.phaseAverage = averagePhases(data.phases);

  function createTracks() {
    return dataSetTracks().concat(simulationTracks());

    function dataSetTracks() {
      // Create empty array
      var tracks = [];

      dataSets.forEach(function (dataSet) {
        dataSet.species.forEach(function (species) {
          dataSet.features.forEach(function (feature) {
            if (!feature.active) return;

            var data = species.cells.map(function (cell) {
              var featureIndex = cell.features.map(function (d) {
                return d.name;
              }).indexOf(feature.name);

              var values = cell.features[featureIndex].values.map(function (d, i, a) {
                return {
                  start: d.time,
                  stop: i < a.length - 1 ? a[i + 1].time : d.time + (d.time - a[i - 1].time),
                  value: d.value
                };
              }).filter(function (d) {
                return !isNaN(d.value);
              });

              return {
                name: cell.name,
                values: values,
                timeSpan: timeSpan(values)
              };
            });

            tracks.push({
              species: species.name,
              feature: feature.name,
              source: dataSet.name,
              data: data,
              dataExtent: dataExtent(data.map(function (d) { return d.values; }))
            });
          });
        });
      });

      return tracks;
    }

    function simulationTracks() {
      // Get all species names in simulation output
      var speciesNames = [];
      simulationOutput.forEach(function (trajectory) {
        trajectory.species.forEach(function (species) {
          if (speciesNames.indexOf(species.name) === -1) {
            speciesNames.push(species.name);
          }
        });
      });

      return speciesNames.map(function (speciesName) {
        // Simulation output for this species
        var data = [];

        simulationOutput.forEach(function (trajectory) {
          var index = trajectory.species.map(function (s) {
            return s.name;
          }).indexOf(speciesName);

          if (index >= 0) {
            var values = trajectory.timeSteps.map(function (d, j, a) {
              return {
                value: trajectory.species[index].values[j],
                start: d,
                stop: j < a.length - 1 ? a[j + 1] : d + (d - a[j - 1])
              };
            })

            data.push({
              name: "Trajectory " + data.length,
              values: values,
              timeSpan: timeSpan(values)
            });
          }
        });

        return {
          species: speciesName,
          source: "Simulation",
          data: data,
          dataExtent: dataExtent(data.map(function (d) { return d.values; }))
        };
      });
    }
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

  function timeSpan(values) {
    return values[values.length -1].stop - values[0].start;
  }

  function computeTimeExtent(species) {
    var timeExtent = [];

    species.forEach(function(species) {
      species.data.forEach(function(d) {
        var first = d.values[0];
        var last = d.values[d.values.length - 1];

        timeExtent.push(first.start, last.stop);
      });
    });

    return [ Math.min.apply(null, timeExtent), Math.max.apply(null, timeExtent) ];
  }

  function alignData(species, timeExtent, alignment) {
    species.forEach(function (species) {
      species.data.map(function (d) {
        return d.values;
      }).forEach(align);
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
      species.average = average(species.data.map(function (d) { return d.values; }));
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
      AppDispatcher.waitFor([DataSetStore.dispatchToken,
                             SimulationOutputStore.dispatchToken]);
      dataSets = DataSetStore.getDataSets();
      simulationOutput = SimulationOutputStore.getSimulationOutput();
      updateData();
      DataStore.emitChange();
      break;

    case Constants.RECEIVE_DATA_SET:
      AppDispatcher.waitFor([DataSetStore.dispatchToken]);
      dataSets = DataSetStore.getDataSets();
      updateData();
      DataStore.emitChange();
    break;

    case Constants.SELECT_DATA_SET:
      AppDispatcher.waitFor([DataSetStore.dispatchToken]);
      dataSets = DataSetStore.getDataSets();
      updateData();
      DataStore.emitChange();
      break;

    case Constants.RECEIVE_SIMULATION_OUTPUT:
      AppDispatcher.waitFor([SimulationOutputStore.dispatchToken]);
      simulationOutput = SimulationOutputStore.getSimulationOutput();
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
