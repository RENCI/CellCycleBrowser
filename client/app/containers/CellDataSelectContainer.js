var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelectContainer = require("./ItemSelectContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

var cellDataOption = function (cellData, i) {
  return {
    value: i.toString(),
    name: cellData.name
  };
}

var CellDataSelectContainer = React.createClass ({
  propTypes: {
    cellDataList: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeCellData: function (value) {
    ViewActionCreators.selectCellData(value);
  },
  render: function () {
    return (
        <ItemSelectContainer
          label="Cell data: "
          options={this.props.cellDataList.map(cellDataOption)}
          onChange={this.handleChangeCellData} />
    );
  }
});

module.exports = CellDataSelectContainer;