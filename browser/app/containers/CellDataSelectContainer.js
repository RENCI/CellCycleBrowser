var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

var cellDataOption = function (cellData, i) {
  return {
    value: i,
    name: cellData.name
  };
}

var divStyle = {
  display: "inline-block",
  marginLeft: 20,
  marginRight: 20
};

var CellDataSelectContainer = React.createClass ({
  propTypes: {
    cellDataList: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeCellData: function (e) {
    ViewActionCreators.selectCellData(e.target.value);
  },
  render: function () {
    return (
      <div style={divStyle}>
        <ItemSelect
          label="Cell data: "
          options={this.props.cellDataList.map(cellDataOption)}
          onChange={this.handleChangeCellData} />
      </div>
    );
  }
});

module.exports = CellDataSelectContainer;
