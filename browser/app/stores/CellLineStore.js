var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");

var CHANGE_EVENT = "change";

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
  getCellLine: function () {
    return cellLine;
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case Constants.SELECT_CELL_LINE:
      cellLine = action.cellLine;
      CellLineStore.emitChange();
      break;
  }
});

module.exports = CellLineStore;
