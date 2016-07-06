var React = require("react");
var Header = require("../components/Header");

var HeaderContainer = React.createClass ({
  render: function () {
    return <Header header="Cell Cycle Browser" />
  }
});

module.exports = HeaderContainer;
