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
    this.popover = null;

    return {
      popoverActive: false,
      datasetList: DatasetStore.getDatasetList()
    };
  },
  componentDidMount: function () {
    DatasetStore.addChangeListener(this.onDatasetChange);
  },
  componentWillUnmount: function () {
    DatasetStore.removeChangeListener(this.onDatasetChange);
  },
  componentDidUpdate: function () {
    var trigger = $(ReactDOM.findDOMNode(this)).find("[data-toggle='popover']");
    var content = trigger.next().first();

    if (!this.state.popoverActive) {
      trigger.popover("destroy");
      this.popover = null;
    }
    else {
      if (!this.popover) {
        // Show popover
        trigger.popover({
           content: content.html()
        });

        trigger.popover("show");

        // Assuming the popover is appended to the end of the body
        this.popover = $(".popover-content").last();
      }

      // Update the html
      this.popover.html(content.html());

      // Prevent closing of dropdown
      this.popover.find("ul").on("click", function(e) {
        e.stopPropagation();
      });

      // Checkbox change
      this.popover.find(":checkbox")
          .on("change", function(e) {
            var t = e.currentTarget;
            var value = t.dataset.value.split(":");

            if (value.length === 1) {
              // Dataset
              ViewActionCreators.selectDataset({
                id: value[0],
                active: t.checked
              });
            }
            else if (value.length === 2) {
              // Feature
              ViewActionCreators.selectFeature({
                name: value[0],
                datasetId: value[1],
                active: t.checked
              });
            }
            else {
              console.log("Can't parse checkbox value: " + t.dataset.value);
            }
          });
    }
  },
  onDatasetChange: function () {
    this.setState(getStateFromStore);
  },
  handleClick: function () {
    //this.popoverActive = !this.popoverActive;
    this.setState({
      popoverActive: !this.state.popoverActive
    });
  },
  render: function () {
    return (
      <div>
        <DatasetSelect
          options={this.state.datasetList}
          onClick={this.handleClick} />
      </div>
    );
  }
});

module.exports = DatasetSelectContainer;
