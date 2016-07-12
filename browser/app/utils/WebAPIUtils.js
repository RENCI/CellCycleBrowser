var ServerActions = require("../actions/ServerActions");

// Currently using localStorage as a proxy for XMLHttpRequest, or some other
// method of getting data from the server.

module.exports = {
  getCellLines: function () {
    var cellLines = JSON.parse(localStorage.getItem("cellLines"));

    ServerActions.receiveCellLines(cellLines);

    // Get first cell line data for now
    this.getData(cellLines[0]);
  },
  getData: function (cellLine) {
    var key = cellLine.value;
    var data = JSON.parse(localStorage.getItem("data"))[key];

    ServerActions.receiveData(data);
  }
}
