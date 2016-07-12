var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");

module.exports = {
  receiveCellLines: function(cellLines) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_CELL_LINES,
      cellLines: cellLines
    });
  },
  receiveData: function(data) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA,
      data: data
    });
  }
}
