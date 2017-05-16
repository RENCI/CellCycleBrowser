var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataSetStore = require("./DataSetStore");

var CHANGE_EVENT = "change";

// List of available features for current cell data set
var featureList = [];

// Active feature
var feature = defaultFeature();

function getFeatureList(dataSet) {
  if (!dataSet.species || dataSet.species.length === 0) return [];

  return dataSet.species[0].cells[0].features.map(function (feature) {
    return feature.name;
  });
}

function defaultFeature() {
  return featureList.length > 0 ? featureList[0] : "";
}

var FeatureStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getFeatureList: function () {
    return featureList;
  },
  getFeature: function () {
    return feature;
  }
});

FeatureStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE:
      AppDispatcher.waitFor([DataSetStore.dispatchToken]);
      featureList = getFeatureList(DataSetStore.getDataSet());
      feature = defaultFeature();
      FeatureStore.emitChange();
      break;

    case Constants.SELECT_CELL_DATA:
      AppDispatcher.waitFor([DataSetStore.dispatchToken]);
      featureList = getFeatureList(DataSetStore.getDataSet());
      feature = defaultFeature();
      FeatureStore.emitChange();
      break;

    case Constants.SELECT_FEATURE:
      feature = action.feature.feature;
      FeatureStore.emitChange();
      break;
  }
});

module.exports = FeatureStore;
