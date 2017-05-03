var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ProfileStore = require("./ProfileStore");

var CHANGE_EVENT = "change";

// List of available cell data sets for current profile
var cellDataList = [];

// Active cell data set
var cellData = {};

var CellDataStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getCellDataList: function () {
    return cellDataList;
  },
  getCellData: function () {
    return cellData;
  },
  getCellDataFileName: function () {
    return cellData.fileName;
  },
  getCellDataIndex: function () {
    return cellDataList.indexOf(cellData);
  }
});

CellDataStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE:
      AppDispatcher.waitFor([ProfileStore.dispatchToken]);
      var profile = ProfileStore.getProfile();
      cellDataList = profile.cellData ? profile.cellData : [];
      cellData = cellDataList.length > 0 ? cellDataList[0] : {};
      CellDataStore.emitChange();
      break;

    case Constants.SELECT_CELL_DATA:
      cellData = cellDataList[action.cellDataKey];
      CellDataStore.emitChange();
      break;
  }
});

module.exports = CellDataStore;
