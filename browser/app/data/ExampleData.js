// Use localStorage as a proxy for getting data from a server
var WebAPIUtils = require("../utils/WebAPIUtils");
var d3 = require("d3");

var profileList = [
  { value: "profile1", name: "Profile 1" },
  { value: "profile2", name: "Profile 2" },
  { value: "profile3", name: "Profile 3" },
];

var models = [
  {
    name: "Model 1",
    matrix: [
      [   0,  5871, 8916, 2868],
      [1951,     0, 2060, 6171],
      [8010, 16145,    0, 8045],
      [1013,   990,  940,    0]
    ]
  },
  {
    name: "Model 2",
    matrix: [
      [0, 5, 7, 2, 0],
      [5, 0, 3, 4, 1],
      [7, 3, 0, 6, 3],
      [2, 4, 6, 0, 8],
      [0, 1, 3, 8, 0]
    ]
  },
  {
    name: "Model 3",
    matrix: [
      [0, 5, 7, 2],
      [5, 0, 3, 4],
      [7, 3, 0, 6],
      [2, 4, 6, 0]
    ]
  }
];

var cellData = [];
var profiles = {};

d3.csv("data/PCNA_53BP1_transpose.csv", function(error, data) {
  if (error) {
    console.log(error);
    return;
  }

  // Nest by species, cell, and feature
  var nest = d3.nest()
      .key(function(d) { return d.Species; })
      .key(function(d) { return d.Cell; })
      .key(function(d) { return d.Feature; })
      .entries(data);

  // Get keys for time samples
  var timeKeys = data.columns.filter(function(d) {
    return d !== "Species" && d !== "Cell" && d !== "Feature";
  });

  // Reformat data
  var species = nest.map(function(d) {
    return {
      name: d.key,
      cells: d.values.map(function(d) {
        return {
          name: d.key,
          features: d.values.map(function(d) {
            return {
              name: d.key,
              values: timeKeys.map(function(key) {
                return +d.values[0][key];
              }).filter(function(d) {
                return !isNaN(d);
              })
            }
          })
        }
      })
    };
  });

  cellData = [
    {
      name: "Cell data 1",
      species: species.slice()
    },
    {
      name: "Cell data 2",
      species: [species[0]]
    },
    {
      name: "Cell data 3",
      species: [species[1]]
    }
  ];

  profiles = {
    profile1: {
      description: "Data and models",
      models: models.slice(),
      cellData: cellData.slice()
    },
    profile2: {
      description: "Just data, no models",
      models: [],
      cellData: cellData.slice()
    },
    profile3: {
      description: "Just models, no data",
      models: models.slice(),
      cellData: []
    }
  };

  localStorage.setItem("profileList", JSON.stringify(profileList));
  localStorage.setItem("profiles", JSON.stringify(profiles));

  // Re-fire event chain once data is loaded
  // TODO: Will need to move elsewhere, probably by firing select event
  // in ProfileSelectContainer
  WebAPIUtils.getProfile(profileList[0].value);
});

module.exports = {
  init: function () {
    localStorage.clear();
    localStorage.setItem("profileList", JSON.stringify(profileList));
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }
}
