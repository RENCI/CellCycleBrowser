var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Simulation output data
var state = Constants.SIMULATION_OUTPUT_NONE;
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
  }
});

SimulationOutputStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_WORKSPACE:
      simulationOutput = [];
      SimulationOutputStore.emitChange();
      break;

    case Constants.RUN_SIMULATION:
      state = Constants.SIMULATION_OUTPUT_INVALID;
      SimulationOutputStore.emitChange();
      break;

    case Constants.RECEIVE_SIMULATION_OUTPUT:
      state = Constants.SIMULATION_OUTPUT_VALID;
      simulationOutput = action.output;
      SimulationOutputStore.emitChange();
      break;
  }
});

module.exports = SimulationOutputStore;
