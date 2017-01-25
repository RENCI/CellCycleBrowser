var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Phase
var phase = "";

var PhaseStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getPhase: function () {
    return phase;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_PHASE:
      phase = action.phase;
      PhaseStore.emitChange();
      break;
  }
});

module.exports = PhaseStore;
