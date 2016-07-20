var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Map data
var maps = [];
var map = {};

var MapStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getMaps: function () {
    return maps;
  },
  getMap: function () {
    return map;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_MAP:
      map = maps[action.mapIndex];
      MapStore.emitChange();
      break;

    case Constants.RECEIVE_DATA:
      maps = action.data.maps;
      map = maps.length > 0 ? maps[0] : {};
      MapStore.emitChange();
      break;
  }
});

module.exports = MapStore;
