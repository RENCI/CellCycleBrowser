var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DatasetStore = require("./DatasetStore");
var SimulationOutputStore = require("./SimulationOutputStore");
var AlignmentStore = require("./AlignmentStore");
var DataUtils = require("../utils/DataUtils");
var d3 = require("d3");
var hclusterjs = require("hclusterjs");

var CHANGE_EVENT = "change";
var HIGHLIGHT_CHANGE_EVENT = "highlight";

// Inputs
var datasets = [];
var simulationOutput = [];
var alignment = AlignmentStore.getAlignment();

// Output data
var data = {
  tracks: [],
  timeExtent: []
};

function dataTracks(tracks) {
  return tracks.filter(function (track) {
    return !track.phaseTrack;
  });
}

function phaseTracks(tracks) {
  return tracks.filter(function (track) {
    return track.phaseTrack;
  });
}

function updateData() {
  // Keep track of state
  var state = saveState(data.tracks);

  // Create tracks
  data.tracks = createTracks(data.tracks, datasets, simulationOutput);

  // Compute time extent across all data
  data.timeExtent = computeTimeExtent(data.tracks);

  // Average data traces
  averageDataTraces(data.tracks);

  // Align tracks
  alignTracks(data.tracks, data.timeExtent, alignment);

  // Apply state
  applyState(data.tracks, state);

  // Match tracks to phase tracks
  matchPhases(data.tracks);

  // Update track indeces
  updateTrackIndeces(data.tracks);

  // Set track ids
  setTrackIds(data.tracks);

  // Link tracks to traces
  linkTracks(data.tracks);

  // Update dendrogram
  // XXX: This recalculates the clustering, which we may not want?
  data.hasDendrogram = false;
  data.tracks.forEach(function (track) {
    if (track.cluster) clusterTraces(track, true);
  });
  updateDendrogram();

  // XXX: Switch to generating ids and using that for matching via a selected store?
  function trackId(track) {
    return DataUtils.removeNonWord(
      track.source + "_" +
      track.species + "_" +
      track.feature
    );
  }

  function saveState(tracks) {
    var state = {};

    tracks.forEach(function (track) {
      var s = {};

      s.collapse = track.collapse;
      s.cluster = track.cluster;
      s.showDendrogram = track.showDendrogram;

      s.selectedTraces = {};
      [track.average].concat(track.traces).forEach(function (trace) {
        s.selectedTraces[trace.name] = trace.selected;
      });

      if (!track.phaseTrack) {
        s.showPhaseOverlay = track.showPhaseOverlay;
        s.rescaleTraces = track.rescaleTraces;
      }

      state[track.id] = s;
    });

    return state;
  }

  function applyState(tracks, state) {
    tracks.forEach(function (track) {
      var s = state[trackId(track)];

      track.collapse = !s || typeof s.collapse === "undefined" ?
                       false : s.collapse;

      track.cluster = !s || typeof s.cluster === "undefined" ?
                      null : s.cluster;

      track.showDendrogram = !s || typeof s.showDendrogram === "undefined" ?
                             false : s.showDendrogram;

      if (s) {
        [track.average].concat(track.traces).forEach(function (trace) {
          trace.selected = s.selectedTraces[trace.name] === true;
        });
      }

      if (!track.phaseTrack) {
        track.showPhaseOverlay = !s || typeof s.showPhaseOverlay === "undefined" ?
                                 false : s.showPhaseOverlay;

        track.rescaleTraces = !s || typeof s.rescaleTraces === "undefined" ?
                              false : s.rescaleTraces;
      }
    });

    // Sort new data (without state) first
    tracks.sort(function(a, b) {
      return d3.ascending(state[trackId(a)] ? 1 : 0, state[trackId(b)] ? 1 : 0);
    });
  }

  function matchPhases(tracks) {
    dataTracks(tracks).forEach(function (track) {
      track.phaseAverage = [];
      track.phases = [];

      phaseTracks(tracks).forEach(function (phaseTrack) {
        if (track.source === phaseTrack.source) {
          track.phaseAverage = phaseTrack.average.phases;
          track.phases = phaseTrack.traces.map(function (trace) {
            return trace.phases;
          });
        }
      });
    })
  }

  function createTracks(tracks, datasets, simulationOutput) {
    // Keep track of sort order
    var indeces = tracks.map(function(d) {
      return {
        index: d.index,
        source: d.source,
        species: d.species,
        feature: d.feature
      };
    });

    // Generate data
    tracks = datasetTracks(datasets)
      .concat(simulationPhaseTrack(simulationOutput))
      .concat(simulationDataTracks(simulationOutput));

    // Match sort order
    tracks.forEach(function (d) {
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
    tracks.sort(function (a, b) {
      var ai = a.index;
      var bi = b.index;

      return ai === undefined && bi === undefined ? 0 :
             ai === undefined ? 1 :
             bi === undefined ? -1 :
             ai - bi;
    });

    return tracks;

    function datasetTracks(datasets) {
      // Create empty array
      var tracks = [];

      function isPhaseFeature(feature) {
        return feature.name.toLowerCase().indexOf("phaseclassification") !== -1;
      }

      datasets.filter(function(d) {
        return d.active;
      }).forEach(function (dataset) {
        dataset.species.forEach(function (species) {
          dataset.features.filter(function (feature) {
            return feature.active;
          }).forEach(function (feature) {
            if (isPhaseFeature(feature)) {
              phaseTrack(dataset, species, feature);
            }
            else {
              dataTrack(dataset, species, feature);
            }
          });
        });
      });

      // Phase tracks first
      return tracks.sort(function(a, b) {
        return d3.ascending(a.phaseTrack ? 0 : 1, b.phaseTrack ? 0 : 1);
      });

      function dataTrack(dataset, species, feature) {
        var traces = [];
        species.cells.forEach(function (cell, i) {
          var featureIndex = cell.features.map(function (d) {
            return d.name;
          }).indexOf(feature.name);

          if (featureIndex === -1) return;

          var values = cell.features[featureIndex].values.filter(function (d) {
            return !isNaN(d.value);
          }).map(function (d, i, a) {
            return {
              start: d.time,
              stop: i < a.length - 1 ? a[i + 1].time : d.time + (d.time - a[i - 1].time),
              value: d.value
            };
          });

          traces.push({
            index: i,
            name: cell.name,
            selected: false,
            highlight: null,
            values: values,
            timeSpan: computeTimeSpan(values)
          });
        });

        if (traces.length > 0) {
          tracks.push({
            phaseTrack: false,
            species: species.name,
            feature: feature.name,
            source: dataset.name,
            traces: traces,
            dataExtent: computeDataExtent(traces),
            cluster: null
          });
        }
      }

      function phaseTrack(dataset, species, feature) {
        var traces = [];
        species.cells.forEach(function (cell, i) {
          var featureIndex = cell.features.map(function (d) {
            return d.name;
          }).indexOf(feature.name);

          if (featureIndex === -1) return;

          var phaseNames = ["G1", "S", "G2"];

          var values = cell.features[featureIndex].values.filter(function(d) {
            return !isNaN(d.value);
          });

          var tStop = values[values.length - 1].time + (values[values.length - 1].time - values[values.length - 2].time);

          var transitions = values.filter(function(d, i, a) {
            return i === 0 || i === a.length - 1 || d.value !== a[i - 1].value;
          });

          var phases = [];
          for (var i = 0; i < transitions.length - 1; i++) {
            phases.push({
              name: phaseNames[i],
              start: transitions[i].time,
              stop: i === transitions.length - 2 ? tStop : transitions[i + 1].time,
              subPhases: []
            });
          }

          traces.push({
            index: i,
            name: cell.name,
            selected: false,
            highlight: null,
            phases: phases,
            timeSpan: computeTimeSpan(phases)
          });
        });

        if (traces.length > 0) {
          tracks.push({
            phaseTrack: true,
            species: species.name,
            feature: feature.name,
            source: dataset.name,
            traces: traces,
            average: averagePhases(traces)
          });
        }
      }
    }

    function simulationDataTracks(simulationOutput) {
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
        var traces = [];

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

            traces.push({
              index: traces.length,
              name: "Trace " + (traces.length + 1),
              selected: false,
              highlight: null,
              values: values,
              timeSpan: computeTimeSpan(values)
            });
          }
        });

        return {
          phaseTrack: false,
          species: speciesName,
          source: "Simulation",
          traces: traces,
          dataExtent: computeDataExtent(traces)
        };
      });
    }

    function simulationPhaseTrack(simulationOutput) {
      if (simulationOutput.length === 0) return [];

      var traces = mapPhases(simulationOutput);

      return {
        phaseTrack: true,
        species: "Phases",
        feature: "",
        source: "Simulation",
        traces: traces,
        average: averagePhases(traces)
      };

      function mapPhases(simulationOutput) {
        return simulationOutput.map(function(trace, i) {
          var timeSteps = trace.timeSteps;

          var phases = trace.phases.map(function(phase) {
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

          return {
            name: "Trace " + (i + 1),
            selected: false,
            highlight: null,
            phases: phases,
            timeSpan: computeTimeSpan(phases)
          };
        });
      }
    }

    function averagePhases(traces) {
      var average = [];

      traces.forEach(function (trace, i) {
        trace.phases.forEach(function (phase, j) {
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
        phase.start /= traces.length;
        phase.stop /= traces.length;
      });

      return {
        name: "Average",
        selected: false,
        highlight: null,
        phases: average,
        timeSpan: computeTimeSpan(average)
      };
    }
  }

  function computeDataExtent(traces) {
    if (traces.length === 0) return [0, 0];

    var values = traces.map(function (trace) {
      return trace.values;
    });

    var min = Math.min.apply(null, values.map(function (d) {
      return Math.min.apply(null, d.map(function (d) { return d.value; }));
    }));

    var max = Math.max.apply(null, values.map(function (d) {
      return Math.max.apply(null, d.map(function (d) { return d.value; }));
    }));

    return [min, max];
  }

  function computeTimeSpan(values) {
    return values[values.length -1].stop - values[0].start;
  }

  function computeTimeExtent(tracks) {
    var timeExtent = [];

    tracks.forEach(function (track) {
      track.traces.forEach(function (trace) {
        var v = track.phaseTrack ? trace.phases : trace.values;

        var first = v[0];
        var last = v[v.length - 1];

        timeExtent.push(first.start, last.stop);
      });
    });

    return [ Math.min.apply(null, timeExtent), Math.max.apply(null, timeExtent) ];
  }

  function alignTracks(tracks, timeExtent, alignment) {
    alignDataTracks(dataTracks(tracks));
    alignPhaseTracks(phaseTracks(tracks));

    function alignDataTracks(tracks) {
      tracks.forEach(function (track) {
        track.traces.concat([track.average]).map(function (trace) {
          return trace.values;
        }).forEach(align);
      });

      function align(trace) {
        if (alignment === "left") {
          var shift = timeExtent[0] - trace[0].start;

          trace.forEach(function(d) {
            d.start += shift;
            d.stop += shift;
          });
        }
        else if (alignment === "right") {
          var shift = timeExtent[1] - trace[trace.length - 1].stop;

          trace.forEach(function(d) {
            d.start += shift;
            d.stop += shift;
          });
        }
        else if (alignment === "justify") {
          // Domain and range
          var d0 = trace[0].start;
          var dw = trace[trace.length - 1].stop - d0;
          var r0 = timeExtent[0];
          var rw = timeExtent[1] - r0;

          function justify(x) {
            return r0 + (x - d0) / dw * rw;
          }

          trace.forEach(function(d) {
            d.start = justify(d.start);
            d.stop = justify(d.stop);
          });
        }
      }
    }

    function alignPhaseTracks(tracks) {
      tracks.forEach(function(track) {
        track.traces.concat([track.average]).map(function (trace) {
          return trace.phases;
        }).forEach(align);
      });

      function align(trace) {
        var tStart = trace[0].start;
        var tStop = trace[trace.length - 1].stop;

        trace.forEach(function(phase) {
          phase.start = align(phase.start);
          phase.stop = align(phase.stop);

          if (phase.subPhases) {
            phase.subPhases.forEach(function(sub){
              sub.start = align(sub.start);
              sub.stop = align(sub.stop);
            });
          }
        });

        function align(x) {
          if (alignment === "left") {
            var shift = timeExtent[0] - tStart;

            return x + shift;
          }
          else if (alignment === "right") {
            var shift = timeExtent[1] - tStop;

            return x + shift;
          }
          else if (alignment === "justify") {
            // Domain and range
            var d0 = tStart;
            var dw = tStop - d0;
            var r0 = timeExtent[0];
            var rw = timeExtent[1] - r0;

            return r0 + (x - d0) / dw * rw
          }
        }
      }
    }
  }

  function averageDataTraces(tracks, timeExtent) {
    dataTracks(tracks).forEach(function (track) {
      track.average = average(track.traces.map(function (trace) {
        return trace.values;
      }));
    });

    function average(timeSeriesList) {
      if (timeSeriesList.length === 0) return [];

      // Get the average time step
      var allTimeSteps = [].concat.apply([], timeSeriesList);

      var delta = allTimeSteps.reduce(function (p, c) {
        return p + (c.stop - c.start);
      }, 0) / allTimeSteps.length;

      // Get the average time span
      var timeSpan = timeSeriesList.reduce(function(p, c) {
        return p + computeTimeSpan(c);
      }, 0) / timeSeriesList.length;

      // Generate time steps
      var start = 0;
      var stop = timeSpan;

      var timeSteps = [];
      var n = Math.round((stop - start) / delta);

      for (var i = 0; i < n; i++) {
        var t1 = i === 0 ? start : timeSteps[i - 1].stop;
        var t2 = i === n - 1 ? stop : (i + 1) / n * timeSpan;

        timeSteps.push({
          start: t1,
          stop: t2
        });
      }

      // Justify data
      var justified = timeSeriesList.map(function (timeSeries) {
        // Domain and range
        var d0 = timeSeries[0].start;
        var dw = timeSeries[timeSeries.length - 1].stop - d0;
        var r0 = start;
        var rw = stop;

        function justify(x) {
          return r0 + (x - d0) / dw * rw;
        }

        return timeSeries.map(function (d) {
          return {
            value: d.value,
            start: justify(d.start),
            stop: justify(d.stop)
          };
        });
      });

      // Keep track of time step per array
      var t = timeSeriesList.map(function () {
        return 0;
      });

      timeSteps.forEach(function (timeStep) {
        var mid = (timeStep.stop + timeStep.start) / 2;
        var value = 0;
        var count = 0;

        justified.forEach(function (d, i) {
          // Find closest overlapping time step
          for (var j = t[i]; j < d.length; j++) {
            if (d[j].start <= mid && d[j].stop >= mid) {
              value += d[j].value;
              count++;
              t[i] = j;
            }
            else if (d[j].start > mid) {
              break;
            }
          }
        });

        timeStep.value = count > 0 ? value / count : 0;
      });

      return {
        name: "Average",
        selected: true,
        highlight: null,
        values: timeSteps,
        timeSpan: timeSpan
      };
    }
  }

  function setTrackIds(tracks) {
    tracks.forEach(function (track) {
      track.id = trackId(track);
    });
  }

  function linkTracks(tracks) {
    tracks.forEach(function (track) {
      track.average.track = track;

      track.traces.forEach(function (trace) {
        trace.track = track;
      });
    });
  }
}

function sortTracks(sortMethod) {
  data.tracks.sort(function (a, b) {
    var va, vb;

    if (sortMethod === "type") {
      // Put phase tracks first
      va = a.phaseTrack ? 0 : 1;
      vb = b.phaseTrack ? 0 : 1;
    }
    else {
      va = a[sortMethod];
      vb = b[sortMethod];

      // Hack to put simulation before other sources
      if (sortMethod === "source") {
        va = va === "Simulation" ? "\0" : va;
        vb = vb === "Simulation" ? "\0" : vb;
      }
    }

    // Get sort value
    var v = ascending(va, vb);

    // If no difference, sort by current order
    return v !== 0 ? v : ascending(a.index, b.index);
  });

  updateTrackIndeces(data.tracks);

  function ascending(a, b) {
    return !a && !b ? 0 : !a ? -1 : !b ? 1 : a < b ? -1 : a > b ? 1 : 0;
  }
}

function insertTrack(oldIndex, newIndex) {
  if (newIndex > oldIndex) newIndex--;

  data.tracks.splice(newIndex, 0, data.tracks.splice(oldIndex, 1)[0]);

  updateTrackIndeces(data.tracks);
}

function updateTrackIndeces(tracks) {
  tracks.forEach(function (track, i) {
    track.index = i;
  });

  // Update colors
  setTrackColors(tracks);
}

function setTrackColors(tracks) {
  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Use a nest to group by source and set source color for all tracks
  d3.nest()
      .key(function (track) { return track.source; })
      .entries(tracks).forEach(function (source) {
        source.values.forEach(function (track) {
          track.sourceColor = colorScale(track.source);
        });
      });

  // Now just data tracks for track color, which is only used for time series
  d3.nest()
      .key(function (track) { return track.source; })
      .entries(dataTracks(tracks)).forEach(function (source) {
        source.values.forEach(function (track, i, a) {
          // Use array index to change color shade for track
          var fraction = a.length === 1 ? 0 : i / (a.length - 1);

          track.color = d3.hsl(track.sourceColor).brighter(fraction);
        });
      });
}

function selectTrace(trace, selected) {
  trace.selected = selected;
}

function highlightTrace(trace) {
  var name = trace ? trace.name : null;
  var source = trace ? trace.track.source : null;

  data.tracks.forEach(function (track) {
    track.traces.concat([track.average]).forEach(function (trace) {
      trace.highlight = trace.track.source === source &&
                        trace.name === name ? "secondary" : null;
    });
  });

  if (trace) trace.highlight = "primary";
}

function selectAllTraces(trace, selected, selectPhase) {
  var name = trace.name;
  var source = trace.track.source;
  var isPhase = trace.hasOwnProperty("phases");

  if (selectPhase && selected) {
    // Clear phases
    phaseTracks(data.tracks).forEach(function (track) {
      track.traces.concat([track.average]).forEach(function (trace) {
        trace.selected = false;
      });
    });
  }

  var tracks = selectPhase || !selected || isPhase ? data.tracks : dataTracks(data.tracks);

  tracks.filter(function (track) {
    return track.source === source;
  }).forEach(function (track) {
    if (name === "Average") {
      track.average.selected = selected;
    }
    else {
      track.traces.forEach(function (trace) {
        if (trace.name === name) {
          trace.selected = selected;
        }
      });
    }
  });
}

function selectPhaseTrace(trace, selected) {
  phaseTracks(data.tracks).forEach(function (track) {
    track.traces.concat([track.average]).forEach(function (trace) {
      trace.selected = false;
    });
  });

  trace.selected = selected;
}

function clusterTraces(track, cluster) {
  track.cluster = cluster;

  if (!track.cluster) {
    track.traces.sort(function(a, b) {
      return d3.ascending(a.index, b.index);
    });

    track.showDendrogram = false;

    updateDendrogram();

    return;
  }

  // Initialize distance matrix
  // hclusterjs likes an array of objects with a "position" array
  var n = track.traces.length;
  var matrix = [];
  var v = [];
  for (var i = 0; i < n; i++) v.push(0);
  for (var i = 0; i < n; i++) {
    matrix.push({
      position: v.slice()
    });
  }

  // Time steps for each trace
  var timeSteps = track.traces.map(function (trace) {
    var t = trace.values.map(function (value) {
      return value.start;
    });

    t.push(trace.values[trace.values.length -1].stop);

    return t;
  });

  function getValues(trace) {
    var scale = track.rescaleTraces ?
                d3.scaleLinear()
                    .domain(d3.extent(trace.values, function (v) { return v.value; }))
                    .range([0, 1]) : null;

    return trace.values.map(function(d) {
      return {
        start: d.start,
        stop: d.stop,
        value: scale ? scale(d.value) : d.value
      };
    });
  }

  // Compute distances
  track.traces.forEach(function (trace1, i, a) {
    var v1 = getValues(trace1);

    for (var j = i + 1; j < n; j++) {
      var trace2 = a[j];
      var v2 = getValues(trace2);

      // Combine time steps
      var start = Math.max(timeSteps[i][0], timeSteps[j][0]);
      var stop = Math.min(timeSteps[i][timeSteps[i].length - 1], timeSteps[j][timeSteps[j].length - 1]);

      var t1 = timeSteps[i].filter(function (timeStep) {
        return timeStep >= start && timeStep <= stop;
      });

      var t2 = timeSteps[j].filter(function (timeStep) {
        return timeStep >= start && timeStep <= stop;
      });

      var t = t1.concat(t2).sort().filter(function (d, i, a) {
        return i === 0 || d !== a[i - 1];
      });

      // Loop over combined time time steps
      var diff = 0;
      var k1 = 0;
      var k2 = 0;
      var m = 0;

      for (var kt = 0; kt < t.length; kt++) {
        while (k1 < v1.length && v1[k1].stop <= t[kt]) k1++;
        while (k2 < v2.length && v2[k2].stop <= t[kt]) k2++;

        if (k1 === v1.length) break;
        if (k2 === v2.length) break;

        diff += Math.abs(v1[k1].value - v2[k2].value);
        m++;
      }

      // Normalize
      diff /= m;

      matrix[i].position[j] = diff;
      matrix[j].position[i] = diff;
    }
  });

  // Perform clustering
  var cluster = hclusterjs()
      .distance("euclidean")
      .linkage("avg")
      .data(matrix);

  // Copy cluster index to trace
  cluster.orderedNodes().forEach(function (node, i) {
    track.traces[node.indexes[0]].clusterIndex = i;
  });

  // Sort by cluster index
  track.traces.sort(function(a, b) {
    return d3.ascending(a.clusterIndex, b.clusterIndex);
  });

  track.cluster = cluster;
}

function showDendrogram(track, show) {
  track.showDendrogram = show;
}

function showPhaseOverlay(track) {
  track.showPhaseOverlay = !track.showPhaseOverlay;
}

function rescaleTraces(track) {
  track.rescaleTraces = !track.rescaleTraces;
}

function updateDendrogram() {
  data.hasDendrogram = data.tracks.filter(function (track) {
    return track.showDendrogram;
  }).length > 0;
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
  emitHighlightChange: function () {
    this.emit(HIGHLIGHT_CHANGE_EVENT);
  },
  addHighlightChangeListener: function (callback) {
    this.on(HIGHLIGHT_CHANGE_EVENT, callback);
  },
  removeHighlightChangeListener: function (callback) {
    this.removeListener(HIGHLIGHT_CHANGE_EVENT, callback);
  },
  getData: function () {
    return data;
  }
});

DataStore.setMaxListeners(0);

DataStore.dispatchToken = AppDispatcher.register(function (action) {
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

    case Constants.SELECT_MODEL:
    case Constants.RECEIVE_MODEL:
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

    case Constants.HIGHLIGHT_TRACE:
      highlightTrace(action.trace);
      DataStore.emitHighlightChange();
      break;

    case Constants.SELECT_ALL_TRACES:
      selectAllTraces(action.trace, action.selected, action.selectPhase);
      DataStore.emitChange();
      break;

    case Constants.SELECT_PHASE_TRACE:
      selectPhaseTrace(action.trace, action.selected);
      DataStore.emitChange();
      break;

    case Constants.CLUSTER_TRACES:
      clusterTraces(action.track, action.cluster);
      showDendrogram(action.track, action.cluster);
      updateDendrogram();
      DataStore.emitChange();
      break;

    case Constants.SHOW_DENDROGRAM:
      showDendrogram(action.track, action.show);
      updateDendrogram();
      DataStore.emitChange();
      break;

    case Constants.SHOW_PHASE_OVERLAY:
      showPhaseOverlay(action.track);
      DataStore.emitChange();
      break;

    case Constants.RESCALE_TRACES:
      rescaleTraces(action.track);
      DataStore.emitChange();
      break;
  }
});

module.exports = DataStore;
