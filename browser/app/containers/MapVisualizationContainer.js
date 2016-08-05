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

var MapVisualizationContainer = React.createClass ({
  propTypes: {
    model: PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      chordMap: ChordMap()
    };
  },
  componentDidMount: function() {
    d3.select(ReactDOM.findDOMNode(this))
        .datum(this.props.model)
        .call(this.state.chordMap);

    this.state.chordMap.onSpeciesSelect = this.handleSpeciesSelect;
  },
  componentDidUpdate: function() {
    this.state.chordMap.update();
  },
  getChartState: function() {
    return {
      model: this.props.model,
      onSpeciesSelect: this.handleSpeciesSelect
    };
  },
  componentWillUnmount: function() {
//    ChordMap.destroy(ReactDOM.findDOMNode(this));
  },
  handleSpeciesSelect: function (species) {
    console.log(species);
  },
  render: function() {
    return <div className="Map" style={divStyle}></div>
  }
});

module.exports = MapVisualizationContainer;
