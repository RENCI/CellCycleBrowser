var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

var dataSets = [];
var dataSet = "";

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
  getDataSets: function () {
    return dataSets;
  },
  getDataSet: function () {
    return dataSet;
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case Constants.RECEIVE_DATA_SETS:
      dataSets = action.dataSets;
      if (dataSet === "") dataSet = dataSets[0].value;
      DataSetStore.emitChange();
      break;

    case Constants.SELECT_DATA_SET:
      dataSet = action.dataSet;
      DataSetStore.emitChange();
      break;
  }
});

module.exports = DataSetStore;
