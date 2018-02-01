var React = require("react");
var ReactDOM = require("react-dom");
var SaveSvgButton = require("../components/SaveSvgButton");
var SvgCrowbar = require("../utils/SvgCrowbar");

var SaveSvgButtonContainer = React.createClass ({
  handleButtonClick: function () {
    SvgCrowbar(ReactDOM.findDOMNode(this).parentNode);
  },
  render: function () {
    return <SaveSvgButton onClick={this.handleButtonClick} />
  }
});

module.exports = SaveSvgButtonContainer;
