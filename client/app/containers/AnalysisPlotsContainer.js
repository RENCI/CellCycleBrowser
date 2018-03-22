var React = require("react");
var AnalysisPlots = require("../components/AnalysisPlots");
var AnalysisPlotStore = require("../stores/AnalysisPlotStore");

function getStateFromStore() {
  return {
    AnalysisPlots: AnalysisPlotStore.getActivePlots()
  };
}

class AnalysisPlotsContainer extends React.Component {
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

  render() {
    return <AnalysisPlots plots={this.state.AnalysisPlots}/>
  }
}

module.exports = AnalysisPlotsContainer;
