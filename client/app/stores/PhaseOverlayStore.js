var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Show phase overlay or not
var show = false;

// Phase overlay opacity
var opacity = 1;

var PhaseOverlayStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getShow: function() {
    return show;
  },
  getOpacity: function () {
    return opacity;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.CHANGE_SHOW_PHASE_OVERLAY:
      show = action.show;
      PhaseOverlayStore.emitChange();
      break;

    case Constants.CHANGE_PHASE_OVERLAY_OPACITY:
      opacity = action.opacity;
      PhaseOverlayStore.emitChange();
      break;
  }
});

module.exports = PhaseOverlayStore;
