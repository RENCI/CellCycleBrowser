var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var WorkspaceStore = require("./WorkspaceStore");

var CHANGE_EVENT = "change";

// List of available models for the current workspace
var modelList = [];

// Active model
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
  },
  getModelIndex: function () {
    return modelList.indexOf(model);
  }
});

ModelStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_WORKSPACE:
      AppDispatcher.waitFor([WorkspaceStore.dispatchToken]);
      var workspace = WorkspaceStore.getWorkspace();
      modelList = workspace.models ? workspace.models : [];
      model = modelList.length > 0 ? modelList[0] : {};
      ModelStore.emitChange();
      break;

    case Constants.SELECT_MODEL:
      model = modelList[action.modelKey];
      ModelStore.emitChange();
      break;
  }
});

module.exports = ModelStore;
