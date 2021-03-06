var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

var progressStart = "G1_1,1";

// Simulation output data
var state = Constants.SIMULATION_OUTPUT_NONE;
var error = null;
var progress = progressStart;
var simulationOutput = [];

var SimulationOutputStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getState: function () {
    return state;
  },
  getSimulationOutput: function () {
    return simulationOutput;
  },
  getProgress: function () {
    return progress;
  },
  getError: function () {
    return error;
  }
});

SimulationOutputStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_WORKSPACE:
      state = Constants.SIMULATION_OUTPUT_NONE;
      simulationOutput = [];
      error = null;
      SimulationOutputStore.emitChange();
      break;

    case Constants.RUN_SIMULATION:
      state = Constants.SIMULATION_OUTPUT_INVALID;
      error = null;
      progress = progressStart;
      SimulationOutputStore.emitChange();
      break;

    case Constants.RECEIVE_SIMULATION_PROGRESS:
      state = Constants.SIMULATION_OUTPUT_INVALID;
      progress = action.progress;
      SimulationOutputStore.emitChange();
      break;

    case Constants.RECEIVE_SIMULATION_OUTPUT:
      state = Constants.SIMULATION_OUTPUT_VALID;
      simulationOutput = action.output;
      error = action.error;
      SimulationOutputStore.emitChange();
      break;

    case Constants.SELECT_MODEL:
    case Constants.RECEIVE_MODEL:
      error = null;
      simulationOutput = [];
      SimulationOutputStore.emitChange();
      break;
  }
});

module.exports = SimulationOutputStore;
