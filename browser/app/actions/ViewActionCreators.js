var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");

module.exports = {
  selectDataSet: function(dataSet) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_DATA_SET,
      dataSet: dataSet
    });

    WebAPIUtils.getData(dataSet);
  },
  selectMap: function(mapIndex) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_MAP,
      mapIndex: mapIndex
    });
  }
};
