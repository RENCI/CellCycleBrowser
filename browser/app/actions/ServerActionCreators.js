var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");

module.exports = {
  receiveDataSets: function(dataSets) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA_SETS,
      dataSets: dataSets
    });
  },
  receiveData: function(data) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA,
      data: data
    });
  }
};
