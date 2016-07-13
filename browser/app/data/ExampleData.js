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
    cells: [
      { id: "5fbmzmtc", x: 7, y: 41, z: 6 },
      { id: "s4f8phwm", x: 11, y: 45, z: 9 }
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
    cells: [
      { id: "5fbmzmtc", x: 7, y: 30, z: 6 },
      { id: "s4f8phwm", x: 3, y: 35, z: 4 },
      { id: "adfdfdf", x: 14, y: 26, z: 6 }
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
    cells: [
      { id: "5fbmzmtc", x: 7, y: 41, z: 6 },
      { id: "s4f8phwm", x: 6, y: 48, z: 3 },
      { id: "adfdfdf", x: 14, y: 41, z: 6 },
      { id: "adffdfm", x: 20, y: 50, z: 2 }
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
