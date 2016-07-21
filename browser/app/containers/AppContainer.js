// The main controller-view for the application. It listens for changes in
// the stores and passes the new data to its children.

var React = require("react");
var HeaderSection = require("../components/HeaderSection");
var MainSection = require("../components/MainSection");
var DataSetStore = require("../stores/DataSetStore");
var DataStore = require("../stores/DataStore");
var WebAPIUtils = require("../utils/WebAPIUtils");

// Retrieve the current state from the stores
function getStateFromStores() {
  return {
    dataSetList: DataSetStore.getDataSetList(),
    dataSet: DataSetStore.getDataSet(),
    data: DataStore.getData()
  };
}

var AppContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStores();
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onDataChange);

    // Get initial data set list from local storage
    WebAPIUtils.getDataSetList();
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onDataChange);
  },
  onDataChange: function () {
    // Data has changed, so set state to force a render
    this.setState(getStateFromStores());
  },
  render: function () {
    var description = this.state.data.description ?
                      this.state.data.description : "";

    return (
      <div>
        <HeaderSection
          header="Cell Cycle Browser"
          dataSetList={this.state.dataSetList}
          description={description} />
        <MainSection
          data={this.state.data} />
      </div>
    );
  }
});

module.exports = AppContainer;
