var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var WorkspaceStore = require("./WorkspaceStore");
var DataUtils = require("../utils/DataUtils");

var CHANGE_EVENT = "change";

// List of ids for default datasets
var defaultModels = [];

// List of available models
var modelList = [];

// The active model
var model = {};

function matchDefaults() {
  modelList.forEach(function (model) {
    model.default = defaultModels.indexOf(model.id) !== -1;
  });
}

function matchModel(model) {
  var m = DataUtils.find(modelList, "id", model.id);

  if (m) {
    m.phases = model.data.phases;
    m.reactions = model.data.reactions;
    m.species = model.data.species;
    m.speciesMatrices = model.data.speciesMatrices;
    m.speciesPhaseMatrix = model.data.speciesPhaseMatrix;
  }
}

function selectModel(id) {
  model = DataUtils.find(modelList, "id", id);
}

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
  hasModel: function (id) {
    var model = DataUtils.find(modelList, "id", id);

    return model && model.phases;
  }
});

ModelStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_MODEL_LIST:
      modelList = action.modelList;
      matchDefaults();
      ModelStore.emitChange();
      break;

    case Constants.RECEIVE_WORKSPACE:
      // Save default models
      defaultModels = action.workspace.modelList ?
                      action.workspace.modelList : [];
      matchDefaults();

      // Clear model
      // XXX: Could look at matching with currently loaded models instead
      // of starting from scratch
      model = {};
      ModelStore.emitChange();
      break;

    case Constants.RECEIVE_MODEL:
      matchModel(action.model);
      selectModel(action.model.id);
      ModelStore.emitChange();
      break;

    case Constants.SELECT_MODEL:
      selectModel(action.id);
      ModelStore.emitChange();
      break;
  }
});

module.exports = ModelStore;
