var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var WorkspaceStore = require("./WorkspaceStore");

var CHANGE_EVENT = "change";

// List of available datasets
var datasetList = [];

// List of active datasets
var datasets = [];

function matchDataset(dataset) {
  var ds = find(datasetList, "id", dataset.id);

  if (ds) {
    ds.active = true;
    ds.features = dataset.features;
    ds.species = dataset.species;
  }
}

function selectDataset(dataset) {
  // Find dataset
  var ds = find(datasetList, "id", dataset.id);

  if (ds) {
    // Activate or deactivate
    ds.active = dataset.active;

    // Add/remove from datasets
    if (ds.active) {
      if (!find(datasets, "id", dataset.id)) {
        datasets.push(ds);
      }
    }
    else {
      datasets = datasets.filter(function(d) {
        return d.active;
      });
    }
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
  },
  hasDataset: function (id) {
    var dataset = find(datasetList, "id", id);

    return dataset && dataset.species;
  }
});

DatasetStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_DATASET_LIST:
      datasetList = action.datasetList;
      datasetList.forEach(function(d) {
        d.active = false;
      });
      DatasetStore.emitChange();
      break;

    case Constants.RECEIVE_WORKSPACE:
      // Clear datasets
      // XXX: Could look at matching with currently loaded datasets instead
      // of starting from scratch
      datasets = [];
      DatasetStore.emitChange();
      break;

    case Constants.RECEIVE_DATASET:
      matchDataset(action.dataset);
      selectDataset({id: action.dataset.id, active: true});
      DatasetStore.emitChange();
      break;

    case Constants.SELECT_DATASET:
      selectDataset(action.dataset);
      DatasetStore.emitChange();
      break;

    case Constants.SELECT_FEATURE:
      selectFeature(datasetList, action.feature);
      selectFeature(datasets, action.feature);
      DatasetStore.emitChange();
  }
});

module.exports = DatasetStore;
