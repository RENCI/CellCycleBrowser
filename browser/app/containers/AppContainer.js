// The main controller-view for the application. It listens for changes in
// the stores and passes the new data to its children.

var React = require("react");
var HeaderSection = require("../components/HeaderSection");
var MainSection = require("../components/MainSection");
var CellLineStore = require("../stores/CellLineStore");
var DataStore = require("../stores/DataStore");
var WebAPIUtils = require("../utils/WebAPIUtils");

// Retrieve the current state from the stores
function getStateFromStores() {
  return {
    cellLine: CellLineStore.getCellLine(),
    data: DataStore.getData()
  };
}

var AppContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStores();
  },
  componentDidMount: function () {
    CellLineStore.addChangeListener(this.onCellLineChange);
    DataStore.addChangeListener(this.onDataChange);
  },
  componentWillUnmount: function() {
    CellLineStore.addChangeListener(this.onCellLineChange);
    DataStore.removeChangeListener(this.onDataChange);
  },
  onCellLineChange: function () {
    // Cell line has changed, so fetch new data
    WebAPIUtils.getData(CellLineStore.getCellLine());
  },
  onDataChange: function () {
    // Data has changed, so set state to force a render
    this.setState(getStateFromStores());
  },
  render: function () {
    return (
      <div>
        <HeaderSection
          header="Cell Cycle Browser" />
        <MainSection
          data={this.state.data} />
      </div>
    );
  }
});

module.exports = AppContainer;
