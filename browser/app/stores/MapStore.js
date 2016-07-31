var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ProfileStore = require("./ProfileStore");

var CHANGE_EVENT = "change";

// Map data
var mapList = [];
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
  getMapList: function () {
    return mapList;
  },
  getMap: function () {
    return map;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_MAP:
      map = mapList[action.mapKey];
      MapStore.emitChange();
      break;

    case Constants.RECEIVE_PROFILE:
      AppDispatcher.waitFor([ProfileStore.dispatchToken]);
      var profile = ProfileStore.getProfile();
      mapList = profile.maps ? profile.maps : [];
      map = mapList.length > 0 ? mapList[0] : {};
      MapStore.emitChange();
      break;
  }
});

module.exports = MapStore;
