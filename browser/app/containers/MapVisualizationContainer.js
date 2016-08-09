var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var ModelStore = require("../stores/ModelStore");
var d3 = require("d3");
var ChordMap = require("../visualizations/ChordMap");

// TODO: Move to css file
var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5
};

var chordMap = ChordMap();

function getStateFromStore() {
  return {
    model: ModelStore.getModel()
  };
}

var MapVisualizationContainer = React.createClass ({
  getInitialState: function () {
    return {
      model: null
    };
  },
  componentDidMount: function() {
    ModelStore.addChangeListener(this.onModelChange);

    chordMap.on("selectSpecies", this.handleSelectSpecies);

    this.drawMap(this.state.model);

    window.addEventListener("resize", function() {
      this.forceUpdate();
    }.bind(this));
  },
  componentWillUnmount: function () {
    ModelStore.removeChangeListener(this.onModelChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawMap(state.model);

    return false;
  },
  onModelChange: function () {
    this.setState(getStateFromStore());
  },
  drawMap: function (model) {
    if (!model) return;

    var node = ReactDOM.findDOMNode(this);
    var size = node.offsetWidth;

    chordMap
        .width(size)
        .height(size);

    d3.select(node)
        .datum(model)
        .call(chordMap);
  },
  getChartState: function () {
    return {
      model: this.props.model
    };
  },
  handleSelectSpecies: function (species) {
    console.log("Container, " + species);
    chordMap.selectSpecies(species);
  },
  render: function () {
    return <div className="Map" style={divStyle}></div>
  }
});

module.exports = MapVisualizationContainer;
