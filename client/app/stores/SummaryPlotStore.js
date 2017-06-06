var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataUtils = require("../utils/DataUtils");

var CHANGE_EVENT = "change";

// List of summary plots
var plots = [
  {
    name: "Time Series",
    selected: true
  },
  {
    name: "Growth Curve",
    selected: true
  },
  {
    name: "Distribution",
    selected: true
  }
];

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
  getSummaryPlots: function () {
    return plots;
  }
});

SummaryPlotStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_SUMMARY_PLOT:
      find(plots, "name", action.plot.name).selected = action.plot.selected;
      SummaryPlotStore.emitChange();
      break;
  }
});

module.exports = SummaryPlotStore;
