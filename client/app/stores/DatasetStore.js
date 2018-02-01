var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var DataUtils = require("../utils/DataUtils");

var CHANGE_EVENT = "change";

// List of ids for default datasets
var defaultDatasets = [];

// List of available datasets
var datasetList = [];

// List of active datasets
var datasets = [];

function matchDefaults() {
  datasetList.forEach(function (dataset) {
    dataset.default = defaultDatasets.indexOf(dataset.id) !== -1;
    dataset.active = dataset.default;
  });
}

function matchDataset(dataset) {
  var ds = DataUtils.find(datasetList, "id", dataset.id);

  if (ds) {
    ds.active = true;
    ds.features = dataset.features;
    ds.species = dataset.species;
  }
}

function selectDataset(dataset) {
  // Find dataset
  var ds = DataUtils.find(datasetList, "id", dataset.id);

  if (ds) {
    // Activate or deactivate
    ds.active = dataset.active;

    // Add/remove from datasets
    if (ds.active) {
      if (!DataUtils.find(datasets, "id", dataset.id)) {
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
  var ds = DataUtils.find(container, "id", feature.datasetId);

  if (ds) {
    var f = DataUtils.find(ds.features, "name", feature.name);

    if (f) {
      f.active = feature.active;
    }
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
  },
  hasDataset: function (id) {
    var dataset = DataUtils.find(datasetList, "id", id);

    return dataset && dataset.species;
  }
});

DatasetStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_DATASET_LIST:
      datasetList = action.datasetList;
      matchDefaults();
      DatasetStore.emitChange();
      break;

    case Constants.RECEIVE_WORKSPACE:
      // Save default datasets
      defaultDatasets = action.workspace.datasetList ?
                        action.workspace.datasetList : [];
      matchDefaults();

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
