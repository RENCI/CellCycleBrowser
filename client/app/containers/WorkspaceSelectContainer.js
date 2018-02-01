var React = require("react");
var WorkspaceStore = require("../stores/WorkspaceStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    workspaceList: WorkspaceStore.getWorkspaceList(),
    workspaceValue: WorkspaceStore.getWorkspaceIndex().toString()
  };
}

// Use index for value to ensure unique values
function workspaceOption(workspace, i) {
  return {
    value: i.toString(),
    name: workspace.name,
    description: workspace.description
  };
}

var WorkspaceSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    WorkspaceStore.addChangeListener(this.onWorkspaceChange);
  },
  componentWillUnmount: function() {
    WorkspaceStore.removeChangeListener(this.onWorkspaceChange);
  },
  onWorkspaceChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeWorkspace: function (value) {
    ViewActionCreators.selectWorkspace(+value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Workspace: "
        options={this.state.workspaceList.map(workspaceOption)}
        activeValue={this.state.workspaceValue}
        onChange={this.handleChangeWorkspace} />
    );
  }
});

module.exports = WorkspaceSelectContainer;
