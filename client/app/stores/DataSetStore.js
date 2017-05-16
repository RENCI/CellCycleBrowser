var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ProfileStore = require("./ProfileStore");

var CHANGE_EVENT = "change";

// List of available data sets for current profile
var dataSetList = [];

// Active data set
var dataSet = {};

var DataSetStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getDataSetList: function () {
    return dataSetList;
  },
  getDataSet: function () {
    return dataSet;
  },
  getDataSetFileName: function () {
    return dataSet.fileName;
  },
  getDataSetIndex: function () {
    return dataSetList.indexOf(dataSet);
  }
});

DataSetStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE:
      AppDispatcher.waitFor([ProfileStore.dispatchToken]);
      var profile = ProfileStore.getProfile();
      dataSetList = profile.cellData ? profile.cellData : [];
      dataSet = dataSetList.length > 0 ? dataSetList[0] : {};
      DataSetStore.emitChange();
      break;

    case Constants.SELECT_DATA_SET:
      dataSet = dataSetList[dataSetList.indexOf(action.dataSet)];
      DataSetStore.emitChange();
      break;
  }
});

module.exports = DataSetStore;
