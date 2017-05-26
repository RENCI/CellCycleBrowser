var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");

module.exports = {
  receiveWorkspaceList: function (workspaceList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_WORKSPACE_LIST,
      workspaceList: workspaceList
    });
  },
  receiveDatasetList: function (datasetList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATASET_LIST,
      datasetList: datasetList
    });
  },
  receiveWorkspace: function (workspace) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_WORKSPACE,
      workspace: workspace
    });
  },
  receiveDataset: function (dataset) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATASET,
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
