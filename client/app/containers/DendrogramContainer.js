var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var Dendrogram = require("../visualizations/Dendrogram");
var d3 = require("d3");

var DendrogramContainer = React.createClass ({
  // Don't make propsTypes required, as a warning is given for the first render
  // if using React.cloneElement, as  in VisualizationContainer
  propTypes: {
    cluster: PropTypes.func,
    height: PropTypes.number
  },
  getInitialState: function () {
    // Create visualization function
    this.dendrogram = Dendrogram();

    return null;
  },
  componentDidMount: function () {
    this.resize();
  },
  componentWillUnmount: function () {
    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  },
  componentWillUnmount: function () {
    window.removeEventListener("resize", this.onResize);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props, state);

    return false;
  },
  onResize: function () {
    console.log("RESIZE");
    this.resize();
  },
  drawVisualization: function (props, state) {
    // Set up dendrogram
    this.dendrogram
        .height(props.height)
        .cluster(props.cluster);

    // Draw dendrogram
    d3.select(this.getNode())
        .call(this.dendrogram);
  },
  resize: function () {
    var width = this.getNode().clientWidth;

    this.dendrogram.width(width);

    this.drawVisualization(this.props, this.state);
  },
  getNode: function () {
    return ReactDOM.findDOMNode(this);
  },
  render: function() {
    // Create style here to update height and avoid mutated style warning
    var style = {
      height: this.props.height
    };

    return <div style={style}></div>
  }
});

module.exports = DendrogramContainer;
