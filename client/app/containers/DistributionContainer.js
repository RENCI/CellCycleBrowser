var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var DataStore = require("../stores/DataStore");
var d3 = require("d3");
var Distribution = require("../visualizations/Distribution");

var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5
};

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
  };
}

var DistributionContainer = React.createClass ({
  getInitialState: function () {
    return {
      data: DataStore.getData()
    };
  },
  componentDidMount: function() {
    // Create visualiztion function
    this.Distribution = Distribution();

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
        .call(this.Distribution);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    this.Distribution
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

module.exports = DistributionContainer;
