var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var CellDataStore = require("./CellDataStore");

var CHANGE_EVENT = "change";

// Feature data
var featureList = [];
var featureKey = "";

function getFeatureList(cellData) {
  if (cellData.species.length === 0) return [];

  return cellData.species[0].cells[0].features.map(function (feature) {
    return feature.name;
  });
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
  getFeatureKey: function () {
    return featureKey;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_FEATURE:
      featureKey = action.featureKey;
      FeatureStore.emitChange();
      break;

    case Constants.SELECT_CELL_DATA:
      AppDispatcher.waitFor([CellDataStore.dispatchToken]);
      featureList = getFeatureList(CellDataStore.getCellData());
      featureKey = featureList.length > 0 ? "0" : "";
      FeatureStore.emitChange();
      break;

    case Constants.RECEIVE_DATA_SET:
      AppDispatcher.waitFor([CellDataStore.dispatchToken]);
      featureList = getFeatureList(CellDataStore.getCellData());
      featureKey = featureList.length > 0 ? "0" : "";
      FeatureStore.emitChange();
      break;
  }
});

module.exports = FeatureStore;
