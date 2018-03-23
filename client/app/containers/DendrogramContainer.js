var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var Dendrogram = require("../visualizations/Dendrogram");
var d3 = require("d3");

class DendrogramContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.dendrogram = Dendrogram();

    // Need to bind this to callback functions here
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.resize();
  }

  componentWillUnmount() {
    // Resize on window resize
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  shouldComponentUpdate(props, state) {
    this.drawVisualization(props, state);

    return false;
  }

  onResize() {
    this.resize();
  }

  drawVisualization(props, state) {
    // Set up dendrogram
    this.dendrogram
        .height(props.height)
        .cluster(props.cluster);

    // Draw dendrogram
    d3.select(this.getNode())
        .call(this.dendrogram);
  }

  resize() {
    var width = this.getNode().clientWidth;

    this.dendrogram.width(width);

    this.drawVisualization(this.props, this.state);
  }

  getNode() {
    return ReactDOM.findDOMNode(this);
  }

  render() {
    // Create style here to update height and avoid mutated style warning
    var style = {
      height: this.props.height
    };

    return <div style={style}></div>
  }
}

DendrogramContainer.propTypes = {
  cluster: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired
};

module.exports = DendrogramContainer;
