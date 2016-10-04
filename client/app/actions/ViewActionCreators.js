var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");

module.exports = {
  selectProfile: function(profileIndex) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_PROFILE,
      profileIndex: profileIndex
    });

    WebAPIUtils.getProfile(profileIndex);
  },
  selectModel: function(modelKey) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_MODEL,
      modelKey: modelKey
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
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_ALIGNMENT,
      alignment: alignment
    });
  }
};
