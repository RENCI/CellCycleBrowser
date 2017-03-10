var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

// Alignment
var alignment = "left";

var AlignmentStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getAlignment: function () {
    return alignment;
  }
});

AlignmentStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_ALIGNMENT:
      alignment = action.alignment;
      AlignmentStore.emitChange();
      break;
  }
});

module.exports = AlignmentStore;
