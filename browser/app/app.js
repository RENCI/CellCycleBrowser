// This is the entry point for the application

var React = require("react");
var ReactDOM = require("react-dom");
var CellCycleBrowser = require("./components/CellCycleBrowser");
var ExampleData = require("./data/ExampleData");
var WebAPIUtils = require("./utils/WebAPIUtils");

// Load example data into local storage
ExampleData.init();

// Get initial data from local storage
WebAPIUtils.getCellLines();

ReactDOM.render(
  <CellCycleBrowser />,
  document.getElementById("app")
);
