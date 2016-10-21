var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ProfileStore = require("./ProfileStore");

var CHANGE_EVENT = "change";

// Model data
var modelList = [];
var model = {};

var ModelStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getModelList: function () {
    return modelList;
  },
  getModel: function () {
    return model;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.SELECT_MODEL:
      model = modelList[action.modelKey];
      ModelStore.emitChange();
      break;

    case Constants.RECEIVE_PROFILE:
      AppDispatcher.waitFor([ProfileStore.dispatchToken]);
      var profile = ProfileStore.getProfile();
      modelList = profile.models ? profile.models : [];
      model = modelList.length > 0 ? modelList[0] : {};
      ModelStore.emitChange();
      break;

    case Constants.CHANGE_SPECIES_VALUE:
      var i = model.species.map(function (d) {
        return d.name;
      }).indexOf(action.species);

      model.species[i].value = action.value;
      ModelStore.emitChange();
      break;

    case Constants.CHANGE_SPECIES_PHASE_VALUE:
      var i = model.species.map(function (d) {
        return d.name;
      }).indexOf(action.species);

      var j = model.phases.map(function (d) {
        return d.name;
      }).indexOf(action.phase);

      model.speciesPhaseMatrix[i][j] = action.value;
      ModelStore.emitChange();
      break;
  }
});

module.exports = ModelStore;
