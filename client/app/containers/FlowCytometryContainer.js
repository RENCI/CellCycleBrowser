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

  // Number of cells
  var n = 5246;

  // Normalized random distribution function
  var randn = d3.randomNormal();

  // Create phase objects with probabilities
  var phases = reactions.map(function(d) {
    return {
      name: d.reactant.replace("_end", ""),
      kf: d.kf,
      p: 1 / d.kf
    };
  });

  // Number of S subphases
  var numS = phases.filter(function(d) {
    return d.name.indexOf("S") !== - 1;
  }).length;

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

    var index = cell.phase.name.indexOf("_");
    if (index !== -1) cell.phase.name = cell.phase.name.slice(0, index);

//    var distribution = distributions[cell.phase.name];
var distribution = distributions["All"];

    // XXX: Can generate negative values...
    cell.x = Math.abs(distribution.x(1)[0]);
    cell.y = Math.abs(distribution.y(1)[0]);

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
