var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var ModelStore = require("../stores/ModelStore");
var PhaseStore = require("../stores/PhaseStore");
var d3 = require("d3");
//var ChordMap = require("../visualizations/ChordMap");
var NetworkMap = require("../visualizations/NetworkMap");
var ViewActionCreators = require("../actions/ViewActionCreators");
var Constants = require("../constants/Constants");

// TODO: Move to css file
var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5
};

//var chordMap = ChordMap();
var networkMap = NetworkMap();

function getStateFromModelStore() {
  return {
    model: ModelStore.getModel()
  };
}

function getStateFromPhaseStore() {
  return {
    phase: PhaseStore.getPhase()
  };
}

var MapVisualizationContainer = React.createClass ({
  getInitialState: function () {
    return {
      model: null,
      phase: PhaseStore.getPhase()
    };
  },
  componentDidMount: function() {
    ModelStore.addChangeListener(this.onModelChange);
    PhaseStore.addChangeListener(this.onPhaseChange);

//    chordMap.on("selectSpecies", this.handleSelectSpecies);
    networkMap
        .on("selectPhase", this.handleSelectPhase)
        .on("selectSpecies", this.handleSelectSpecies);

    this.resize();

    window.addEventListener("resize", function() {
      // TODO: Create a store with window resize. Move event listener to
      // top-level container and create a view action there
      this.onResize();
    }.bind(this));
  },
  componentWillUnmount: function () {
    ModelStore.removeChangeListener(this.onModelChange);
    PhaseStore.removeChangeListener(this.onPhaseChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawMap(state);

    return false;
  },
  onModelChange: function () {
    this.setState(getStateFromModelStore());
  },
  onPhaseChange: function () {
    this.setState(getStateFromPhaseStore());
  },
  onResize: function () {
    this.resize();
  },
  drawMap: function (state) {
    if (!state.model) return;

    networkMap.selectPhase(state.phase);

    d3.select(this.getNode())
        .datum(state.model)
//        .call(chordMap);
        .call(networkMap);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

//    chordMap
//        .width(width)
//        .height(width);
    networkMap
        .width(width)
        .height(width);

    this.drawMap(this.state);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  handleSelectPhase: function(phase) {
    ViewActionCreators.selectPhase(phase);
  },
  handleSelectSpecies: function (species) {
//    chordMap.selectSpecies(species);
    networkMap.selectSpecies(species);
  },
  render: function () {
    return <div className="Map" style={divStyle}></div>
  }
});

module.exports = MapVisualizationContainer;
