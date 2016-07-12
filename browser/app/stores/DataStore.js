var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

var CHANGE_EVENT = "change";

var cellLines = {
  cellLine1: "Hello 1!",
  cellLine2: "Hello 2!"
};

var data = cellLines.cellLine1;

var DataStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getAll: function () {
    return data;
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    // XXX: Change to using constants
    case "CHANGE_CELL_LINE":
      data = cellLines[action.cellLine.cellLine];

      console.log(data);

      DataStore.emitChange();
      break;
  }
});

module.exports = DataStore;
