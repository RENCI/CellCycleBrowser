// The main controller-view for the application. It listens for changes in
// the stores and passes the new data to its children.

var React = require("react");
var HeaderContainer = require("../containers/HeaderContainer");
var MainSection = require("../components/MainSection");
var DataSetStore = require("../stores/DataSetStore");
var WebAPIUtils = require("../utils/WebAPIUtils");

// Retrieve the current state from the stores
function getStateFromStores() {
  return {
    dataSet: DataSetStore.getDataSet()
  };
}

var AppContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStores();
  },
  componentDidMount: function () {
    DataSetStore.addChangeListener(this.onDataChange);

    // Get initial data set list from local storage
    WebAPIUtils.getDataSetList();
  },
  componentWillUnmount: function() {
    DataSetStore.removeChangeListener(this.onDataChange);
  },
  onDataChange: function () {
    // Data has changed, so set state to force a render
    this.setState(getStateFromStores());
  },
  render: function () {
    return (
      <div>
        <HeaderContainer header="Cell Cycle Browser" />
        <MainSection dataSet={this.state.dataSet}/>
      </div>
    );
  }
});

module.exports = AppContainer;
