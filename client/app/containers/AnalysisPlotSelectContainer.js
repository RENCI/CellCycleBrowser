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

class AnalysisPlotSelectContainer extends React.Component {
  constructor() {
    super();

    this.state = getStateFromStore();

    // Need to bind this to callback functions here
    this.onAnalysisPlotChange = this.onAnalysisPlotChange.bind(this);
  }

  componentDidMount() {
    AnalysisPlotStore.addChangeListener(this.onAnalysisPlotChange);
  }

  componentWillUnmount() {
    AnalysisPlotStore.removeChangeListener(this.onAnalysisPlotChange);
  }

  onAnalysisPlotChange() {
    this.setState(getStateFromStore());
  }

  handleChangeAnalysisPlot(e) {
    ViewActionCreators.selectAnalysisPlot({
      name: e.currentTarget.dataset.value,
      selected: e.currentTarget.checked
    });
  }

  render() {
    return (
      <MultiSelect
        label="Analysis Plots: "
        rightAlign={true}
        options={this.state.AnalysisPlots.map(option)}
        enabled={option.active}
        onChange={this.handleChangeAnalysisPlot} />
    );
  }
}

module.exports = AnalysisPlotSelectContainer;
