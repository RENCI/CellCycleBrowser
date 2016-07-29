var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");

module.exports = {
  selectDataSet: function(dataSetKey) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_DATA_SET,
      dataSetKey: dataSetKey
    });

    WebAPIUtils.getDataSet(dataSetKey);
  },
  selectMap: function(mapKey) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_MAP,
      mapKey: mapKey
    });
  },
  selectCellData: function(cellDataKey) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_CELL_DATA,
      cellDataKey: cellDataKey
    });
  },
  selectFeature: function(featureKey) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_FEATURE,
      featureKey: featureKey
    });
  },
  selectAlignment: function(alignment) {
    console.log(alignment);

    AppDispatcher.dispatch({
      actionType: Constants.SELECT_ALIGNMENT,
      alignment: alignment
    });
  }
};
