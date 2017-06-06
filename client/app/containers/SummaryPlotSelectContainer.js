var React = require("react");
var SummaryPlotStore = require("../stores/SummaryPlotStore");
var MultiSelect = require("../components/MultiSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    summaryPlots: SummaryPlotStore.getSummaryPlots(),
  };
}

function option(plot) {
  return {
    value: plot.value,
    name: plot.name,
    active: plot.selected
  };
}

function handleClick(e) {
  console.log(e.currentTarget.dataset.value);
  //props.onChange(e.currentTarget.dataset.value);
}

var SummaryPlotSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    SummaryPlotStore.addChangeListener(this.onSummaryPlotChange);
  },
  componentWillUnmount: function () {
    SummaryPlotStore.removeChangeListener(this.onSummaryPlotChange);
  },
  onSummaryPlotChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeSummaryPlot: function (e) {
    ViewActionCreators.selectSummaryPlot({
      value: e.currentTarget.dataset.value,
      selected: e.currentTarget.checked
    });
  },
  render: function () {
    return (
      <MultiSelect
        label="Summary Plots: "
        options={this.state.summaryPlots.map(option)}
        enabled={option.active}
        onChange={this.handleChangeSummaryPlot} />
    );
  }
});

module.exports = SummaryPlotSelectContainer;
