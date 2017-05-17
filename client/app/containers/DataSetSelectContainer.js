var React = require("react");
var ReactDOM = require("react-dom");
var DataSetStore = require("../stores/DataSetStore");
var DataSetSelect = require("../components/DataSetSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    dataSetList: DataSetStore.getDataSetList()
  };
}

var DataSetSelectContainer = React.createClass ({
  getInitialState: function () {
    // Class for selecting popover body
    this.popoverBodyClass = "dataSetPopoverBody";

    return getStateFromStore();
  },
  componentDidMount: function () {
    DataSetStore.addChangeListener(this.onDataSetChange);

    // Enable popover
    $(ReactDOM.findDOMNode(this)).find("[data-toggle='popover']").popover({
      content: function () {
        return $($(this).data("popover-content")).html();
      }
    })
    .on("shown.bs.popover", function(e) {
      // Need to set callbacks here, as callbacks are not cloned when creating popover

      // Prevent closing of dropdown
      $("." + this.popoverBodyClass + " ul").on("click", function(e) {
        e.stopPropagation();
      });

      // Checkbox change
      $("." + this.popoverBodyClass + " :checkbox").on("change", function(e) {
        var t = e.currentTarget
            value = t.dataset.value.split(":");

        if (value.length === 1) {
          // Data set
          ViewActionCreators.selectDataSet({
            name: value[0],
            active: t.checked
          });
        }
        else if (value.length === 2) {
          // Feature
          ViewActionCreators.selectFeature({
            dataSet: value[0],
            name: value[1],
            active: t.checked
          });
        }
        else {
          console.log("Can't parse checkbox value: " + t.dataset.value);
        }
      });
    }.bind(this));
  },
  componentWillUnmount: function () {
    DataSetStore.removeChangeListener(this.onDataSetChange);
  },
  onDataSetChange: function () {
    this.setState(getStateFromStore);
  },
  render: function () {
    return (
      <div>
        <DataSetSelect
          options={this.state.dataSetList}
          popoverBodyClass={this.popoverBodyClass} />
      </div>
    );
  }
});

module.exports = DataSetSelectContainer;
