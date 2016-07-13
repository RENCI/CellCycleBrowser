var ServerActionCreators = require("../actions/ServerActionCreators");

// Currently using localStorage as a proxy for XMLHttpRequest, or some other
// method of getting data from the server.

module.exports = {
  getCellLines: function () {
    setTimeout(function() {
      var cellLines = JSON.parse(localStorage.getItem("cellLines"));

      ServerActionCreators.receiveCellLines(cellLines);
    }, 0);
  },
  getData: function (cellLine) {
    setTimeout(function() {
      var data = JSON.parse(localStorage.getItem("data"))[cellLine];

      ServerActionCreators.receiveData(data);
    }, 0);
  }
}
