var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataStore = require("./DataStore");
var d3 = require("d3");
var simpleStatistics = require("simple-statistics");

var CHANGE_EVENT = "change";

var simulationTracks = [];
var dataTracks = [];
var simulationTrack = null;
var dataTrack = null;
var methods = ["difference", "correlation"];
var method = methods[0];
var fit = null;

function updateData(data) {
  simulationTracks = data.tracks.filter(function (track) {
    return track.source === "Simulation" && !track.phaseTrack;
  });

  dataTracks = data.tracks.filter(function (track) {
    return track.source !== "Simulation" && !track.phaseTrack;
  });

  var i;

  i = simulationTracks.indexOf(simulationTrack);
  if (i === -1 && simulationTracks.length > 0) simulationTrack = simulationTracks[0];

  i = dataTracks.indexOf(dataTrack);
  if (i === -1 && dataTracks.length > 0) dataTrack = dataTracks[0];
}

function updateTracks(newSimulationTrack, newDataTrack) {
  simulationTrack = newSimulationTrack;
  dataTrack = newDataTrack;
}

function computeModelFit() {
  // XXX: Modified from clustering code in DataStore. Should refactor and put
  // relevant functions in DataUtils

  // Get rescaled values and times for average trace
  var v1 = getValues(simulationTrack.average);
  var v2 = getValues(dataTrack.average);

  // Get time steps
  var t1 = getTimeSteps(v1);
  var t2 = getTimeSteps(v2);

  // Combine time steps
  var start = Math.max(t1[0], t2[0]);
  var stop = Math.min(t1[t1.length - 1], t2[t2.length - 1]);

  t1 = t1.filter(function (t) {
    return t >= start && t <= stop;
  });

  t2 = t2.filter(function (t) {
    return t >= start && t <= stop;
  });

  var t = t1.concat(t2).sort().filter(function (d, i, a) {
    return i === 0 || d !== a[i - 1];
  });

  // Loop over combined time time steps
  var diff = 0;
  var i1 = 0;
  var i2 = 0;
  var s1 = [];
  var s2 = [];

  for (var i = 0; i < t.length; i++) {
    while (i1 < v1.length && v1[i1].stop <= t[i]) i1++;
    while (i2 < v2.length && v2[i2].stop <= t[i]) i2++;

    if (i1 === v1.length) break;
    if (i2 === v2.length) break;

    s1.push(v1[i1].value);
    s2.push(v2[i2].value);
  }

  switch (method) {
    case "difference":
      // 1 - average absolute difference
      fit = 1 - s1.reduce(function(p, c, i) {
        return p + Math.abs(c - s2[i]);
      }) / s1.length;
      break;

    case "correlation":
      fit = simpleStatistics.sampleCorrelation(s1, s2);
      break;
  }

  function getValues(trace) {
    var timeScale = d3.scaleLinear()
        .domain([trace.values[0].start, trace.values[trace.values.length - 1].stop])
        .range([0, 1]);

    var valueScale = d3.scaleLinear()
        .domain(d3.extent(trace.values, function (v) { return v.value; }))
        .range([0, 1]);

    return trace.values.map(function(d) {
      return {
        start: timeScale(d.start),
        stop: timeScale(d.stop),
        value: valueScale(d.value)
      };
    });
  }

  function getTimeSteps(values) {
    var t = values.map(function (value) {
      return value.start;
    });

    t.push(values[values.length - 1].stop);

    return t;
  }
}

var ModelFitStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getModelFit: function() {
    return {
      simulationTracks: simulationTracks,
      dataTracks: dataTracks,
      simulationTrack: simulationTrack,
      dataTrack: dataTrack,
      methods: methods,
      method: method,
      fit: fit
    };
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_WORKSPACE:
    case Constants.RECEIVE_DATASET:
    case Constants.SELECT_DATASET:
    case Constants.SELECT_FEATURE:
    case Constants.RECEIVE_SIMULATION_OUTPUT:
      AppDispatcher.waitFor([DataStore.dispatchToken]);
      updateData(DataStore.getData());
      ModelFitStore.emitChange();
      break;

    case Constants.CHANGE_MODEL_FIT_TRACKS:
      updateTracks(action.simulationTrack, action.dataTrack);
      ModelFitStore.emitChange();
      break;

    case Constants.CHANGE_MODEL_FIT_METHOD:
      method = action.method;
      ModelFitStore.emitChange();
      break;

    case Constants.COMPUTE_MODEL_FIT:
      computeModelFit();
      ModelFitStore.emitChange();
      break;
  }
});

module.exports = ModelFitStore;
