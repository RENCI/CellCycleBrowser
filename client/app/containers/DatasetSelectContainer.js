var React = require("react");
var ReactDOM = require("react-dom");
var DatasetStore = require("../stores/DatasetStore");
var DatasetSelect = require("../components/DatasetSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    datasetList: DatasetStore.getDatasetList(),
    renderAgain: true
  };
}

class DatasetSelectContainer extends React.Component {
  constructor() {
    super();

    this.popover = null;

    this.state = {
      popoverActive: false,
      datasetList: DatasetStore.getDatasetList(),
      renderAgain: false
    };

    // Need to bind this to callback functions here
    this.onDatasetChange = this.onDatasetChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    DatasetStore.addChangeListener(this.onDatasetChange);
  }

  componentWillUnmount() {
    DatasetStore.removeChangeListener(this.onDatasetChange);

    document.removeEventListener("click", this.handleDocumentClick);
  }

  componentDidUpdate() {
    // Do some jQuery to get popovers working
    // We're using React to render the content of the popover, then jQuery clones the DOM for positioning correctly.
    // This works, but breaks the React way of doing things, as jQuery is directly manipulating the DOM.
    // (We're also manipulating the DOM with d3 for SVG elsewhere, but that is a cleaner separation)
    // Another issue is that cloning does not copy callbacks, so we need to set those here, which is a bit ugly.
    // In the future, look into how react-bootstrap and other handle popovers.

    // Get the trigger button and the content, assuming the content is in a hidden div which is a sibling of the trigger
    var trigger = $(ReactDOM.findDOMNode(this)).find("[data-toggle='popover']");
    var content = trigger.next().first();

    if (!this.state.popoverActive) {
      // Remove the popover
      trigger.popover("destroy");
      this.popover = null;
    }
    else {
      if (!this.popover) {
        // Create the popover
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
              if (!t.checked) {
                var numChecked = $(this).closest("ul").find(":checked").length;

                if (numChecked < 1) {
                  t.checked = true;
                  return;
                }
              }

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

      // Enable tooltips
      this.popover.find("[data-toggle='tooltip']").tooltip();

      // This is an ugly hack to get dynamically loaded feature checkboxes to be checked/unchecked correctly
      // by always rendering twice on an update.
      // I think it might be an issue with how React is handling defaultChecked, but not sure.
      if (this.state.renderAgain) {
        this.setState({
          renderAgain: false
        });
      }
    }
  }

  onDatasetChange() {
    this.setState(getStateFromStore);
  }

  handleClick() {
    if (!this.state.popoverActive){
      document.addEventListener("click", this.handleDocumentClick);
    }
    else {
      document.removeEventListener("click", this.handleDocumentClick);
    }

    this.setState({
      popoverActive: !this.state.popoverActive
    });
  }

  handleDocumentClick(e) {
    for (var i = 0; i < e.path.length; i++) {
      if (e.path[i].className === "popover-content") {
        // Should be child of the DatasetSelect, so ignore
        return;
      }
    };

    // Clicked outside of DatasetSelect
    document.removeEventListener("click", this.handleDocumentClick);

    this.setState({
      popoverActive: false
    });
  }

  render() {
    return (
      <div>
        <DatasetSelect
          options={this.state.datasetList}
          onClick={this.handleClick} />
      </div>
    );
  }
}

module.exports = DatasetSelectContainer;
