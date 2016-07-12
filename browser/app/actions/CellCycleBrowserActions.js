var AppDispatcher = require("../dispatcher/AppDispatcher");

var CellCycleBrowserActions = {
  changeCellLine: function(cellLine) {
    AppDispatcher.dispatch({
      actionType: "CHANGE_CELL_LINE",
      cellLine: cellLine
    });
  }
};

module.exports = CellCycleBrowserActions;
