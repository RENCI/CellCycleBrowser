var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");

module.exports = {
  selectDataSet: function(dataSet) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_DATA_SET,
      dataSet: dataSet
    });
  }
};
