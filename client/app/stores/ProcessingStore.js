var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

var processing = false;

var ProcessingStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getProcessing: function () {
    return processing;
  }
});

ProcessingStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.PROCESSING_COMPLETE:
      processing = false;
      ProcessingStore.emitChange();
      break;

    case Constants.SELECT_ALIGNMENT:
      if (!processing) {
        processing = true;
        ProcessingStore.emitChange();
      }
      break;
  }
});

module.exports = ProcessingStore;
