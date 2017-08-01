// Controller-view for the application that stores the current dataset

var React = require("react");
var ResizeContainer = require("../containers/ResizeContainer");
var HeaderSection = require("../components/HeaderSection");
var DataSelectionSection = require("../components/DataSelectionSection");
var MainSection = require("../components/MainSection");
var WorkspaceStore = require("../stores/WorkspaceStore");
var ModelStore = require("../stores/ModelStore");
var DataStore = require("../stores/DataStore");
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

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
  };
}

var AppContainer = React.createClass({
  getInitialState: function () {
    return {
      workspace: WorkspaceStore.getWorkspace(),
      model: ModelStore.getModel(),
      data: DataStore.getData()
    };
  },
  componentDidMount: function () {
    WorkspaceStore.addChangeListener(this.onWorkspaceChange);
    ModelStore.addChangeListener(this.onModelChange);
    DataStore.addChangeListener(this.onDataChange);

    // Bootstrap the application by getting initial data here
    WebAPIUtils.getWorkspaceList();
    WebAPIUtils.getModelList();
    WebAPIUtils.getDatasetList();

    this.enableTooltips();
  },
  componentDidUpdate: function () {
    this.enableTooltips();
  },
  componentWillUnmount: function () {
    WorkspaceStore.removeChangeListener(this.onWorkspaceChange);
    ModelStore.removeChangeListener(this.onModelChange);
    DataStore.removeChangeListener(this.onDataChange);
  },
  onWorkspaceChange: function () {
    this.setState(getStateFromWorkspaceStore());
  },
  onModelChange: function () {
    this.setState(getStateFromModelStore());
  },
  onDataChange: function () {
    this.setState(getStateFromDataStore());
  },
  enableTooltips: function () {
    $("[data-toggle='tooltip']").tooltip();
  },
  render: function () {
    var hasWorkspace = this.state.workspace.name !== undefined;
    var hasModel = this.state.model.name !== undefined;
    var hasTracks = this.state.data.tracks.length > 0;

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
            hasTracks={hasTracks} />
          : null}
      </div>
    );
  }
});

module.exports = AppContainer;
