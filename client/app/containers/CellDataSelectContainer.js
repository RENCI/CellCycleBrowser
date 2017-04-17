var React = require("react");
var CellDataStore = require("../stores/CellDataStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    cellDataList: CellDataStore.getCellDataList(),
    cellDataValue: CellDataStore.getCellDataIndex().toString()
  };
}

// Use index for value to ensure unique values
var cellDataOption = function (cellData, i) {
  return {
    value: i.toString(),
    name: cellData.name,
    description: cellData.description
  };
}

var CellDataSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    CellDataStore.addChangeListener(this.onCellDataChange);
  },
  componentWillUnmount: function () {
    CellDataStore.removeChangeListener(this.onCellDataChange);
  },
  onCellDataChange: function () {
    this.setState(getStateFromStore);
  },
  handleChangeCellData: function (value) {
    ViewActionCreators.selectCellData(+value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Cell data: "
        options={this.state.cellDataList.map(cellDataOption)}
        activeValue={this.state.cellDataValue}
        onChange={this.handleChangeCellData} />
    );
  }
});

module.exports = CellDataSelectContainer;
