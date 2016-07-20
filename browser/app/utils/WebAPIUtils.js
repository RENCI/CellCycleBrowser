var ServerActionCreators = require("../actions/ServerActionCreators");

// Currently using localStorage as a proxy for XMLHttpRequest, or some other
// method of getting data from the server.

module.exports = {
  getDataSets: function () {
    setTimeout(function() {
      var dataSets = JSON.parse(localStorage.getItem("dataSets"));

      ServerActionCreators.receiveDataSets(dataSets);
    }, 0);
  },
  getData: function (dataSet) {
    setTimeout(function() {
      var data = JSON.parse(localStorage.getItem("data"))[dataSet];

      ServerActionCreators.receiveData(data);
    }, 0);
  }
}
