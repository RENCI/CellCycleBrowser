var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");

module.exports = {
  receiveWorkspaceList: function (workspaceList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_WORKSPACE_LIST,
      workspaceList: workspaceList
    });
  },
  receiveModelList: function (modelList) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_MODEL_LIST,
      modelList: modelList
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
  receiveModel: function (model) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_MODEL,
      model: model
    });
  },
  receiveDataset: function (dataset) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_DATASET,
      dataset: dataset
    });
  },
  receiveSimulationOutput: function (output, error) {
    if (typeof(error) === "undefined") error = null;

    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_SIMULATION_OUTPUT,
      output: output,
      error: error
    });
  },
  receiveSimulationProgress: function (progress) {
    if (typeof(progress) === "undefined") progress = null;

    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_SIMULATION_PROGRESS,
      progress: progress
    });
  },
  receiveNuclei: function (nuclei) {
    AppDispatcher.dispatch({
      actionType: Constants.RECEIVE_NUCLEI,
      nuclei: nuclei
    });
  }
};
