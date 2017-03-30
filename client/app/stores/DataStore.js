var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var ModelStore = require("./ModelStore");
var CellDataStore = require("./CellDataStore");
var SimulationOutputStore = require("./SimulationOutputStore");
var FeatureStore = require("./FeatureStore");
var AlignmentStore = require("./AlignmentStore");

var CHANGE_EVENT = "change";

// Input data sets
var model = {};
var cellData = {};
var simulationOutput = [];

// Input parameters
var feature = "";
var alignment = "";

// Output data
var data = {
  species: []
};

function updateData() {
  console.log("DATA!");

  var data = {};

  // Get the list of species present in cell data or model
  var cellSpecies = cellData.species;
  var modelSpecies = model.species ? model.species : [];
  var allSpecies = [];

  cellSpecies.concat(modelSpecies).forEach(function(species) {
    if (allSpecies.indexOf(species.name) === -1) allSpecies.push(species.name);
  });

  console.log(allSpecies);
  console.log(cellData);
  console.log(simulationOutput);

  // Combine cell data and simulation output per species
  data.species = allSpecies.map(function(species) {
    // Cell data for this species
    var cd = [];
    for (var i = 0; i < cellSpecies.length; i++) {
      if (cellSpecies[i].name === species) {
        cd = cellSpecies[i].cells.map(function(cell) {
          var featureIndex = cell.features.map(function(d) {
            return d.name;
          }).indexOf(feature);

          return {
            name: cell.name,
            values: cell.features[featureIndex].values.map(function(d) {
              return {
                start: d.time,
                stop: d.stop,
                value: d.value
              };
            })
          };
        });

        break;
      }
    }

    console.log(cd);

    // Simulation output for this species
    var so = [];

    return {
      name: species,
      cellData: cd,
      simulationOutput: so
    };
  });

  console.log(data);

  return data;
}

var DataStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getData: function () {
    return data;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_PROFILE:
      AppDispatcher.waitFor([ModelStore.dispatchToken,
                             CellDataStore.dispatchToken,
                             SimulationOutputStore.dispatchToken,
                             FeatureStore.dispatchToken]);

      model = ModelStore.getModel();
      cellData = CellDataStore.getCellData();
      simulationOutput = SimulationOutputStore.getSimulationOutput();
      feature = FeatureStore.getFeatureList()[FeatureStore.getFeatureKey()];
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_MODEL:
      AppDispatcher.waitFor([ModelStore.dispatchToken]);
      model = ModelStore.getModel();
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_CELL_DATA:
      AppDispatcher.waitFor([CellDataStore.dispatchToken,
                             FeatureStore.dispatchToken]);
      cellData = CellDataStore.getCellData();
      feature = FeatureStore.getFeatureList()[FeatureStore.getFeatureKey()];
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.RECEIVE_SIMULATION_OUTPUT:
      AppDispatcher.waitFor([SimulationOutputStore.dispatchToken]);
      simulationOutput = SimulationOutputStore.getSimulationOutput();
      state = Constants.SIMULATION_OUTPUT_VALID;
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_FEATURE:
      AppDispatcher.waitFor([FeatureStore.dispatchToken]);
      feature = FeatureStore.getFeatureList()[FeatureStore.getFeatureKey()];
      data = updateData();
      DataStore.emitChange();
      break;

    case Constants.SELECT_ALIGNMENT:
      AppDispatcher.waitFor([AlignmentStore.dispatchToken]);
      alignment = AlignmentStore.getAlignment();
      data = updateData();
      DataStore.emitChange();
      break;
  }
});

module.exports = DataStore;
