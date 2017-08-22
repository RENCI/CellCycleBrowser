var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var FlowCytometry = require("../visualizations/FlowCytometry");
var DataStore = require("../stores/DataStore");
var NucleiDistributionStore = require("../stores/NucleiDistributionStore");
var DataUtils = require("../utils/DataUtils");
var d3 = require("d3");

var refName = "ref";

function getStateFromStore() {
  return {
    cells: createCells(DataStore.getData().phaseTracks,
                       NucleiDistributionStore.getDistributions())
  };
}

function createCells(phaseTracks, distributions) {
  if (phaseTracks.length === 0 || !distributions) return [];

  // Number of cells
  var n = 5000;

  // Normalized random distribution function
  var randn = d3.randomNormal();

  // Create phase objects with probabilities
  var average = phaseTracks[0].average;
  var averageLength = average[average.length - 1].stop - average[0].start;
  var phases = average.map(function(d) {
    return {
      name: d.name,
      tau: (d.stop - d.start) / averageLength
    };
  });

  var g1 = phases[0];
  var s = phases[1];
  var g2 = phases[2];

  g1.p = 2 * (1 - Math.pow(2, -g1.tau));
  g2.p = Math.pow(2, g2.tau) - 1;
  s.p = 1 - (g1.p + g2.p);

  // Create cumulative probabilities for sampling
  phases.reduce(function(p, c) {
    return c.cumP = c.p + p;
  }, 0);

  return d3.range(0, n).map(function() {
    var cell = {},
        p = Math.random();

    // Determine phase for cell
    for (var i = 0; i < phases.length; i++) {
      if (p < phases[i].cumP) {
        cell.phase = phases[i];
        break;
      }
    }

    var point = distributions[cell.phase.name]();

    cell.x = point.x;
    cell.y = point.y;

    return cell;
  });
}

var FlowCytometryContainer = React.createClass ({
  // Don't make propsTypes required, as a warning is given for the first render
  // if using React.cloneElement, as  in VisualizationContainer
  propTypes: {
    width: PropTypes.number
  },
  getInitialState: function () {
    // Create visualization function
    this.flowCytometry = FlowCytometry();

    return getStateFromStore();
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onStoreChange);
    NucleiDistributionStore.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount: function () {
    DataStore.removeChangeListener(this.onStoreChange);
    NucleiDistributionStore.removeChangeListener(this.onStoreChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props, state);

    return false;
  },
  onStoreChange: function () {
    // Use a ref to see if we are still mounted, as the change listener
    // can still be fired after unmounting due to an asynchronous ajax request
    if (this.refs[refName]) {
      this.setState(getStateFromStore());
    }
  },
  drawVisualization: function (props, state) {
    this.flowCytometry
        .width(props.width);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.cells)
        .call(this.flowCytometry);
  },
  render: function () {
    return <div ref={refName}></div>
  }
});

module.exports = FlowCytometryContainer;
