var React = require("react");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataUtils = require("../utils/DataUtils");
var TimeSeriesContainer = require("../containers/TimeSeriesContainer");
var TimeSeriesInformation = require("../components/TimeSeriesInformation");
var GrowthCurveContainer = require("../containers/GrowthCurveContainer");
var GrowthCurveInformation = require("../components/GrowthCurveInformation");
var FlowCytometryContainer = require("../containers/FlowCytometryContainer");
var FlowCytometryInformation = require("../components/FlowCytometryInformation");
var DataStore = require("./DataStore");

var CHANGE_EVENT = "change";

// List of summary plots
var plots = [
  {
    name: "Time Series",
    component: <TimeSeriesContainer />,
    info: <TimeSeriesInformation />,
    selected: true,
    hasInput: function () {
      return hasTracks();
    }
  },
  {
    name: "Growth Curve",
    component: <GrowthCurveContainer />,
    info: <GrowthCurveInformation />,
    selected: true,
    hasInput: function () {
      return hasTracks();
    }
  },
  {
    name: "Cell Cycle Analysis",
    component: <FlowCytometryContainer />,
    info: <FlowCytometryInformation />,
    selected: true,
    hasInput: function () {
      return hasPhaseTracks();
    }
  }
];

// State of input data
function hasTracks() {
  return DataStore.getData().tracks.length > 0;
}

function hasPhaseTracks() {
  return DataStore.getData().tracks.filter(function (track) {
    return track.phaseTrack;
  }).length > 0;
}

function selectPlot(plot) {
  var p = DataUtils.find(plots, "name", plot.name);

  p.selected = plot.selected;
}

function checkAvailability() {
  plots.forEach(function (plot) {
    plot.available = plot.hasInput();
  });
}

var AnalysisPlotStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getAllPlots: function () {
    return plots;
  },
  getActivePlots: function () {
    return plots.filter(function (plot) {
      return plot.selected && plot.available;
    });
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_WORKSPACE:
    case Constants.RECEIVE_DATASET:
    case Constants.SELECT_DATASET:
    case Constants.RECEIVE_SIMULATION_OUTPUT:
      AppDispatcher.waitFor([DataStore.dispatchToken]);
      checkAvailability();
      AnalysisPlotStore.emitChange();
      break;

    case Constants.SELECT_SUMMARY_PLOT:
      selectPlot(action.plot);
      checkAvailability();
      AnalysisPlotStore.emitChange();
      break;
  }
});

module.exports = AnalysisPlotStore;
