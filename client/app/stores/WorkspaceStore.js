var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// List of available workspaces
var workspaceList = [];

// Active workspace
var workspace = {};
var workspaceIndex = -1;

var WorkspaceStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getWorkspaceList: function () {
    return workspaceList;
  },
  getWorkspace: function () {
    return workspace;
  },
  getWorkspaceIndex: function () {
    return workspaceIndex;
  }
});

WorkspaceStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_WORKSPACE_LIST:
      workspaceList = action.workspaceList;
      workspace = {};
      workspaceIndex = -1;
      WorkspaceStore.emitChange();
      break;

    case Constants.RECEIVE_WORKSPACE:
      workspace = action.workspace;
      workspaceIndex = workspaceList.map(function (workspace) {
        // Assuming unique workspace names
        return workspace.name;
      }).indexOf(workspace.name);
      WorkspaceStore.emitChange();
      break;
  }
});

module.exports = WorkspaceStore;
