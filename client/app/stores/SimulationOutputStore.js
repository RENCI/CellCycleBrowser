var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Simulation output data
var simulationOutput = null;

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
  var maxTimeStep = output.phases.reduce(function(p, c) {
    return Math.max(p, c.stop);
  }, -1);

  output.species.forEach(function (species) {
    species.values.length = maxTimeStep + 1;
  });

  output.timeSteps.length = maxTimeStep + 1;

  return output;
}

SimulationOutputStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_SIMULATION_OUTPUT:
      console.log(JSON.stringify(action.output.phases));
      console.log(action.output);
      simulationOutput = processOutput(action.output);
      console.log(simulationOutput);
      SimulationOutputStore.emitChange();
      break;
  }
});

module.exports = SimulationOutputStore;
