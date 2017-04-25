var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var ModelStore = require("../stores/ModelStore");
var d3 = require("d3");
var Distribution = require("../visualizations/Distribution");

var divStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderRadius: 5
};

function getStateFromModelStore() {
  return {
    model: ModelStore.getModel()
  };
}

var DistributionContainer = React.createClass ({
  getInitialState: function () {
    return {
      model: ModelStore.getModel()
    };
  },
  componentDidMount: function() {
    // Create visualiztion function
    this.distribution = Distribution();

    ModelStore.addChangeListener(this.onModelChange);

    this.resize();

    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUnmount: function () {
    ModelStore.removeChangeListener(this.onModelChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(state);

    return false;
  },
  onModelChange: function () {
    this.setState(getStateFromModelStore());
  },
  onResize: function () {
    this.resize();
  },
  drawVisualization: function (state) {
    if (!state.model.reactions) return;

    d3.select(this.getNode())
        .datum(state.model.reactions)
        .call(this.distribution);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    this.distribution
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
