// Controller-view for the header area

var React = require("react");
var PropTypes = React.PropTypes;
var DataSetListStore = require("../stores/DataSetListStore");
var DataSetStore = require("../stores/DataSetStore")
var HeaderSection = require("../components/HeaderSection");

function getStateFromStore () {
  return {
    dataSet: DataSetStore.getDataSet()
  };
}

var HeaderSectionContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    DataSetStore.addChangeListener(this.onDataSetChange);
  },
  componentWillUnmount: function() {
    DataSetStore.addChangeListener(this.onDataSetChange);
  },
  onDataSetChange: function () {
    this.setState(getStateFromStores());
  },
  render: function () {
    return (
      <HeaderSection dataSet={this.state.dataSet} />
    );
  }
});

module.exports = HeaderSectionContainer;
