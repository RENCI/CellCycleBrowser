var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ProfileStore = require("./ProfileStore");

var CHANGE_EVENT = "change";

// List of available datasets
var datasetList = [];

// List of currently loaded datasets
var datasets = [];

function matchDataset(dataset) {
  // XXX: Use id instead of name when available
  var index = datasetList.map(function (d) {
    return d.name;
  }).indexOf(dataset.name);

  if (index !== -1) {
    datasetList[index].active = dataset.active;
    datasetList[index].features = dataset.features;
  }
}

function selectDataset(container, dataset) {
  // XXX: Use id instead of name when available
  var index = container.map(function (d) {
    return d.name;
  }).indexOf(dataset.name);

  if (index !== -1) {
    container[index].active = dataset.active;
  }
}

var DatasetStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getDatasetList: function () {
    return datasetList;
  },
  getDatasets: function () {
    return datasets;
  }
});

DatasetStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_DATASET_LIST:
      datasetList = action.datasetList;
      DatasetStore.emitChange();
      break;

    case Constants.RECEIVE_PROFILE:
      // Clear datasets
      // XXX: Could look at matching with currently loaded datasets instead
      // of starting from scratch
      datasets = [];
      DatasetStore.emitChange();
      break;

    case Constants.RECEIVE_DATASET:
      datasets.push(action.dataset);
      matchDataset(action.dataset);
      DatasetStore.emitChange();
      break;

    case Constants.SELECT_DATASET:
      selectDataset(datasetList, action.dataset);
      selectDataset(datasets, action.dataset);
      DatasetStore.emitChange();
      break;
  }
});

module.exports = DatasetStore;
