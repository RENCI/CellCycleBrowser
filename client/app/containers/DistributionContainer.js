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
    cells: createCells(ModelStore.getModel().reactions)
  };
}

function createCells(reactions) {
  if (!reactions) return [];

  // Number of cells
  var n = 5000;

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

    // Position the cell based on phase
    var name = cell.phase.name;

    if (name.indexOf("G1") !== -1) {
      cell.x = 1;
      cell.y = 1;

      // Random offset
      cell.x += 0.05 * randn();
      cell.y += 0.05 * randn();
    }
    else if (name.indexOf("G2") !== -1) {
      cell.x = 2;
      cell.y = 1;

      // Random offset
      cell.x += 0.05 * randn();
      cell.y += 0.05 * randn();
    }
    else if (name.indexOf("S") !== -1) {
      // Get S subphase index
      var sIndex = +name.substr(name.indexOf("_") + 1) - 1;

//        cell.x = 1 + 0.25 + sIndex / numS;
      cell.x = 1.5;
      cell.y = 2;

      // Random offset
      var r = 0.25 * randn();
      cell.x += r;
      cell.y += -Math.abs(r) + 0.25 * randn();
    }
    else {
      console.log("Phase not handled");
      cell.x = cell.y = 0;
    }

    return cell;
  });
}

var DistributionContainer = React.createClass ({
  getInitialState: function () {
    // Create visualization function
    this.distribution = Distribution();

    return getStateFromModelStore();
  },
  componentDidMount: function() {
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
    d3.select(this.getNode())
        .datum(state.cells)
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
