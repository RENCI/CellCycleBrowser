var keyMirror = require("keymirror");

module.exports = keyMirror({
  SELECT_WORKSPACE: null,
  SELECT_MODEL: null,
  SELECT_DATASET: null,
  SELECT_FEATURE: null,
  SELECT_ALIGNMENT: null,
  SORT_TRACKS: null,
  INSERT_TRACK: null,
  SELECT_TRACE: null,
  SELECT_TRAJECTORY: null,
  SELECT_PHASE: null,

  CHANGE_SHOW_PHASE_OVERLAY: null,
  CHANGE_PHASE_OVERLAY_OPACITY: null,

  RUN_SIMULATION: null,
  CHANGE_SIMULATION_PARAMETER: null,
  CHANGE_SPECIES_INITIAL_VALUE: null,
  CHANGE_SPECIES_PHASE_INTERACTION: null,
  CHANGE_SPECIES_SPECIES_INTERACTION: null,

  RECEIVE_WORKSPACE_LIST: null,
  RECEIVE_MODEL_LIST: null,
  RECEIVE_DATASET_LIST: null,
  RECEIVE_WORKSPACE: null,
  RECEIVE_MODEL: null,
  RECEIVE_DATASET: null,
  RECEIVE_SIMULATION_OUTPUT: null,

  SIMULATION_OUTPUT_NONE: null,
  SIMULATION_OUTPUT_WAITING: null,
  SIMULATION_OUTPUT_INVALID: null,
  SIMULATION_OUTPUT_VALID: null,

  // Must be lowercase for drag and drop data types
  drag_track_type: null
});
