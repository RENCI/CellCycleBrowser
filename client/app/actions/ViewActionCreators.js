var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/Constants");
var WebAPIUtils = require("../utils/WebAPIUtils");
var ModelStore = require("../stores/ModelStore");
var DatasetStore = require("../stores/DatasetStore");

module.exports = {
  selectWorkspace: function (id) {
    WebAPIUtils.getWorkspace(id);
  },
  selectModel: function (id) {
    if (!ModelStore.hasModel(id) && ModelStore.validModel(id)) {
      // Model is valid, but need to get it from the server
      WebAPIUtils.getModel(id);
    }
    else {
      AppDispatcher.dispatch({
        actionType: Constants.SELECT_MODEL,
        id: id
      });
    }
  },
  selectDataset: function (dataset) {
    if (DatasetStore.hasDataset(dataset.id)) {
      AppDispatcher.dispatch({
        actionType: Constants.SELECT_DATASET,
        dataset: dataset
      });
    }
    else if (dataset.active) {
      WebAPIUtils.getDataset(dataset.id);
    }
  },
  selectFeature: function (feature) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_FEATURE,
      feature: feature
    });
  },
  selectAnalysisPlot: function (plot) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_SUMMARY_PLOT,
      plot: plot
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
  highlightTrace: function (trace) {
    AppDispatcher.dispatch({
      actionType: Constants.HIGHLIGHT_TRACE,
      trace: trace
    });
  },
  selectAllTraces: function (trace, selected, selectPhase) {
    if (typeof selectPhase === "undefined") selectPhase = false;

    AppDispatcher.dispatch({
      actionType: Constants.SELECT_ALL_TRACES,
      trace: trace,
      selected: selected,
      selectPhase: selectPhase
    });
  },
  selectPhaseTrace: function (trace, selected) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_PHASE_TRACE,
      trace: trace,
      selected: selected
    });
  },
  clusterTraces: function (track, cluster) {
    AppDispatcher.dispatch({
      actionType: Constants.CLUSTER_TRACES,
      track: track,
      cluster: cluster
    });
  },
  showDendrogram: function (track, show) {
    AppDispatcher.dispatch({
      actionType: Constants.SHOW_DENDROGRAM,
      track: track,
      show: show
    });
  },
  showPhaseOverlay: function (track) {
    AppDispatcher.dispatch({
      actionType: Constants.SHOW_PHASE_OVERLAY,
      track: track
    });
  },
  rescaleTraces: function (track) {
    AppDispatcher.dispatch({
      actionType: Constants.RESCALE_TRACES,
      track: track
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
  cancelSimulation: function () {
    AppDispatcher.dispatch({
      actionType: Constants.CANCEL_SIMULATION
    });

    WebAPIUtils.cancelSimulation();
  },
  changeSimulationParameter: function (parameter, value) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_SIMULATION_PARAMETER,
      parameter: parameter,
      value: value
    });
  },
  changeSpeciesExpressionLevel: function (species, value) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_SPECIES_EXPRESSION_LEVEL,
      species: species,
      value: value
    });
  },
  changeSpeciesDegradation: function (species, value) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_SPECIES_DEGRADATION,
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
  },
  changeModelFitTracks: function (simulationTrack, dataTrack) {
    AppDispatcher.dispatch({
      actionType: Constants.CHANGE_MODEL_FIT_TRACKS,
      simulationTrack: simulationTrack,
      dataTrack: dataTrack
    });
  },
  computeModelFit: function () {
    AppDispatcher.dispatch({
      actionType: Constants.COMPUTE_MODEL_FIT
    });
  }
};
