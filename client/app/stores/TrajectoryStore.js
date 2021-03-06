var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Trajectory
var trajectory = null;

var TrajectoryStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getTrajectory: function () {
    return trajectory;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_TRAJECTORY:
      trajectory = action.trajectory;
      TrajectoryStore.emitChange();
      break;

    case Constants.RECEIVE_SIMULATION_OUTPUT:
      trajectory = null;
      TrajectoryStore.emitChange();
      break;
  }
});

module.exports = TrajectoryStore;
