var React = require("react");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataUtils = require("../utils/DataUtils");
var TimeSeriesArea = require("../components/TimeSeriesArea");
var GrowthCurveArea = require("../components/GrowthCurveArea");
var DistributionArea = require("../components/DistributionArea");

var CHANGE_EVENT = "change";

// List of summary plots
var plots = [
  {
    name: "Time Series",
    component: <TimeSeriesArea />,
    selected: true
  },
  {
    name: "Growth Curve",
    component: <GrowthCurveArea />,
    selected: true
  },
  {
    name: "Distribution",
    component: <DistributionArea />,
    selected: true
  }
];

function selectPlot(plot) {
  var p = DataUtils.find(plots, "name", plot.name);

  p.selected = plot.selected;
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
      return plot.selected;
    });
  }
});

SummaryPlotStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_SUMMARY_PLOT:
      selectPlot(action.plot);
      SummaryPlotStore.emitChange();
      break;
  }
});

module.exports = SummaryPlotStore;
