var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ModelStore = require("./ModelStore");
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");

var CHANGE_EVENT = "change";

// Phase color scale
var colorScale = d3.scaleOrdinal(d3ScaleChromatic.schemeAccent);

function phases(model) {
  return model.phases ? model.phases.map((function (phase) {
    return phase.name;
  })) : [];
}

var PhaseColorStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getColorScale: function () {
    return colorScale;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE:
    case Constants.SELECT_MODEL:
      AppDispatcher.waitFor([ModelStore.dispatchToken]);
      colorScale.domain(phases(ModelStore.getModel()));
      PhaseColorStore.emitChange();
      break;
  }
});

module.exports = PhaseColorStore;
