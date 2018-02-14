var React = require("react");
var PropTypes = React.PropTypes;
var ModelFit = require("../components/ModelFit");
var ModelFitStore = require("../stores/ModelFitStore");
var ViewActionCreators = require("../actions/ViewActionCreators");

function getStateFromStore() {
  return {
    modelFit: ModelFitStore.getModelFit()
  };
}

var ModelFitContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    ModelFitStore.addChangeListener(this.onModelFitChange);
  },
  componentWillUnmount: function() {
    ModelFitStore.removeChangeListener(this.onModelFitChange);
  },
  onModelFitChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeSimulationSpecies: function (simulationSpecies) {
    ViewActionCreators.changeModelFitSpecies(
      simulationSpecies,
      this.state.modelFit.datasetSpecies,
    );
  },
  handleChangeDatasetSpecies: function (datasetSpecies) {
    ViewActionCreators.changeModelFitSpecies(
      datasetSpecies,
      this.state.modelFit.simulationSpecies,
    );
  },
  handleComputeModelFit: function () {
    ViewActionCreators.computeModelFit();
  },
  render: function () {
    return (
      <ModelFit
        modelFit={this.state.modelFit}
        onChangeSimulationSpecies={this.handleChangeSimulationSpecies}
        onChangeDatasetSpecies={this.handleChangeDatasetSpecies}
        onComputeModel={this.handleComputeModelFit} />
    );
  }
});

module.exports = ModelFitContainer;
