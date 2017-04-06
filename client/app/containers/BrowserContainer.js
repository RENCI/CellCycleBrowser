// Controller-view for the browser area

var React = require("react");
var DataStore = require("../stores/DataStore");
var CellDataStore = require("../stores/CellDataStore");
var FeatureStore = require("../stores/FeatureStore");
var AlignmentStore = require("../stores/AlignmentStore");
var TrajectoryStore = require("../stores/TrajectoryStore");
var PhaseStore = require("../stores/PhaseStore");
var PhaseOverlayStore = require("../stores/PhaseOverlayStore");
var BrowserControls = require("../components/BrowserControls");
var Phases = require("../components/Phases");
var Species = require("../components/Species");

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
  }
}

function getStateFromCellDataStore() {
  return {
    cellDataList: CellDataStore.getCellDataList()
  };
};

function getStateFromFeatureStore() {
  return {
    featureList: FeatureStore.getFeatureList(),
    featureKey: FeatureStore.getFeatureKey()
  };
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
      featureList: [],
      featureKey: "",
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
    FeatureStore.addChangeListener(this.onFeatureChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
    TrajectoryStore.addChangeListener(this.onTrajectoryChange);
    PhaseStore.addChangeListener(this.onPhaseChange);
    PhaseOverlayStore.addChangeListener(this.onPhaseOverlayChange);
    tooltips();
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onDataChange);
    CellDataStore.removeChangeListener(this.onCellDataChange);
    FeatureStore.removeChangeListener(this.onFeatureChange);
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
  onFeatureChange: function () {
    this.setState(getStateFromFeatureStore());
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
          species={species}
          phases={this.state.showPhaseOverlay ? this.state.activeTrajectory.phases : []}
          phaseData={this.state.showPhaseOverlay ? this.state.data.phases : [[]]}
          timeExtent={this.state.data.timeExtent}
          activePhase={this.state.activePhase}
          phaseOverlayOpacity={this.state.phaseOverlayOpacity}

          alignment={this.state.alignment} />
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
