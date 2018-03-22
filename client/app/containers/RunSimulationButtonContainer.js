var React = require("react");
var PropTypes = require("prop-types");
var SimulationOutputStore = require("../stores/SimulationOutputStore");
var RunSimulationButton = require("../components/RunSimulationButton");
var SimulationError = require("../components/SimulationError");
var SimulationProgress = require("../components/SimulationProgress");
var ViewActionCreators = require("../actions/ViewActionCreators");
var Constants = require("../constants/Constants");

function getStateFromStore() {
  return {
    outputState: SimulationOutputStore.getState(),
    error: SimulationOutputStore.getError(),
    progress: SimulationOutputStore.getProgress(),
  };
}

var defaultLabel = "Run simulation";

class RunSimulationButtonContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      label: defaultLabel,
      outputState: SimulationOutputStore.getState(),
      error: SimulationOutputStore.getError(),
      progress: SimulationOutputStore.getProgress()
    };

    // Need to bind this to callback functions here
    this.onSimulationOutputStoreChange = this.onSimulationOutputStoreChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    SimulationOutputStore.addChangeListener(this.onSimulationOutputStoreChange);
  }

  componentWillUnmount() {
    SimulationOutputStore.removeChangeListener(this.onSimulationOutputStoreChange);
  }

  onSimulationOutputStoreChange() {
    this.setState(getStateFromStore());
  }

  handleButtonClick() {
    // Create timer for label
    var count = 0;
    (function timer() {
      if (count > 0 &&
          this.state.outputState === Constants.SIMULATION_OUTPUT_VALID) {
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
  }

  handleCancel() {
    ViewActionCreators.cancelSimulation();
  }

  render() {
    var disabled = this.state.outputState === Constants.SIMULATION_OUTPUT_INVALID;

    return (
      <div>
        <RunSimulationButton
          label={this.state.label}
          disabled={disabled}
          onClick={this.handleButtonClick}
          onCancel={this.handleCancel} />
        {this.state.error === null ? null :
          <SimulationError
            error={this.state.error} />}
        {this.state.progress === null || !disabled ? null :
          <SimulationProgress
            subphases={this.props.subphases}
            numTrajectories={this.props.numTrajectories}
            progress={this.state.progress}
            phaseColorScale={this.props.phaseColorScale} />}
      </div>
    );
  }
}

RunSimulationButtonContainer.propTypes = {
  subphases: PropTypes.arrayOf(PropTypes.object).isRequired,
  numTrajectories: PropTypes.number.isRequired,
  phaseColorScale: PropTypes.func.isRequired
};

module.exports = RunSimulationButtonContainer;
