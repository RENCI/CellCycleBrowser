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

class WorkspaceSelectContainer extends React.Component {
  constructor() {
    super();

    this.state = getStateFromStore();;

    // Need to bind this to callback functions here
    this.onWorkspaceChange = this.onWorkspaceChange.bind(this);
  }

  componentDidMount() {
    WorkspaceStore.addChangeListener(this.onWorkspaceChange);
  }

  componentWillUnmount() {
    WorkspaceStore.removeChangeListener(this.onWorkspaceChange);
  }

  onWorkspaceChange() {
    this.setState(getStateFromStore());
  }

  handleChangeWorkspace(value) {
    ViewActionCreators.selectWorkspace(+value);
  }

  render() {
    return (
      <ItemSelect
        label="Workspace: "
        options={this.state.workspaceList.map(workspaceOption)}
        activeValue={this.state.workspaceValue}
        onChange={this.handleChangeWorkspace} />
    );
  }
}

module.exports = WorkspaceSelectContainer;
