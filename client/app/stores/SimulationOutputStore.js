var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Simulation output data
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
  getSimulationOutput: function () {
    return simulationOutput;
  }
});

function processOutput(output) {
  // Convert time steps from hours to minutes
  output.forEach(function(trajectory) {
    trajectory.timeSteps = trajectory.timeSteps.map(function(time) {
      return time * 60;
    });
  });

  return output;
}

SimulationOutputStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_SIMULATION_OUTPUT:
      simulationOutput = processOutput(action.output);
      SimulationOutputStore.emitChange();
      break;
  }
});

module.exports = SimulationOutputStore;
