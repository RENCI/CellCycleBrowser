var React = require("react");
var PropTypes = React.PropTypes;
var ModelFit = require("../components/ModelFit");
var ModelFitStore = require("../stores/ModelFitStore");
var ViewActionCreators = require("../actions/ViewActionCreators");
var DataUtils = require("../utils/DataUtils");

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
    var simulationTrack = DataUtils.find(this.state.modelFit.simulationTracks, "species", simulationSpecies);

    ViewActionCreators.changeModelFitTracks(
      simulationTrack,
      this.state.modelFit.dataTrack,
    );
  },
  handleChangeDatasetSpecies: function (dataSpecies) {
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
  },
  handleComputeModelFit: function () {
    ViewActionCreators.computeModelFit();
  },
  render: function () {
    return (
      <ModelFit
        modelFit={this.state.modelFit}
        onChangeSimulationSpecies={this.handleChangeSimulationSpecies}
        onChangeDataSpecies={this.handleChangeDatasetSpecies}
        onComputeModel={this.handleComputeModelFit} />
    );
  }
});

module.exports = ModelFitContainer;
