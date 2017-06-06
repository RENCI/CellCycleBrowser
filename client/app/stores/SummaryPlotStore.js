var React = require("react");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataUtils = require("../utils/DataUtils");
var TimeSeriesArea = require("../components/TimeSeriesArea");
var GrowthCurveArea = require("../components/GrowthCurveArea");
var DistributionArea = require("../components/DistributionArea");
var ModelStore = require("./ModelStore");
var DataStore = require("./DataStore");

var CHANGE_EVENT = "change";

// List of summary plots
var plots = [
  {
    name: "Time Series",
    component: <TimeSeriesArea />,
    selected: true,
    hasInput: function () {
      return hasTracks();
    }
  },
  {
    name: "Growth Curve",
    component: <GrowthCurveArea />,
    selected: true,
    hasInput: function () {
      return hasTracks();
    }
  },
  {
    name: "Distribution",
    component: <DistributionArea />,
    selected: true,
    hasInput: function () {
      return hasModel();
    }
  }
];

// State of input data
function hasModel() {
  return ModelStore.getModel().name !== undefined;
}

function hasTracks() {
  return DataStore.getData().tracks.length > 0;
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

var SummaryPlotStore = assign({}, EventEmitter.prototype, {
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
      AppDispatcher.waitFor([ModelStore.dispatchToken,
                             DataStore.dispatchToken]);
      checkAvailability();
      SummaryPlotStore.emitChange();
      break;

    case Constants.RECEIVE_MODEL:
    case Constants.SELECT_MODEL:
      AppDispatcher.waitFor([ModelStore.dispatchToken]);
      checkAvailability();
      SummaryPlotStore.emitChange();
      break;

    case Constants.RECEIVE_DATASET:
    case Constants.SELECT_DATASET:
    case Constants.RECEIVE_SIMULATION_OUTPUT:
      AppDispatcher.waitFor([DataStore.dispatchToken]);
      checkAvailability();
      SummaryPlotStore.emitChange();
      break;

    case Constants.SELECT_SUMMARY_PLOT:
      selectPlot(action.plot);
      checkAvailability();
      SummaryPlotStore.emitChange();
      break;
  }
});

module.exports = SummaryPlotStore;
