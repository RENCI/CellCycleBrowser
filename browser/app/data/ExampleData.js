// Use localStorage as a proxy for getting data from a server

var cellLines = [
  { value: "cellLine1", name: "Cell line 1" },
  { value: "cellLine2", name: "Cell line 2" },
  { value: "cellLine3", name: "Cell line 3" },
];

var data = {
  cellLine1: {
    map: {
      matrix: [
        [   0,  5871, 8916, 2868],
        [1951,     0, 2060, 6171],
        [8010, 16145,    0, 8045],
        [1013,   990,  940,    0]
      ]
    },
    features: [
      {
        name: "f1",
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
        name: "f2",
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
  cellLine2: {
    map: {
      matrix: [
        [0, 5, 7, 2, 0],
        [5, 0, 3, 4, 1],
        [7, 3, 0, 6, 3],
        [2, 4, 6, 0, 8],
        [0, 1, 3, 8, 0]
      ]
    },
    features: [
      {
        name: "f1",
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
        name: "f2",
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
        name: "f3",
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
  cellLine3: {
    map: {
      matrix: [
          [0, 5, 7, 2],
          [5, 0, 3, 4],
          [7, 3, 0, 6],
          [2, 4, 6, 0]
      ]
    },
    features: [
      {
        name: "f1",
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
        name: "f2",
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
        name: "f3",
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
        name: "f4",
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
    localStorage.setItem("cellLines", JSON.stringify(cellLines));
    localStorage.setItem("data", JSON.stringify(data));
  }
}
