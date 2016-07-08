var React = require("react");
var ReactDOM = require("react-dom");
var HeaderContainer = require("./containers/HeaderContainer");
var MainContainer = require("./containers/MainContainer");

ReactDOM.render(<HeaderContainer header="Cell Cycle Browser"/>, document.getElementById("header"));
ReactDOM.render(<MainContainer />, document.getElementById("main"));
