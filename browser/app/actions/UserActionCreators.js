var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");

var UserActions = {
  selectCellLine: function(cellLine) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_CELL_LINE,
      cellLine: cellLine
    });
  }
};

module.exports = UserActions;
