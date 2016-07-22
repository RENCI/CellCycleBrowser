// Controller-view for the application that stores the current data set

var React = require("react");
var HeaderSection = require("../components/HeaderSection");
var MainSection = require("../components/MainSection");
var DataSetStore = require("../stores/DataSetStore");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    dataSet: DataSetStore.getDataSet()
  };
}

var AppContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    DataSetStore.addChangeListener(this.onDataSetChange);
  },
  componentWillUnmount: function() {
    DataSetStore.removeChangeListener(this.onDataSetChange);
  },
  onDataSetChange: function () {
    this.setState(getStateFromStore());
  },
  render: function () {
    return (
      <div>
        <HeaderSection dataSet={this.state.dataSet}/>
        <MainSection dataSet={this.state.dataSet}/>
      </div>
    );
  }
});

module.exports = AppContainer;
