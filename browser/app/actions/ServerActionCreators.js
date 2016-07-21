var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");

module.exports = {
  receiveDataSetList: function(dataSetList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA_SET_LIST,
      dataSetList: dataSetList
    });
  },
  receiveData: function(data) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA,
      data: data
    });
  }
};
