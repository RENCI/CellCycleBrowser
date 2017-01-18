var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Phase overlay opacity
var opacity = 1;

var PhaseOverlayOpacityStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getOpacity: function () {
    return opacity;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.CHANGE_PHASE_OVERLAY_OPACITY:
      opacity = action.opacity;
      PhaseOverlayOpacityStore.emitChange();
      break;
  }
});

module.exports = PhaseOverlayOpacityStore;
