// Controller-view for the application that stores the current dataset

var React = require("react");
var ResizeContainer = require("../containers/ResizeContainer");
var HeaderSection = require("../components/HeaderSection");
var DataSelectionSection = require("../components/DataSelectionSection");
var MainSection = require("../components/MainSection");
var WorkspaceStore = require("../stores/WorkspaceStore");
var WebAPIUtils = require("../utils/WebAPIUtils");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    workspace: WorkspaceStore.getWorkspace()
  };
}

var AppContainer = React.createClass({
  getInitialState: function () {
    return {
      workspace: null
    };
  },
  componentDidMount: function () {
    WorkspaceStore.addChangeListener(this.onWorkspaceChange);

    // Bootstrap the application by getting initial data here
    WebAPIUtils.getWorkspaceList();
    WebAPIUtils.getDatasetList();
  },
  componentWillUnmount: function () {
    WorkspaceStore.removeChangeListener(this.onWorkspaceChange);
  },
  onWorkspaceChange: function () {
    this.setState(getStateFromStore());
  },
  render: function () {
    var hasWorkspace = this.state.workspace && this.state.workspace.name;

    return (
      <div>
        <ResizeContainer />
        <HeaderSection />
        {hasWorkspace ?
          <DataSelectionSection workspace={this.state.workspace} /> : null }
        {hasWorkspace ?
          <MainSection workspace={this.state.workspace} /> : null}
      </div>
    );
  }
});

module.exports = AppContainer;
