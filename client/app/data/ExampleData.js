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
    name: "U2OS",
    description: "U2OS cells expressing 53BP1 and PCNA reporters",
    species: [
      {
        name: "53BP1",
        min: 0,
        max: 5,
        value: 5
      },
      {
        name: "PCNA",
        min: 0,
        max: 2,
        value: 2
      }
    ],
    phases: [
      {
        name: "G1"
      },
      {
        name: "S"
      },
      {
        name: "G2"
      }
    ],
    speciesPhaseMatrix: [
      [-0.3, 0, -0.1],
      [0, 0, 0]
    ],
    speciesMatrices: [
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [0, 0]
      ]
    ]
  },
  {
    name: "Test Model",
    description: "Test model created by embellishing U2OS data",
    species: [
      {
        name: "53BP1",
        min: 0,
        max: 5,
        value: 5
      },
      {
        name: "PCNA",
        min: 0,
        max: 2,
        value: 2
      }
    ],
    phases: [
      {
        name: "G1"
      },
      {
        name: "S"
      },
      {
        name: "G2"
      }
    ],
    speciesPhaseMatrix: [
      [-0.3, 0, -0.1],
      [0, 0.6, 0.1]
    ],
    speciesMatrices: [
      [
        [0, -0.6],
        [0.4, 0]
      ],
      [
        [0, 0.7],
        [-0.4, 0]
      ],
      [
        [0, -0.2],
        [0.5, 0]
      ]
    ]
  },
  {
    name: "Test Model 2",
    description: "More complicated test model",
    species: [
      {
        name: "53BP1",
        min: 0,
        max: 5,
        value: 5
      },
      {
        name: "PCNA",
        min: 0,
        max: 2,
        value: 2
      },
      {
        name: "Test01",
        min: 0,
        max: 2,
        value: 2
      },
      {
        name: "Test02",
        min: 0,
        max: 2,
        value: 2
      }
    ],
    phases: [
      {
        name: "G1"
      },
      {
        name: "S"
      },
      {
        name: "G2"
      }
    ],
    speciesPhaseMatrix: [
      [-0.3, 0, -0.1],
      [0, 0.6, 0.1],
      [0.3, -0.2, 0.4],
      [0.2, 0, 0],
    ],
    speciesMatrices: [
      [
        [0, -0.6, 0.3, -0.1],
        [0.4, 0, 0, 0.2],
        [0.2, -0.3, 0, 0.2],
        [0.1, 0.4, 0, 0]
      ],
      [
        [0, 0.7, 0, 0],
        [-0.4, 0, 0.1, 0.5],
        [-0.2, 0, 0, -0.3],
        [0, 0, 0.4, 0]
      ],
      [
        [0, -0.2, 0.4, 0.1],
        [0.5, 0, 0.1, 0.4],
        [0.5, 0.2, 0, -0.4],
        [-0.5, 0, -0.1, 0]
      ]
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