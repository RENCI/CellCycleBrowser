var ServerActionCreators = require("../actions/ServerActionCreators");

// Currently using localStorage as a proxy for XMLHttpRequest, or some other
// method of getting data from the server.

module.exports = {
  getCellLines: function () {
    var cellLines = JSON.parse(localStorage.getItem("cellLines"));

    setTimeout(function() {
      ServerActionCreators.receiveCellLines(cellLines);
    }, 0);
  },
  getData: function (cellLine) {
    var data = JSON.parse(localStorage.getItem("data"))[cellLine];

    setTimeout(function() {
      ServerActionCreators.receiveData(data);
    }, 0);
  }
}
