var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");
var DatasetStore = require("../stores/DatasetStore");

module.exports = {
  selectProfile: function (profileIndex) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_PROFILE,
      profileIndex: profileIndex
    });

    WebAPIUtils.getProfile(profileIndex);
  },
  selectModel: function (modelKey) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_MODEL,
      modelKey: modelKey
    });
  },
  selectDataset: function (dataset) {
    if (DatasetStore.hasDataset(dataset.id)) {
      AppDispatcher.dispatch({
        actionType: Constants.SELECT_DATASET,
        dataset: dataset
      });
    }
    else {
      // XXX: Temporary fix
      var list = DatasetStore.getDatasetList();

      WebAPIUtils.getDataset(list.map(function(d) {
        return d.id;
      }).indexOf(dataset.id));
    }
  },
  selectFeature: function (feature) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_FEATURE,
      feature: feature
    });
  },
  selectAlignment: function (alignment) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_ALIGNMENT,
      alignment: alignment
    });
  },
  sortTracks: function (sortMethod) {
    AppDispatcher.dispatch({
      actionType: Constants.SORT_TRACKS,
      sortMethod: sortMethod
    });
  },
  insertTrack: function (oldIndex, newIndex) {
    AppDispatcher.dispatch({
      actionType: Constants.INSERT_TRACK,
      oldIndex: oldIndex,
      newIndex: newIndex
    });
  },
  selectTrace: function (trace, selected) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_TRACE,
      trace: trace,
      selected: selected
    });
  },
  selectTrajectory: function (trajectory) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_TRAJECTORY,
      trajectory: trajectory
    });
  },
  selectPhase: function (phase) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_PHASE,
      phase: phase
    });
  },
  changeShowPhaseOverlay: function (show) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_SHOW_PHASE_OVERLAY,
      show: show
    });
  },
  changePhaseOverlayOpacity: function (opacity) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_PHASE_OVERLAY_OPACITY,
      opacity: opacity
    });
  },
  runSimulation: function () {
    AppDispatcher.dispatch({
      actionType: Constants.RUN_SIMULATION
    });

    WebAPIUtils.runSimulation();
  },
  changeSimulationParameter: function (parameter, value) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_SIMULATION_PARAMETER,
      parameter: parameter,
      value: value
    });
  },
  changeSpeciesInitialValue: function (species, value) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_SPECIES_INITIAL_VALUE,
      species: species,
      value: value
    });
  },
  changeSpeciesPhaseInteraction: function (species, phase, value) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_SPECIES_PHASE_INTERACTION,
      species: species,
      phase: phase,
      value: value
    });
  },
  changeSpeciesSpeciesInteraction: function (phase, upstream, downstream, value) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_SPECIES_SPECIES_INTERACTION,
      phase: phase,
      upstream: upstream,
      downstream: downstream,
      value: value
    });
  }
};
