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
    SvgCrowbar(this.div.parentNode);
  }

  render() {
    return (
      <div ref={div => this.div = div}>
        <SaveSvgButton onClick={this.handleButtonClick} />
      </div>
    );
  }
}

module.exports = SaveSvgButtonContainer;
