var React = require("react");
var AnalysisPlotStore = require("../stores/AnalysisPlotStore");
var MultiSelect = require("../components/MultiSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    AnalysisPlots: AnalysisPlotStore.getAllPlots(),
  };
}

function option(plot) {
  return {
    value: plot.name,
    name: plot.name,
    selected: plot.selected,
    active: plot.available
  };
}

var AnalysisPlotSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    AnalysisPlotStore.addChangeListener(this.onAnalysisPlotChange);
  },
  componentWillUnmount: function () {
    AnalysisPlotStore.removeChangeListener(this.onAnalysisPlotChange);
  },
  onAnalysisPlotChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeAnalysisPlot: function (e) {
    ViewActionCreators.selectAnalysisPlot({
      name: e.currentTarget.dataset.value,
      selected: e.currentTarget.checked
    });
  },
  render: function () {
    return (
      <MultiSelect
        label="Analysis Plots: "
        rightAlign={true}
        options={this.state.AnalysisPlots.map(option)}
        enabled={option.active}
        onChange={this.handleChangeAnalysisPlot} />
    );
  }
});

module.exports = AnalysisPlotSelectContainer;
