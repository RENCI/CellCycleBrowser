var React = require("react");
var ReactDOM = require("react-dom");
var SaveSvgButton = require("../components/SaveSvgButton");
var SvgCrowbar = require("../utils/SvgCrowbar");

class SaveSvgButtonContainer extends React.Component {
  constructor() {
    super();

    // Need to bind this to callback functions here
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
    SvgCrowbar(ReactDOM.findDOMNode(this).parentNode);
  }

  render() {
    return <SaveSvgButton onClick={this.handleButtonClick} />
  }
}

module.exports = SaveSvgButtonContainer;
