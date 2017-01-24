var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ProfileStore = require("./ProfileStore");

var CHANGE_EVENT = "change";

// Model data
var modelList = [];
var model = {};

var ModelStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getModelList: function () {
    return modelList;
  },
  getModel: function () {
    return model;
  }
});

ModelStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE:
      AppDispatcher.waitFor([ProfileStore.dispatchToken]);
      var profile = ProfileStore.getProfile();
      modelList = profile.models ? profile.models : [];
      model = modelList.length > 0 ? modelList[0] : {};
      ModelStore.emitChange();
      break;

    case Constants.SELECT_MODEL:
      model = modelList[action.modelKey];
      console.log(model);
      ModelStore.emitChange();
      break;
  }
});

module.exports = ModelStore;
