// Controller-view for the application that stores the current dataset

var React = require("react");
var ResizeContainer = require("../containers/ResizeContainer");
var HeaderSection = require("../components/HeaderSection");
var DataSelectionSection = require("../components/DataSelectionSection");
var MainSection = require("../components/MainSection");
var WorkspaceStore = require("../stores/WorkspaceStore");
var ModelStore = require("../stores/ModelStore");
var DatasetStore = require("../stores/DatasetStore");
var WebAPIUtils = require("../utils/WebAPIUtils");

// Retrieve the current state from stores
function getStateFromWorkspaceStore() {
  return {
    workspace: WorkspaceStore.getWorkspace()
  };
}

function getStateFromModelStore() {
  return {
    model: ModelStore.getModel()
  };
}

function getStateFromDatasetStore() {
  return {
    datasets: DatasetStore.getDatasets()
  };
}

var AppContainer = React.createClass({
  getInitialState: function () {
    return {
      workspace: WorkspaceStore.getWorkspace(),
      model: ModelStore.getModel(),
      datasets: DatasetStore.getDatasets()
    };
  },
  componentDidMount: function () {
    WorkspaceStore.addChangeListener(this.onWorkspaceChange);
    ModelStore.addChangeListener(this.onModelChange);
    DatasetStore.addChangeListener(this.onDatasetChange);

    // Bootstrap the application by getting initial data here
    WebAPIUtils.getWorkspaceList();
    WebAPIUtils.getModelList();
    WebAPIUtils.getDatasetList();
  },
  componentWillUnmount: function () {
    WorkspaceStore.removeChangeListener(this.onWorkspaceChange);
    ModelStore.removeChangeListener(this.onModelChange);
    DatasetStore.removeChangeListener(this.onDatasetChange);
  },
  onWorkspaceChange: function () {
    this.setState(getStateFromWorkspaceStore());
  },
  onModelChange: function () {
    this.setState(getStateFromModelStore());
  },
  onDatasetChange: function () {
    this.setState(getStateFromDatasetStore());
  },
  render: function () {
    var hasWorkspace = this.state.workspace.name !== undefined;
    var hasModel = this.state.model.name !== undefined;
    var hasDatasets = this.state.datasets.length > 0;

    return (
      <div>
        <ResizeContainer />
        <HeaderSection />
        {hasWorkspace ?
          <DataSelectionSection
            workspace={this.state.workspace} />
          : null }
        {hasWorkspace ?
          <MainSection
            workspace={this.state.workspace}
            hasModel={hasModel}
            hasDatasets={hasDatasets} />
          : null}
      </div>
    );
  }
});

module.exports = AppContainer;
