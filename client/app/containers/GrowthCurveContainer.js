var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var DataStore = require("../stores/DataStore");
var d3 = require("d3");
var GrowthCurve = require("../visualizations/GrowthCurve");

var divStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderRadius: 5
};

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
  };
}

var GrowthCurveContainer = React.createClass ({
  getInitialState: function () {
    return {
      data: DataStore.getData()
    };
  },
  componentDidMount: function() {
    // Create visualiztion function
    this.growthCurve = GrowthCurve();

    DataStore.addChangeListener(this.onDataChange);

    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUnmount: function () {
    DataStore.removeChangeListener(this.onDataChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(state);

    return false;
  },
  onDataChange: function () {
    this.setState(getStateFromDataStore());
  },
  onResize: function () {
    this.resize();
  },
  drawVisualization: function (state) {
    d3.select(this.getNode())
        .datum(state.data)
        .call(this.growthCurve);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    this.growthCurve
        .width(width)
        .height(width);

    this.drawVisualization(this.state);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  render: function () {
    return <div style={divStyle}></div>
  }
});

module.exports = GrowthCurveContainer;
