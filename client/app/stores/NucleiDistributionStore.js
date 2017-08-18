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
      phase: "All"
    },
    {
      phase: "G1",
      xMin: 8,
      xMax: 20,
      yMax: 2
    },
    {
      phase: "S",
      xMin: 8,
      xMax: 40,
      yMin: 4
    },
    {
      phase: "G2",
      xMin: 20,
      xMax: 40,
      yMax: 3
    }
  ];

  // Create distributions per phase/zone
  distributions = {};

  zones.forEach(function(zone) {
    // Get nuclei for this zone
    var n = nucleiLocations.filter(function(d) {
      return inZone(d, zone);
    });

    // Create distributions using kde
    distributions[zone.phase] = {
      x: kdeSampler().sample(n.map(function(d) { return d.x; })),
      y: kdeSampler().sample(n.map(function(d) { return d.y; }))
    };
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
  var kernel = science.stats.kernel.gaussian,
      sample = [],
      bandwidth = science.stats.bandwidth.nrd;

  function kde(n) {
    // Random input point sampler
    var randomPoint = d3.randomUniform(sample.length);

    // Get bandwidth for kernel
    var bw = bandwidth.call(this, sample);

    // Random Gaussian kernel sampler
    var rGaussian = d3.randomNormal(0, bw);

    // Return n values
    return d3.range(n).map(function() {
      // Generate new sample
      return sample[Math.floor(randomPoint())];// + rGaussian();
    });
  }

  kde.kernel = function(x) {
    if (!arguments.length) return kernel;
    kernel = x;
    return kde;
  };

  kde.sample = function(x) {
    if (!arguments.length) return sample;
    sample = x;
    return kde;
  };

  kde.bandwidth = function(x) {
    if (!arguments.length) return bandwidth;
    bandwidth = science.functor(x);
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
