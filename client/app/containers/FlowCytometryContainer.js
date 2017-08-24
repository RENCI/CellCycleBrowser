var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var FlowCytometry = require("../visualizations/FlowCytometry");
var DataStore = require("../stores/DataStore");
var NucleiDistributionStore = require("../stores/NucleiDistributionStore");
var DataUtils = require("../utils/DataUtils");
var d3 = require("d3");

var refName = "ref";

function getStateFromDataStore() {
  return {
    tracks: DataStore.getData().phaseTracks
  };
}

function getStateFromNucleiDistributionStore() {
  return {
    nucleiDistributions: NucleiDistributionStore.getDistributions()
  };
}

function createCells(phaseTracks, distributions) {
  if (phaseTracks.length === 0 || !distributions) return [];

  // Number of cells
  var n = 5000;

  // Normalized random distribution function
  var randn = d3.randomNormal();

  // Create phase objects with probabilities
  return phaseTracks.map(function (track) {
    var average = track.average;
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

    return {
      tracks: DataStore.getData().phaseTracks,
      nucleiDistributions: NucleiDistributionStore.getDistributions()
    };
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onDataStoreChange);
    NucleiDistributionStore.addChangeListener(this.onNucleiDistributionStoreChange);
  },
  componentWillUnmount: function () {
    DataStore.removeChangeListener(this.onDataStoreChange);
    NucleiDistributionStore.removeChangeListener(this.onNucleiDistributionStoreChange);
  },
  componentWillUpdate: function (props, state) {
    this.drawVisualization(props, state);

    return false;
  },
  onDataStoreChange: function () {
    // Use a ref to see if we are still mounted, as the change listener
    // can still be fired after unmounting due to an asynchronous ajax request
    if (this.refs[refName]) {
      this.setState(getStateFromDataStore());
    }
  },
  onNucleiDistributionStoreChange: function () {
    // Use a ref to see if we are still mounted, as the change listener
    // can still be fired after unmounting due to an asynchronous ajax request
    if (this.refs[refName]) {
      this.setState(getStateFromNucleiDistributionStoreStore());
    }
  },
  drawVisualization: function (props, state) {
    var cells = createCells(state.tracks, state.nucleiDistributions);

    var vis = this.flowCytometry
        .width(props.width);

    var plot = d3.select(ReactDOM.findDOMNode(this)).selectAll("div")
        .data(cells);

    plot.enter().append("div").merge(plot)
        .each(function(d, i) {
          var track = state.tracks[i];
          vis.source(track.source).color(track.sourceColor);
          d3.select(this).call(vis);
        });

    plot.exit().remove();
  },
  render: function () {
    return <div ref={refName}></div>
  }
});

module.exports = FlowCytometryContainer;
