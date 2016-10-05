// The entry point for the application

var React = require("react");
var ReactDOM = require("react-dom");
var AppContainer = require("./containers/AppContainer");
var ExampleData = require("./data/ExampleData");

// Load example data into local storage
//ExampleData.init();

ReactDOM.render(
  <AppContainer />,
  document.getElementById("app")
);
