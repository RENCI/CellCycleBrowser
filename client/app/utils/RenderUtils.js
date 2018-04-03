var React = require("react");
var ReactDOM = require("react-dom");
var Alert = require("../components/Alert");

module.exports.showAlert = function (text) {
  ReactDOM.render(
    <Alert text={text} />,
    document.getElementById("alert")
  );
}

module.exports.hideAlert = function () {
  ReactDOM.render(
    <Alert text={null} />,
    document.getElementById("alert")
  );
}
