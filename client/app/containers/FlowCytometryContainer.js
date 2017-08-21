var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var FlowCytometry = require("../visualizations/FlowCytometry");
var ModelStore = require("../stores/ModelStore");
var NucleiDistributionStore = require("../stores/NucleiDistributionStore");
var DataUtils = require("../utils/DataUtils");
var d3 = require("d3");

var refName = "ref";

function getStateFromStore() {
  return {
    cells: createCells(ModelStore.getModel().reactions,
                       NucleiDistributionStore.getDistributions())
  };
}

function createCells(reactions, distributions) {
  if (!reactions || reactions.length === 0 || !distributions) return [];

/*
  return distributions["All"].x.sample().map(function(d, i) {
    return {
      x: d,
      y: distributions["All"].y.sample()[i]
    };
  });
*/
/*
var g1 = distributions["G1"].x.sample().map(function(d, i) {
  return {
    x: d,
    y: distributions["G1"].y.sample()[i]
  };
});

var s = distributions["S"].x.sample().map(function(d, i) {
  return {
    x: d,
    y: distributions["S"].y.sample()[i]
  };
});

var g2 = distributions["G2"].x.sample().map(function(d, i) {
  return {
    x: d,
    y: distributions["G2"].y.sample()[i]
  };
});

return g1.concat(s).concat(g2);
*/

  // Number of cells
  var n = 5000;

  // Normalized random distribution function
  var randn = d3.randomNormal();

  // Create phase objects with probabilities
  var phases = [
    { name: "G1", p: 0.1 },
    { name: "S", p: 0.8 },
    { name: "G2", p: 0.1 }
  ];

  // Normalize probabilities
  var pSum = d3.sum(phases, function(d) { return d.p; });

  phases.forEach(function(d) {
    d.p /= pSum;
  });

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

    var p = distributions[cell.phase.name](1)[0];

    // XXX: Can generate negative values...
    cell.x = Math.abs(p.x);
    cell.y = Math.abs(p.y);

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
    ModelStore.addChangeListener(this.onStoreChange);
    NucleiDistributionStore.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount: function () {
    ModelStore.removeChangeListener(this.onStoreChange);
    NucleiDistributionStore.removeChangeListener(this.onStoreChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props, state);

    return false;
  },
  onStoreChange: function () {
    // Use a ref to see if we are still mounted, as the model change listener
    // can still be fired after unmounting due to an asynchronous ajax request
    if (this.refs[refName]) {
      this.setState(getStateFromStore());
    }

    this.setState(getStateFromStore());
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
