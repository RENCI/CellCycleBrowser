// Use localStorage as a proxy for getting data from a server
var WebAPIUtils = require("../utils/WebAPIUtils");
var d3 = require("d3");

var dataSetList = [
  { value: "dataSet1", name: "Dataset 1" },
  { value: "dataSet2", name: "Dataset 2" },
  { value: "dataSet3", name: "Dataset 3" },
];

var maps = [
  {
    name: "Map 1",
    matrix: [
      [   0,  5871, 8916, 2868],
      [1951,     0, 2060, 6171],
      [8010, 16145,    0, 8045],
      [1013,   990,  940,    0]
    ]
  },
  {
    name: "Map 2",
    matrix: [
      [0, 5, 7, 2, 0],
      [5, 0, 3, 4, 1],
      [7, 3, 0, 6, 3],
      [2, 4, 6, 0, 8],
      [0, 1, 3, 8, 0]
    ]
  },
  {
    name: "Map 3",
    matrix: [
      [0, 5, 7, 2],
      [5, 0, 3, 4],
      [7, 3, 0, 6],
      [2, 4, 6, 0]
    ]
  }
];

var cellData = [];
var data = {};

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
      name: "Cell Data 1",
      species: species.slice()
    },
    {
      name: "Cell Data 2",
      species: species[0]
    },
    {
      name: "Cell Data 3",
      species: species[1]
    }
  ];

  data = {
    dataSet1: {
      description: "Data and maps",
      maps: maps.slice(),
      cellData: cellData.slice()
    },
    dataSet2: {
      description: "Just data, no maps",
      maps: [],
      cellData: cellData.slice()
    },
    dataSet3: {
      description: "Just maps, no data",
      maps: maps.slice(),
      cellData: []
    }
  };

  localStorage.clear();
  localStorage.setItem("dataSetList", JSON.stringify(dataSetList));
  localStorage.setItem("data", JSON.stringify(data));

  WebAPIUtils.getData(dataSetList[0].value);
});

module.exports = {
  init: function () {
    localStorage.clear();
    localStorage.setItem("dataSetList", JSON.stringify(dataSetList));
    localStorage.setItem("data", JSON.stringify(data));
  }
}
