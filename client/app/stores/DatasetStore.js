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
  var index = datasetList.map(function (d) {
    return d.id;
  }).indexOf(dataset.id);

  if (index !== -1) {
    datasetList[index].active = dataset.active;
    datasetList[index].features = dataset.features;
  }
}

function selectDataset(container, dataset) {
  var ds = find(container, "id", dataset.id);

  if (ds) {
    ds.active = dataset.active;
  }
}

function selectFeature(container, feature) {
  var ds = find(container, "id", feature.datasetId);

  if (ds) {
    var f = find(ds.features, "name", feature.name);

    if (f) {
      f.active = feature.active;
    }
  }
}

function find(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) return array[i];
  }

  return null;
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

    case Constants.SELECT_FEATURE:
      selectFeature(datasetList, action.feature);
      selectFeature(datasets, action.feature);
      DatasetStore.emitChange();
  }
});

module.exports = DatasetStore;
