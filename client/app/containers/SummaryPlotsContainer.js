var React = require("react");
var SummaryPlots = require("../components/SummaryPlots");
var SummaryPlotStore = require("../stores/SummaryPlotStore");

function getStateFromStore() {
  return {
    summaryPlots: SummaryPlotStore.getActivePlots()
  };
}

var SummaryPlotsContainer = React.createClass({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    SummaryPlotStore.addChangeListener(this.onSummaryPlotChange);
  },
  componentWillUnmount: function() {
    SummaryPlotStore.removeChangeListener(this.onSummaryPlotChange);
  },
  onSummaryPlotChange: function () {
    this.setState(getStateFromStore());
  },
  render: function() {
    return <SummaryPlots summaryPlots={this.state.summaryPlots}/>
  }
});

module.exports = SummaryPlotsContainer;
