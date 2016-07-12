// Use localStorage as a proxy for getting data from a server

var cellLines = [
  { value: "cellLine1", name: "Cell line 1" },
  { value: "cellLine2", name: "Cell line 2" },
  { value: "cellLine3", name: "Cell line 3" },
];

var data = cellLines.reduce(function(p, c, i) {
  var cellLine = i + 1;

  p[c.value] = {
    modelData: "model " + cellLine,
    cellData: "cell " + cellLine
  };

  return p;
}, {});

module.exports = {
  init: function () {
    localStorage.clear();
    localStorage.setItem("cellLines", JSON.stringify(cellLines));
    localStorage.setItem("data", JSON.stringify(data));
  }
}
