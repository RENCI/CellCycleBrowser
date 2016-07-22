var ServerActionCreators = require("../actions/ServerActionCreators");

// Currently using localStorage as a proxy for XMLHttpRequest, or some other
// method of getting data from the server.

module.exports = {
  getDataSetList: function () {
    setTimeout(function() {
      var dataSetList = JSON.parse(localStorage.getItem("dataSetList"));

      ServerActionCreators.receiveDataSetList(dataSetList);
    }, 0);
  },
  getDataSet: function (dataSetKey) {
    setTimeout(function() {
      var dataSet = JSON.parse(localStorage.getItem("dataSets"))[dataSetKey];

      ServerActionCreators.receiveDataSet(dataSet);
    }, 0);
  }
}
