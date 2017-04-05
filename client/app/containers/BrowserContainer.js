// Controller-view for the browser area

var React = require("react");
var CellDataStore = require("../stores/CellDataStore");
var ModelStore = require("../stores/ModelStore");
var FeatureStore = require("../stores/FeatureStore");
var SimulationOutputStore = require("../stores/SimulationOutputStore");
var AlignmentStore = require("../stores/AlignmentStore");
var TrajectoryStore = require("../stores/TrajectoryStore");
var PhaseStore = require("../stores/PhaseStore");
var PhaseOverlayStore = require("../stores/PhaseOverlayStore");
var BrowserControls = require("../components/BrowserControls");
var Phases = require("../components/Phases");
var Species = require("../components/Species");

var DataStore = require("../stores/DataStore");

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
  }
}

function getStateFromCellDataStore() {
  return {
    cellDataList: CellDataStore.getCellDataList(),
    cellData: CellDataStore.getCellData(),
  };
};

function getStateFromModelStore() {
  return {
    model: ModelStore.getModel()
  };
}

function getStateFromFeatureStore() {
  return {
    featureList: FeatureStore.getFeatureList(),
    featureKey: FeatureStore.getFeatureKey()
  };
}

function getStateFromSimulationOutputStore() {
  return {
    simulationOutput: SimulationOutputStore.getSimulationOutput()
  }
}

function getStateFromAlignmentStore() {
  return {
    alignment: AlignmentStore.getAlignment()
  }
}

function getStateFromTrajectoryStore() {
  return {
    activeTrajectory: TrajectoryStore.getTrajectory()
  }
}

function getStateFromPhaseStore() {
  return {
    activePhase: PhaseStore.getPhase()
  }
}

function getStateFromPhaseOverlayStore() {
  return {
    showPhaseOverlay: PhaseOverlayStore.getShow(),
    phaseOverlayOpacity: PhaseOverlayStore.getOpacity()
  }
}

// Enable bootstrap tooltips
// XXX: This will search the entire page, should perhaps use selector within
// this element
function tooltips() {
  $(".cell").tooltip({
    container: "body",
    placement: "auto top",
    animation: false
  });
}

var BrowserContainer = React.createClass({
  getInitialState: function () {
    return {
      data: getStateFromDataStore().data,
      cellDataList: [],
      cellData: null,
      model: null,
      featureList: [],
      featureKey: "",
      simulationOutput: getStateFromSimulationOutputStore().simulationOutput,
      alignment: getStateFromAlignmentStore().alignment,
      activeTrajectory: getStateFromTrajectoryStore().activeTrajectory,
      activePhase: getStateFromPhaseStore().activePhase,
      showPhaseOverlay: getStateFromPhaseOverlayStore().showPhaseOverlay,
      phaseOverlayOpacity: getStateFromPhaseOverlayStore().phaseOverlayOpacity
    };
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onDataChange);
    CellDataStore.addChangeListener(this.onCellDataChange);
    ModelStore.addChangeListener(this.onModelChange);
    FeatureStore.addChangeListener(this.onFeatureChange);
    SimulationOutputStore.addChangeListener(this.onSimulationOutputChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
    TrajectoryStore.addChangeListener(this.onTrajectoryChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
    PhaseOverlayStore.addChangeListener(this.onPhaseOverlayChange);
    tooltips();
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onDataChange);
    CellDataStore.removeChangeListener(this.onCellDataChange);
    ModelStore.removeChangeListener(this.onModelChange);
    FeatureStore.removeChangeListener(this.onFeatureChange);
    SimulationOutputStore.removeChangeListener(this.onSimulationOutputChange);
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
    TrajectoryStore.removeChangeListener(this.onTrajectoryChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
    PhaseOverlayStore.removeChangeListener(this.onPhaseOverlayChange);
  },
  componentDidUpdate: function () {
    tooltips();
  },
  onDataChange: function () {
    this.setState(getStateFromDataStore());
  },
  onCellDataChange: function () {
    this.setState(getStateFromCellDataStore());
  },
  onModelChange: function () {
    this.setState(getStateFromModelStore());
  },
  onFeatureChange: function () {
    this.setState(getStateFromFeatureStore());
  },
  onSimulationOutputChange: function () {
    this.setState(getStateFromSimulationOutputStore());
  },
  onAlignmentChange: function () {
    this.setState(getStateFromAlignmentStore());
  },
  onTrajectoryChange: function () {
    this.setState(getStateFromTrajectoryStore());
  },
  onPhaseChange: function () {
    this.setState(getStateFromPhaseStore());
  },
  onPhaseOverlayChange: function () {
    this.setState(getStateFromPhaseOverlayStore());
  },
  render: function() {
    var species = this.state.data.species;

    if (species.length < 1) return null;

    // Create GUI components for each species
    var speciesComponents = species.map(function(species, i) {
      return (
        <Species
          key={i}
          name={species.name}
          cells={species.cellData}
          featureKey={this.state.featureKey}
          simulationData={species.simulationOutput}
          phases={this.state.showPhaseOverlay ? this.state.activeTrajectory.phases : []}
          phaseData={this.state.showPhaseOverlay ? this.state.data.phases : [[]]}
          timeExtent={this.state.data.timeExtent}
          alignment={this.state.alignment}
          activePhase={this.state.activePhase}
          phaseOverlayOpacity={this.state.phaseOverlayOpacity} />
      );
    }.bind(this));

    return (
      <div>
        <h2>Browser</h2>
        <BrowserControls
          cellDataList={this.state.cellDataList}
          featureList={this.state.featureList}
          timeExtent={this.state.data.timeExtent} />
        <Phases
          phaseData={this.state.data.phases}
          timeExtent={this.state.data.timeExtent}
          alignment={this.state.alignment}
          activeTrajectory={this.state.activeTrajectory}
          activePhase={this.state.activePhase} />
        {speciesComponents}
      </div>
    );
  }
});

module.exports = BrowserContainer;
