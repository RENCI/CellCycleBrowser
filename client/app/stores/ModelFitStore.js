var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataStore = require("./DataStore");

var CHANGE_EVENT = "change";

var data = null;

var modelFit = {
  allSimulationSpecies: [],
  allDatasetSpecies: [],
  simulationSpecies: null,
  datasetSpecies: null,
  fit: null
};

function updateData() {
  console.log(data);
}

function updateSpecies(simulationSpecies, datasetSpecies) {
  console.log(simulationSpecies, datasetSpecies);
}

function computeModelFit() {
  console.log("FIT");
}

var ModelFitStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getModelFit: function() {
    return modelFit;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_WORKSPACE:
    case Constants.RECEIVE_DATASET:
    case Constants.SELECT_DATASET:
    case Constants.SELECT_FEATURE:
      AppDispatcher.waitFor([DataStore.dispatchToken]);
      updateData(DataStore.getData());
      ModelFitStore.emitChange();
      break;

    case Constants.CHANGE_MODEL_FIT_SPECIES:
      updateSpecies(action.modelSpecies,
                    action.datasetSpecies);
      ModelFitStore.emitChange();
      break;

    case Constants.COMPUTE_MODEL_FIT:
      computeModelFit();
      ModelFitStore.emitChange();
      break;
  }
});

module.exports = ModelFitStore;
