var React = require("react");
var PropTypes = require("prop-types");
var ModelFit = require("../components/ModelFit");
var ModelFitStore = require("../stores/ModelFitStore");
var ViewActionCreators = require("../actions/ViewActionCreators");
var DataUtils = require("../utils/DataUtils");

function getStateFromStore() {
  return {
    modelFit: ModelFitStore.getModelFit()
  };
}

class ModelFitContainer extends React.Component {
  constructor() {
    super();

    this.state = getStateFromStore();

    // Need to bind this to callback functions here
    this.onModelFitChange = this.onModelFitChange.bind(this);
    this.handleChangeSimulationSpecies = this.handleChangeSimulationSpecies.bind(this);
    this.handleChangeDatasetSpecies = this.handleChangeDatasetSpecies.bind(this);
  }

  componentDidMount() {
    ModelFitStore.addChangeListener(this.onModelFitChange);
  }

  componentWillUnmount() {
    ModelFitStore.removeChangeListener(this.onModelFitChange);
  }

  onModelFitChange() {
    this.setState(getStateFromStore());
  }

  handleChangeSimulationSpecies(simulationSpecies) {
    var simulationTrack = DataUtils.find(this.state.modelFit.simulationTracks, "species", simulationSpecies);

    ViewActionCreators.changeModelFitTracks(
      simulationTrack,
      this.state.modelFit.dataTrack,
    );
  }

  handleChangeDatasetSpecies(dataSpecies) {
    var s = dataSpecies.split(":");

    var source = s[0].trim();
    var species = s[1].trim();

    var dataTrack = this.state.modelFit.dataTracks.filter(function(d) {
      return d.source === source && d.species === species;
    });

    dataTrack = dataTrack.length === 1 ? dataTrack[0] : null;

    ViewActionCreators.changeModelFitTracks(
      this.state.modelFit.simulationTrack,
      dataTrack
    );
  }

  handleChangeMethod(method) {
    ViewActionCreators.changeModelFitMethod(method);
  }

  handleComputeModelFit() {
    ViewActionCreators.computeModelFit();
  }

  render() {
    return (
      <ModelFit
        modelFit={this.state.modelFit}
        onChangeSimulationSpecies={this.handleChangeSimulationSpecies}
        onChangeDataSpecies={this.handleChangeDatasetSpecies}
        onChangeMethod={this.handleChangeMethod}
        onComputeModel={this.handleComputeModelFit} />
    );
  }
}

module.exports = ModelFitContainer;
