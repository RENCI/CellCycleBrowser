var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var ModelStore = require("../stores/ModelStore");
var d3 = require("d3");
//var ChordMap = require("../visualizations/ChordMap");
var NetworkMap = require("../visualizations/NetworkMap")

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

    var size = this.getSize();

//    chordMap
//        .width(size.width)
//        .height(size.width)
//        .on("selectSpecies", this.handleSelectSpecies);
    networkMap
        .width(size.width)
        .height(size.width)
        .on("selectSpecies", this.handleSelectSpecies);

    this.drawMap(this.state.model);

    window.addEventListener("resize", function() {
      // TODO: Create a store with window resize. Move event listener to
      // top-level container and create a view action there
      this.onResize();
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
  onResize: function () {
    var size = this.getSize();

//    chordMap
//        .width(size.width)
//        .height(size.width);
    networkMap
        .width(size.width)
        .height(size.height);

    this.drawMap(this.state.model);
  },
  drawMap: function (model) {
    if (!model) return;

    d3.select(this.getNode())
        .datum(model)
//        .call(chordMap);
        .call(networkMap);

  },
  getChartState: function () {
    return {
      model: this.props.model
    };
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  getSize: function () {
    var node = this.getNode();

    return {
      width: node.offsetWidth,
      height: node.offsetHeight
    }
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
