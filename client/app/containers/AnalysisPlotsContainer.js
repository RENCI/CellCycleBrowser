var React = require("react");
var AnalysisPlots = require("../components/AnalysisPlots");
var AnalysisPlotStore = require("../stores/AnalysisPlotStore");

function getStateFromStore() {
  return {
    AnalysisPlots: AnalysisPlotStore.getActivePlots()
  };
}

var AnalysisPlotsContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    AnalysisPlotStore.addChangeListener(this.onAnalysisPlotChange);
  },
  componentWillUnmount: function() {
    AnalysisPlotStore.removeChangeListener(this.onAnalysisPlotChange);
  },
  onAnalysisPlotChange: function () {
    this.setState(getStateFromStore());
  },
  render: function() {
    return <AnalysisPlots AnalysisPlots={this.state.AnalysisPlots}/>
  }
});

module.exports = AnalysisPlotsContainer;
