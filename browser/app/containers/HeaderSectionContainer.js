// Controller-view for the header area

var React = require("react");
var PropTypes = React.PropTypes;
var DataSetListStore = require("../stores/DataSetListStore");
var DataSetStore = require("../stores/DataSetStore")
var HeaderSection = require("../components/HeaderSection");

function getStateFromStores () {
  return {
    dataSetList: DataSetListStore.getDataSetList(),
    dataSet: DataSetStore.getDataSet()
  };
}

var HeaderSectionContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStores();
  },
  componentDidMount: function () {
    DataSetListStore.addChangeListener(this.onDataSetListChange);
    DataSetStore.addChangeListener(this.onDataSetChange);
  },
  componentWillUnmount: function() {
    DataSetListStore.removeChangeListener(this.onDataSetListChange);
    DataSetStore.addChangeListener(this.onDataSetChange);
  },
  onDataSetListChange: function () {
    this.setState(getStateFromStores());
  },
  onDataSetChange: function () {
    this.setState(getStateFromStores());
  },
  render: function () {
    return (
      <HeaderSection
        dataSetList={this.state.dataSetList}
        description={this.state.dataSet.description} />
    );
  }
});

module.exports = HeaderSectionContainer;
