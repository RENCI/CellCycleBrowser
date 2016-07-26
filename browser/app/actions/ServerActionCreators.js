var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");

module.exports = {
  receiveDataSetList: function(dataSetList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA_SET_LIST,
      dataSetList: dataSetList
    });
  },
  receiveDataSet: function(dataSet) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA_SET,
      dataSet: dataSet
    });
  }
};
