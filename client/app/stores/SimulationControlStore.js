var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ModelStore = require("./ModelStore");

var CHANGE_EVENT = "change";

// Controls
var controls = {
  // Hard-coding parameters for now
  parameters: [
    {
      name: "numCells",
      label: "Number of cells",
      min: 1,
      max: 20,
      value: 4
    }
  ],
  species: [],
  phases: [],
  speciesExpressionLevels: {},
  speciesDegradations: {},
  speciesPhaseMatrix: {},
  speciesSpeciesMatrices: {}
};

var SimulationControlStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getControls: function () {
    return controls;
  }
});

function createControls(model) {
  if (!model.species) {
    controls.species = [];
    controls.phases = [];
    return;
  }

  // Copy species and models
  controls.species = model.species.map(function (species) {
    return species.name;
  });

  controls.phases = model.phases.map(function (phase) {
    return phase.name;
  });

  // Create species expression levels object
  controls.speciesExpressionLevels = {};
  model.species.forEach(function (species, i) {
    controls.speciesExpressionLevels[species.name] = {
      min: -5,
      max: 5,
      exponent: 0,
      initialValue: model.species[i].value
    };
  });

  // Create species degradation object
  controls.speciesDegradations = {};
  model.species.forEach(function (species, i) {
    controls.speciesDegradations[species.name] = {
      min: -5,
      max: 5,
      exponent: 0
    };
  });

  // Create species-phase matrix object
  controls.speciesPhaseMatrix = {};
  controls.species.forEach(function (species, i) {
    controls.speciesPhaseMatrix[species] = {};
    controls.phases.forEach(function (phase, j) {
      var value = model.speciesPhaseMatrix[i][j];

      controls.speciesPhaseMatrix[species][phase] = {
        min: -10,
        max: 10,
        initialValue: value,
        value: value
      };
    });
  });

  // Create species-species matrix objects
  controls.speciesSpeciesMatrices = {};
  controls.phases.forEach(function (phase, i) {
    controls.speciesSpeciesMatrices[phase] = {};
    controls.species.forEach(function (upstream, j) {
      controls.speciesSpeciesMatrices[phase][upstream] = {};
      controls.species.forEach(function (downstream, k) {
        if (j === k) return;

        var value = model.speciesMatrices[i][j][k];

        controls.speciesSpeciesMatrices[phase][upstream][downstream] = {
          min: -10,
          max: 10,
          initialValue: value,
          value: value
        };
      });
    });
  });
}

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_WORKSPACE:
    case Constants.RECEIVE_MODEL:
    case Constants.SELECT_MODEL:
      AppDispatcher.waitFor([ModelStore.dispatchToken]);
      createControls(ModelStore.getModel());
      SimulationControlStore.emitChange();
      break;

    case Constants.CHANGE_SIMULATION_PARAMETER:
      var i = controls.parameters.map(function (parameter) {
        return parameter.name;
      }).indexOf(action.parameter);
      controls.parameters[i].value = action.value;
      SimulationControlStore.emitChange();
      break;

    case Constants.CHANGE_SPECIES_EXPRESSION_LEVEL:
      controls.speciesExpressionLevels[action.species].exponent = action.value;
      SimulationControlStore.emitChange();
      break;

    case Constants.CHANGE_SPECIES_DEGRADATION:
      controls.speciesDegradations[action.species].exponent = action.value;
      SimulationControlStore.emitChange();
      break;

    case Constants.CHANGE_SPECIES_PHASE_INTERACTION:
      controls.speciesPhaseMatrix[action.species][action.phase].value = action.value;
      SimulationControlStore.emitChange();
      break;

    case Constants.CHANGE_SPECIES_SPECIES_INTERACTION:
      controls.speciesSpeciesMatrices[action.phase][action.upstream][action.downstream].value = action.value;
      SimulationControlStore.emitChange();
      break;
  }
});

module.exports = SimulationControlStore;
