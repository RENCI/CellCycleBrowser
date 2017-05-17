var React = require("react");
var ReactDOM = require("react-dom");
var DatasetStore = require("../stores/DatasetStore");
var DatasetSelect = require("../components/DatasetSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    datasetList: DatasetStore.getDatasetList()
  };
}

var DatasetSelectContainer = React.createClass ({
  getInitialState: function () {
    // Class for selecting popover body
    this.popoverBodyClass = "datasetPopoverBody";

    return getStateFromStore();
  },
  componentDidMount: function () {
    DatasetStore.addChangeListener(this.onDatasetChange);

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
        var t = e.currentTarget;
        var value = t.dataset.value.split(":");

        if (value.length === 1) {
          // Dataset
          ViewActionCreators.selectDataset({
            name: value[0],
            active: t.checked
          });
        }
        else if (value.length === 2) {
          // Feature
          ViewActionCreators.selectFeature({
            dataset: value[0],
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
    DatasetStore.removeChangeListener(this.onDatasetChange);
  },
  onDatasetChange: function () {
    this.setState(getStateFromStore);
  },
  render: function () {
    return (
      <div>
        <DatasetSelect
          options={this.state.datasetList}
          popoverBodyClass={this.popoverBodyClass} />
      </div>
    );
  }
});

module.exports = DatasetSelectContainer;
