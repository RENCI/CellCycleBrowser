var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

var dataSetList = [];
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
  getDataSetList: function () {
    return dataSetList;
  },
  getDataSet: function () {
    return dataSet;
  }
});

AppDispatcher.register(function(action) {  
  switch (action.actionType) {
    case Constants.RECEIVE_DATA_SET_LIST:
      dataSetList = action.dataSetList;
      // TODO: Move to data set select?
      dataSet = dataSetList[0].value;
      DataSetStore.emitChange();
      break;

    case Constants.SELECT_DATA_SET:
      dataSet = action.dataSet;
      DataSetStore.emitChange();
      break;
  }
});

module.exports = DataSetStore;
