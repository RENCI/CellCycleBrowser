// Use localStorage as a proxy for getting data from a server

var dataSets = [
  { value: "dataSet1", name: "Dataset 1" },
  { value: "dataSet2", name: "Dataset 2" },
  { value: "dataSet3", name: "Dataset 3" },
];

var data = {
  dataSet1: {
    map: {
      matrix: [
        [   0,  5871, 8916, 2868],
        [1951,     0, 2060, 6171],
        [8010, 16145,    0, 8045],
        [1013,   990,  940,    0]
      ]
    },
    species: [
      {
        name: "s1",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      },
      {
        name: "s2",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      }
    ]
  },
  dataSet2: {
    map: {
      matrix: [
        [0, 5, 7, 2, 0],
        [5, 0, 3, 4, 1],
        [7, 3, 0, 6, 3],
        [2, 4, 6, 0, 8],
        [0, 1, 3, 8, 0]
      ]
    },
    species: [
      {
        name: "s1",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c3",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      },
      {
        name: "s2",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c3",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      },
      {
        name: "s3",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c3",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      }
    ]
  },
  dataSet3: {
    map: {
      matrix: [
          [0, 5, 7, 2],
          [5, 0, 3, 4],
          [7, 3, 0, 6],
          [2, 4, 6, 0]
      ]
    },
    species: [
      {
        name: "s1",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c3",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c4",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      },
      {
        name: "s2",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c3",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c4",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      },
      {
        name: "s3",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c3",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c4",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      },
      {
        name: "s4",
        cells: [
          {
            name: "c1",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c2",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c3",
            values: [0, 0, 0, 1, 1, 1]
          },
          {
            name: "c4",
            values: [0, 0, 0, 1, 1, 1]
          }
        ]
      }
    ]
  }
};

module.exports = {
  init: function () {
    localStorage.clear();
    localStorage.setItem("dataSets", JSON.stringify(dataSets));
    localStorage.setItem("data", JSON.stringify(data));
  }
}
