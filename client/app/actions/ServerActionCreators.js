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
  receiveDatasetList: function (datasetList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA_SET_LIST,
      datasetList: datasetList
    });
  },
  receiveProfile: function (profile) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_PROFILE,
      profile: profile
    });
  },
  receiveDataset: function (dataset) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATA_SET,
      dataset: dataset
    });
  },
  receiveSimulationOutput: function(output) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_SIMULATION_OUTPUT,
      output: output
    });
  }
};
