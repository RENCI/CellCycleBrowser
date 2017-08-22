var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Constants = require("../constants/Constants");
var science = require("science");
var d3 = require("d3");

var CHANGE_EVENT = "change";

// Distributions
var distributions;

function createDistributions(nuclei) {
  // Extract x and y components
  var nucleiLocations = nuclei.map(function(d) {
    return {
      x: +d.Intensity_IntegratedIntensity_DAPI,
      y: +d.Intensity_IntegratedIntensity_Edu
    };
  });

  // Zones for phases
  var zones = [
    {
      phase: "G1",
      xMax: 20,
      yMax: 2
    },
    {
      phase: "S",
      yMin: 3
    },
    {
      phase: "G2",
      xMin: 20,
      yMax: 3
    }
  ];

  // Create distributions per phase/zone
  distributions = {};

  var xExtent = d3.extent(nucleiLocations, function(d) { return d.x; });
  var yExtent = d3.extent(nucleiLocations, function(d) { return d.y; });

  zones.forEach(function(zone) {
    // Get nuclei for this zone
    var n = nucleiLocations.filter(function(d) {
      return inZone(d, zone);
    });

    // Create distributions using kde
    distributions[zone.phase] = kdeSampler()
        .sample(n)
        .xExtent(xExtent)
        .yExtent(yExtent);
  });

  function inZone(nucleus, zone) {
    return (!zone.xMin || nucleus.x > zone.xMin) &&
           (!zone.xMax || nucleus.x < zone.xMax) &&
           (!zone.yMin || nucleus.y > zone.yMin) &&
           (!zone.yMax || nucleus.y < zone.yMax);
  }
};

// Based on kde in science.js
var kdeSampler = function() {
  var sample = [],
      pointSampler,
      gx,
      gy,
      xExtent = [0, 1],
      yExtent = [0, 1];

  function kde() {
    // Generate new sample
    var p = sample[Math.floor(pointSampler())];

    var x = p.x + gx();
    while (x < xExtent[0] || x > xExtent[1]) {
      x = p.x + gx();
    }

    var y = p.y + gy();
    while (y < yExtent[0] || y > yExtent[1]) {
      y = p.y + gy();
    }

    return {
      x: x,
      y: y
    };
  }

  function updateKernels() {
    // Get bandwidths for kernel
    var bandwidth = science.stats.bandwidth.nrd;
    var bwx = bandwidth.call(this, sample.map(function(d) { return d.x; }));
    var bwy = bandwidth.call(this, sample.map(function(d) { return d.y; }));

    // Random Gaussian kernel samplers
    gx = d3.randomNormal(0, bwx);
    gy = d3.randomNormal(0, bwy);
  };

  kde.sample = function(x) {
    if (!arguments.length) return sample;
    sample = x;
    pointSampler = d3.randomUniform(sample.length);
    minX = d3.min(sample, function(d) { return d.x; });
    minY = d3.min(sample, function(d) { return d.y; });
    updateKernels();
    return kde;
  };

  kde.xExtent = function(x) {
    if (!arguments.length) return xExtent;
    xExtent = x;
    return kde;
  };

  kde.yExtent = function(x) {
    if (!arguments.length) return yExtent;
    yExtent = x;
    return kde;
  };

  return kde;
};


var NucleiDistributionStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getDistributions: function () {
    return distributions;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.RECEIVE_NUCLEI:
      createDistributions(action.nuclei);
      NucleiDistributionStore.emitChange();
      break;
  }
});

module.exports = NucleiDistributionStore;
