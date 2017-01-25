var React = require("react");
var SimulationOutputStore = require("../stores/SimulationOutputStore");
var RunSimulationButton = require("../components/RunSimulationButton");
var ViewActionCreators = require("../actions/ViewActionCreators");
var Constants = require("../constants/Constants");

function getStateFromStore() {
  return {
    simulationOutputState: SimulationOutputStore.getState()
  };
}

var defaultLabel = "Run simulation";

var RunSimulationButtonContainer = React.createClass ({
  getInitialState: function () {
    return {
      label: defaultLabel,
      simulationOutputState: SimulationOutputStore.getState()
    }
  },
  componentDidMount: function () {
    SimulationOutputStore.addChangeListener(this.onSimulationOutputStoreChange);
  },
  componentWillUnmount: function () {
    SimulationOutputStore.removeChangeListener(this.onSimulationOutputStoreChange);
  },
  onSimulationOutputStoreChange: function () {
    this.setState(getStateFromStore());
  },
  handleButtonClick: function () {
    ViewActionCreators.runSimulation();

    // Use timer for label
    var count = 0;
    var timer = setInterval(function() {
      if (this.state.simulationOutputState === Constants.SIMULATION_OUTPUT_VALID) {
        // Valid output, remove interval timer
        clearInterval(timer);

        // Reset label to default
        this.setState({
          label: defaultLabel
        });

        return;
      }

      // Modify label
      count++;

      this.setState({
        label: defaultLabel + ".".repeat(count % 4)
      });
    }.bind(this), 500);
  },
  render: function () {
    var disabled = this.state.simulationOutputState === Constants.SIMULATION_OUTPUT_INVALID;

    return (
      <RunSimulationButton
        label={this.state.label}
        disabled={disabled}
        onClick={this.handleButtonClick} />
    );
  }
});

module.exports = RunSimulationButtonContainer;
