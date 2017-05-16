var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ProfileStore = require("./ProfileStore");

var CHANGE_EVENT = "change";

// List of available data sets
var dataSetList = [];

// List of currently loaded data sets
var dataSets = [];

function matchDataSet(dataSet) {
  // XXX: Use id instead of name when available
  var index = dataSetList.map(function (d) {
    return d.name;
  }).indexOf(dataSet.name);

  if (index !== -1) {
    dataSetList[index].active = dataSet.active;
    dataSetList[index].features = dataSet.features;
  }
}

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
  getDataSets: function () {
    return dataSets;
  },
  getDataSet: function (id) {
    var index = dataSets.map(function (dataSet) {
      return dataSet.id;
    }).indexOf(id);

    return index !== -1 ? dataSets[index] : null;
  }
});

DataSetStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_DATA_SET_LIST:
      dataSetList = action.dataSetList;
      DataSetStore.emitChange();
      break;

    case Constants.RECEIVE_PROFILE:
      // Clear data sets
      // XXX: Could look at matching with currently loaded data sets
      dataSets = [];
      DataSetStore.emitChange();
      break;

    case Constants.RECEIVE_DATA_SET:
      dataSets.push(action.dataSet);
      matchDataSet(action.dataSet);
      DataSetStore.emitChange();
      break;

    case Constants.SELECT_DATA_SET:
      var dataSet = DataSetStore.getDataSet(action.id);
      if (dataSet) {
        dataSet.active = !dataSet.active;
      }
      DataSetStore.emitChange();
      break;
  }
});

module.exports = DataSetStore;
