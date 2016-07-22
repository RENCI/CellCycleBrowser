var React = require("react");
var DataSetListStore = require("../stores/DataSetListStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");
var WebAPIUtils = require("../utils/WebAPIUtils");

function getStateFromStore() {
  return {
    dataSetList: DataSetListStore.getDataSetList()
  };
}

var DataSetSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    DataSetListStore.addChangeListener(this.onDataSetListChange);

    // Get initial data set list from local storage
    WebAPIUtils.getDataSetList();
  },
  componentWillUnmount: function() {
    DataSetListStore.removeChangeListener(this.onDataSetListChange);
  },
  onDataSetListChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeDataSet: function (e) {
    ViewActionCreators.selectDataSet(e.target.value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Data set: "
        options={this.state.dataSetList}
        onChange={this.handleChangeDataSet} />
    );
  }
});

module.exports = DataSetSelectContainer;
