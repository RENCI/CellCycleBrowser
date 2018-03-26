var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var Dendrogram = require("../visualizations/Dendrogram");
var d3 = require("d3");

function height(props) {
  return props.rowHeight * props.cluster.orderedNodes().length;
}

class DendrogramContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.dendrogram = Dendrogram();
  }

  shouldComponentUpdate(props, state) {
    this.drawVisualization(props, state);

    return false;
  }

  drawVisualization(props, state) {
    // Set up dendrogram
    this.dendrogram
        .width(props.width)
        .height(height(props))
        .cluster(props.cluster);

    // Draw dendrogram
    d3.select(ReactDOM.findDOMNode(this))
        .call(this.dendrogram);
  }

  render() {
    // Create style here to update height and avoid mutated style warning
    var style = {
      height: height(this.props)
    };

    return <div style={style}></div>
  }
}

DendrogramContainer.propTypes = {
  cluster: PropTypes.func.isRequired,
  rowHeight: PropTypes.number.isRequired,
  width: PropTypes.number
};

module.exports = DendrogramContainer;
