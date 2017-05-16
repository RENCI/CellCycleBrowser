var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");

module.exports = {
  receiveProfileList: function (profileList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_PROFILE_LIST,
      profileList: profileList
    });
  },
  receiveDataSetList: function (dataSetList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA_SET_LIST,
      dataSetList: dataSetList
    });
  },
  receiveProfile: function (profile) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_PROFILE,
      profile: profile
    });
  },
  receiveDataSet: function (dataSet) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA_SET,
      dataSet: dataSet
    });
  },
  receiveSimulationOutput: function(output) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_SIMULATION_OUTPUT,
      output: output
    });
  }
};
