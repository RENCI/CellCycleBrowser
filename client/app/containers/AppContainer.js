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

class AppContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      workspace: WorkspaceStore.getWorkspace(),
      model: ModelStore.getModel(),
      data: DataStore.getData()
    };

    // Need to bind this to callback functions here
    this.onWorkspaceChange = this.onWorkspaceChange.bind(this);
    this.onModelChange = this.onModelChange.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    WorkspaceStore.addChangeListener(this.onWorkspaceChange);
    ModelStore.addChangeListener(this.onModelChange);
    DataStore.addChangeListener(this.onDataChange);

    // Bootstrap the application by getting initial data here
    WebAPIUtils.getWorkspaceList();
    WebAPIUtils.getModelList();
    WebAPIUtils.getDatasetList();
    WebAPIUtils.getNuclei();

    this.enableTooltips();
  }

  componentDidUpdate() {
    this.enableTooltips();
  }

  componentWillUnmount() {
    WorkspaceStore.removeChangeListener(this.onWorkspaceChange);
    ModelStore.removeChangeListener(this.onModelChange);
    DataStore.removeChangeListener(this.onDataChange);
  }

  onWorkspaceChange() {
    this.setState(getStateFromWorkspaceStore());
  }

  onModelChange() {
    this.setState(getStateFromModelStore());
  }

  onDataChange() {
    this.setState(getStateFromDataStore());
  }

  onResize() {
    this.forceUpdate();
  }

  enableTooltips() {
    $("[data-toggle='tooltip']").tooltip("hide");
    $("[data-toggle='tooltip']").tooltip();
  }

  render() {
    var hasWorkspace = this.state.workspace.name !== undefined;
    var hasModel = this.state.model.name !== undefined;
    var hasTracks = this.state.data.tracks.length > 0;

    return (
      <div className="container-fluid">
        <ResizeContainer
          onResize={this.onResize} />
        <HeaderSection />
        {hasWorkspace ?
          <DataSelectionSection
            workspace={this.state.workspace}
            model={this.state.model} />
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
}

module.exports = AppContainer;
