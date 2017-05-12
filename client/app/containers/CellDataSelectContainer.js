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
    // Class for selecting popover body
    this.popoverBodyClass = "cellDataPopoverBody";

    return getStateFromStore();
  },
  componentDidMount: function () {
    CellDataStore.addChangeListener(this.onCellDataChange);

    // Enable popover
    $(ReactDOM.findDOMNode(this)).find("[data-toggle='popover']").popover({
      container: "body",
      content: function () {
        return $($(this).data("popover-content")).html();
      }
    })
    .on("shown.bs.popover", function(e) {
      // Need to set callbacks here, as callbacks are not cloned when creating popover
      $("." + this.popoverBodyClass + " :checkbox").on("change", function(e) {
        var t = e.currentTarget;
        console.log(t.checked);
        console.log(t.dataset.celldata);
      });
      $("." + this.popoverBodyClass + " li > a").on("click", function(e) {
        var t = e.currentTarget;
        console.log(t.dataset.celldata);
        console.log(t.dataset.feature);
      });
    }.bind(this));
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
          popoverBodyClass={this.popoverBodyClass} />
      </div>
    );
  }
});

module.exports = CellDataSelectContainer;
