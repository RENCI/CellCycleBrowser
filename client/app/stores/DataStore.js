var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DatasetStore = require("./DatasetStore");
var SimulationOutputStore = require("./SimulationOutputStore");
var AlignmentStore = require("./AlignmentStore");

var CHANGE_EVENT = "change";

// Inputs
var datasets = [];
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
  // Keep track of selected traces
  // XXX: Switch to generating ids and using that for matching via a selected store?
  function trackId(track) {
    return track.source + ":" + track.species + ":" + track.feature;
  }

  var selectedTraces = {};
  data.tracks.forEach(function (track) {
    var id = trackId(track);

    if (!selectedTraces[id]) {
      selectedTraces[id] = {};
    }

    [track.average].concat(track.data).forEach(function (trace) {
      selectedTraces[id][trace.name] = trace.selected;
    });
  });

  // Get data for each track
  createTracks(datasets, simulationOutput);

  // Compute time extent across all data
  data.timeExtent = computeTimeExtent(data.tracks);

  // Average data
  averageData(data.tracks, data.timeExtent, alignment);

  // Align data
  alignData(data.tracks, data.timeExtent, alignment);

  // Map phase time steps to actual time
  data.phases = mapPhases(simulationOutput, data.timeExtent, alignment);

  // Average phases
  data.phaseAverage = averagePhases(data.phases);

  // Apply selected traces
  data.tracks.forEach(function (track) {
    var id = trackId(track);

    [track.average].concat(track.data).forEach(function (trace) {
      if (selectedTraces[id]) {
        trace.selected = selectedTraces[id][trace.name] === true;
      }
    });
  });

  function createTracks() {
    // Keep track of sort order
    var indeces = data.tracks.map(function(d) {
      return {
        index: d.index,
        source: d.source,
        species: d.species,
        feature: d.feature
      };
    });

    // Generate data
    data.tracks = datasetTracks().concat(simulationTracks());

    // Match sort order
    data.tracks.forEach(function (d) {
      for (var i = 0; i < indeces.length; i++) {
        var d2 = indeces[i];

        // Check source, species, and feature if available
        if (d.source === d2.source &&
            d.species === d2.species &&
            (d.feature && d2.feature ? d.feature === d2.feature : true)) {
          d.index = d2.index;
          return;
        }
      }
    });

    // Sort
    data.tracks.sort(function (a, b) {
      var ai = a.index;
      var bi = b.index;

      return ai === undefined && bi === undefined ? 0 :
             ai === undefined ? 1 :
             bi === undefined ? -1 :
             ai - bi;
    });

    updateTrackIndeces();

    function datasetTracks() {
      // Create empty array
      var tracks = [];

      datasets.filter(function(d) {
        return d.active;
      }).forEach(function (dataset) {
        dataset.species.forEach(function (species) {
          dataset.features.filter(function(d) {
            return d.active;
          }).forEach(function (feature) {
            var cellData = species.cells.map(function (cell) {
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
                selected: false,
                values: values,
                timeSpan: timeSpan(values)
              };
            });

            tracks.push({
              species: species.name,
              feature: feature.name,
              source: dataset.name,
              data: cellData,
              dataExtent: dataExtent(cellData.map(function (d) { return d.values; }))
            });
          });
        });
      });

      return tracks;
    }

    function simulationTracks() {
      // Get all species names in simulation output
      var speciesNames = [];
      simulationOutput.forEach(function (trace) {
        trace.species.forEach(function (species) {
          if (speciesNames.indexOf(species.name) === -1) {
            speciesNames.push(species.name);
          }
        });
      });

      return speciesNames.map(function (speciesName) {
        // Simulation output for this species
        var simData = [];

        simulationOutput.forEach(function (trace) {
          var index = trace.species.map(function (s) {
            return s.name;
          }).indexOf(speciesName);

          if (index >= 0) {
            var values = trace.timeSteps.map(function (d, j, a) {
              return {
                value: trace.species[index].values[j],
                start: d,
                stop: j < a.length - 1 ? a[j + 1] : d + (d - a[j - 1])
              };
            });

            simData.push({
              name: "Trace " + simData.length + 1,
              selected: false,
              values: values,
              timeSpan: timeSpan(values)
            });
          }
        });

        return {
          species: speciesName,
          source: "Simulation",
          data: simData,
          dataExtent: dataExtent(simData.map(function (d) { return d.values; }))
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
      align(species.average.values);

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

  function averageData(species, timeExtent, alignment) {
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

      // Get the average time span
      var timeSpan = timeSeries.reduce(function(p, c) {
        return p + (c[c.length - 1].stop - c[0].start);
      }, 0) / timeSeries.length;

      // Generate time steps
      var start = 0;
      var stop = 0;

      if (alignment === "left") {
        start = Math.min.apply(null, timeSeries.map(function (d) {
          return d[0].start;
        }));

        stop = start + timeSpan;
      }
      else if (alignment === "right") {
        stop = Math.max.apply(null, timeSeries.map(function (d) {
          return d[d.length - 1].stop;
        }));

        start = stop - timeSpan;
      }
      else if (alignment === "justify") {
        start = timeSeries[0][0].start;
        stop = timeSeries[0][timeSeries[0].length - 1].stop;
      }

      var timeSteps = [];
      var n = (stop - start) / delta;
      for (var i = 0; i < n; i++) {
        var t = start + i * delta;

        timeSteps.push({
          start: t,
          stop: t + delta
        });
      }

      // Justify data
      var justified = timeSeries.map(function (timeSeries) {
        // Domain and range
        var d0 = timeSeries[0].start;
        var dw = timeSeries[timeSeries.length - 1].stop - d0;
        var r0 = start;
        var rw = stop;

        function justify(x) {
          return r0 + (x - d0) / dw * rw;
        }

        return timeSeries.map(function(d) {
          return {
            value: d.value,
            start: justify(d.start),
            stop: justify(d.stop)
          };
        });
      });

      // Keep track of time step per array
      var t = timeSeries.map(function () {
        return 0;
      });

      timeSteps.forEach(function (timeStep) {
        var value = 0;
        var count = 0;

        justified.forEach(function (d, i) {
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

      return {
        name: "Average",
        selected: true,
        values: timeSteps
      };
    }
  }

  function mapPhases(simulationOutput, timeExtent, alignment) {
    return simulationOutput.map(function(trace) {
      var timeSteps = trace.timeSteps;

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

      return trace.phases.map(function(phase) {
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

    phases.forEach(function (trace, i) {
      trace.forEach(function (phase, j) {
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

function sortTracks(sortMethod) {
  data.tracks.sort(function (a, b) {
    var va = a[sortMethod];
    var vb = b[sortMethod];

    // Hack to put simulation first
    if (sortMethod === "source") {
      va = va === "Simulation" ? "\0" : va;
      vb = vb === "Simulation" ? "\0" : vb;
    }

    return ascending(va, vb);
  });

  updateTrackIndeces();

  function ascending(a, b) {
    return !a && !b ? 0 : !a ? -1 : !b ? 1 : a < b ? -1 : a > b ? 1 : 0;
  }
}

function insertTrack(oldIndex, newIndex) {
  if (newIndex > oldIndex) newIndex--;

  data.tracks.splice(newIndex, 0, data.tracks.splice(oldIndex, 1)[0]);

  updateTrackIndeces();
}

function updateTrackIndeces() {
  data.tracks.forEach(function (d, i) {
    d.index = i;
  });
}

function selectTrace(trace, selected) {
  trace.selected = selected;
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
    case Constants.RECEIVE_WORKSPACE:
      AppDispatcher.waitFor([DatasetStore.dispatchToken,
                             SimulationOutputStore.dispatchToken]);
      datasets = DatasetStore.getDatasets();
      simulationOutput = SimulationOutputStore.getSimulationOutput();
      updateData();
      DataStore.emitChange();
      break;

    case Constants.RECEIVE_DATASET:
      AppDispatcher.waitFor([DatasetStore.dispatchToken]);
      datasets = DatasetStore.getDatasets();
      updateData();
      DataStore.emitChange();
    break;

    case Constants.SELECT_DATASET:
      AppDispatcher.waitFor([DatasetStore.dispatchToken]);
      datasets = DatasetStore.getDatasets();
      updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_FEATURE:
      AppDispatcher.waitFor([DatasetStore.dispatchToken]);
      datasets = DatasetStore.getDatasets();
      updateData();
      DatasetStore.emitChange();

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

    case Constants.SORT_TRACKS:
      sortTracks(action.sortMethod);
      DataStore.emitChange();
      break;

    case Constants.INSERT_TRACK:
      insertTrack(action.oldIndex, action.newIndex);
      DataStore.emitChange();
      break;

    case Constants.SELECT_TRACE:
      selectTrace(action.trace, action.selected);
      DataStore.emitChange();
      break;
  }
});

module.exports = DataStore;
