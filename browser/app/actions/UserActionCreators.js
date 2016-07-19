var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");

module.exports = {
  selectCellLine: function(cellLine) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_CELL_LINE,
      cellLine: cellLine
    });
  }
};
