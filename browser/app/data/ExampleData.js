// Use localStorage as a proxy for getting data from a server

var cellLines = [
  { value: "cellLine1", name: "Cell line 1" },
  { value: "cellLine2", name: "Cell line 2" },
  { value: "cellLine3", name: "Cell line 3" },
];

var data = {
  "cellLine1": [
    { id: "5fbmzmtc", x: 7, y: 41, z: 6},
    { id: "s4f8phwm", x: 11, y: 45, z: 9},
  ],
  "cellLine2": [
    {id: "5fbmzmtc", x: 7, y: 30, z: 6},
    {id: "s4f8phwm", x: 3, y: 35, z: 4},
    {id: "adfdfdf", x: 14, y: 26, z: 6},
  ],
  "cellLine3": [
    {id: "5fbmzmtc", x: 7, y: 41, z: 6},
    {id: "s4f8phwm", x: 6, y: 48, z: 3},
    {id: "adfdfdf", x: 14, y: 41, z: 6},
    {id: "adffdfm", x: 20, y: 50, z: 2},
  ]
};

module.exports = {
  init: function () {
    localStorage.clear();
    localStorage.setItem("cellLines", JSON.stringify(cellLines));
    localStorage.setItem("data", JSON.stringify(data));
  }
}
