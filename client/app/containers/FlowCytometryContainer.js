var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var FlowCytometry = require("../visualizations/FlowCytometry");
var DataStore = require("../stores/DataStore");
var NucleiDistributionStore = require("../stores/NucleiDistributionStore");
var d3 = require("d3");
require("seedrandom");

function getStateFromDataStore() {
  return {
    tracks: DataStore.getData().tracks.filter(function (track) {
      return track.phaseTrack;
    })
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

  // Use the same seed each time to get same output per input
  // XXX: This almost works, but still getting some small deviations, maybe due
  // to floating point error?
  Math.seedrandom("hello.");

  // Create phase objects with probabilities
  return phaseTracks.map(function (track) {
    // To handle differences in phase naming
    var phaseNameMap = d3.scaleOrdinal()
        .domain(["G1", "S", "G2", "G2M"])
        .range(["G1", "S", "G2", "G2"]);

    var average = track.average.phases;
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

      var point = distributions[phaseNameMap(cell.phase.name)]();

      cell.x = point.x;
      cell.y = point.y;

      return cell;
    });
  });
}

class FlowCytometryContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.flowCytometry = FlowCytometry();

    this.state = {
      tracks: getStateFromDataStore().tracks,
      nucleiDistributions: getStateFromNucleiDistributionStore().nucleiDistributions
    };

    // Need to bind this to callback functions here
    this.onDataStoreChange = this.onDataStoreChange.bind(this);
    this.onNucleiDistributionStoreChange = this.onNucleiDistributionStoreChange.bind(this);
  }

  componentDidMount() {
    DataStore.addChangeListener(this.onDataStoreChange);
    NucleiDistributionStore.addChangeListener(this.onNucleiDistributionStoreChange);
  }

  componentWillUnmount() {
    DataStore.removeChangeListener(this.onDataStoreChange);
    NucleiDistributionStore.removeChangeListener(this.onNucleiDistributionStoreChange);
  }

  shouldComponentUpdate(props, state) {
    this.drawVisualization(props, state);

    return false;
  }

  onDataStoreChange() {
    // Use a ref to see if we are still mounted, as the change listener
    // can still be fired after unmounting due to an asynchronous ajax request
    if (this.div) {
      this.setState(getStateFromDataStore());
    }
  }

  onNucleiDistributionStoreChange() {
    // Use a ref to see if we are still mounted, as the change listener
    // can still be fired after unmounting due to an asynchronous ajax request
    if (this.div) {
      this.setState(getStateFromNucleiDistributionStore());
    }
  }

  drawVisualization(props, state) {
    var cells = createCells(state.tracks, state.nucleiDistributions);

    var vis = this.flowCytometry
        .width(props.width);

    var plot = d3.select(this.div).selectAll("div")
        .data(cells);

    plot.enter().append("div").merge(plot)
        .each(function(d, i) {
          var track = state.tracks[i];
          vis.source(track.source).color(track.sourceColor);
          d3.select(this).call(vis);
        });

    plot.exit().remove();
  }

  render() {
    return <div ref={div => this.div = div}></div>
  }
}

// Don't make propsTypes required, as a warning is given for the first render
// if using React.cloneElement, as  in VisualizationContainer
FlowCytometryContainer.propTypes = {
  width: PropTypes.number
};

module.exports = FlowCytometryContainer;
