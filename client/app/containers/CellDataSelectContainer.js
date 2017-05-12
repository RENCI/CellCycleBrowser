var React = require("react");
var ReactDOM = require("react-dom");
var CellDataStore = require("../stores/CellDataStore");
var CellDataSelect = require("../components/CellDataSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    cellDataList: CellDataStore.getCellDataList()
/*    ,
    cellDataFileName: CellDataStore.getCellDataFileName(),
    cellDataValue: CellDataStore.getCellDataIndex().toString()
*/
  };
}

// Use index for value to ensure unique values
var cellDataOption = function (cellData, i) {
  return {
    value: i.toString(),
    data: cellData
  };
}

var CellDataSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    CellDataStore.addChangeListener(this.onCellDataChange);

    $(ReactDOM.findDOMNode(this)).find("[data-toggle='popover']").popover({
      container: "body",
      content: function () {
        return $($(this).data("popover-content")).html();
      }
    })
    .on("shown.bs.popover", function(e) {
      $(".cellDataPopoverContent :checkbox").on("change", function(e) {
        console.log("yay1!");
      });
      $(".cellDataPopoverContent li").on("click", function(e) {
        console.log("yay2!");
      });
    });
  },
  componentWillUnmount: function () {
    CellDataStore.removeChangeListener(this.onCellDataChange);
  },
  onCellDataChange: function () {
    this.setState(getStateFromStore);
  },
  handleSelectCellData: function (value) {
    ViewActionCreators.selectCellData(+value);
  },
  handleSelectFeature: function (value) {
//    ViewActionCreators.selectFeature(+value);
  },
  render: function () {
    return (
      <div>
        <CellDataSelect
          options={this.state.cellDataList.map(cellDataOption)}
          onSelectCellData={this.handleSelectCellData}
          onSelectFeature={this.handleSelectFeature} />
      </div>
    );
  }
});

module.exports = CellDataSelectContainer;
