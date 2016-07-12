var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

var cellLines = [];
var cellLine = "";

var CellLineStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getCellLines: function () {
    return cellLines;
  },
  getCellLine: function () {
    return cellLine;
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case Constants.RECEIVE_CELL_LINES:
      cellLines = action.cellLines;
      if (cellLine === "") cellLine = cellLines[0].value;
      CellLineStore.emitChange();
      break;

    case Constants.SELECT_CELL_LINE:
      cellLine = action.cellLine;

console.log("store", cellLine);

      CellLineStore.emitChange();
      break;
  }
});

module.exports = CellLineStore;
