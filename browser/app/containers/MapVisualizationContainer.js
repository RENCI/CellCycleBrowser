var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
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

var MapVisualizationContainer = React.createClass ({
  propTypes: {
    model: PropTypes.object.isRequired
  },
  componentDidMount: function() {
    chordMap.on("selectSpecies", this.handleSelectSpecies);

    this.drawMap(this.props.model);

    window.addEventListener("resize", function() {
      this.forceUpdate();
    }.bind(this));
  },
  componentWillUpdate: function (props) {
    this.drawMap(props.model);

    return false;
  },
  drawMap: function (model) {
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
