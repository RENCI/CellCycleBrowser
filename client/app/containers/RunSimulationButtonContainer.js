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
    // Create timer for label
    var count = 0;
    (function timer() {
      if (count > 0 &&
          this.state.simulationOutputState === Constants.SIMULATION_OUTPUT_VALID) {
        // Reset label to default
        this.setState({
          label: defaultLabel
        });

        return;
      }

      // Modify label
      this.setState({
        label: defaultLabel + ".".repeat(count % 4)
      });

      count++;

      setTimeout(timer.bind(this), 500);
    }.bind(this))();

    ViewActionCreators.runSimulation();
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