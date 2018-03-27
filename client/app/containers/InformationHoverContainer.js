var React = require("react");
var ReactDOM = require("react-dom");
var InformationHover = require("../components/InformationHover");

class InformationHoverContainer extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    // Activate information hover
    var trigger = $(this.div).find("[data-toggle='popover']").first();
    var content = trigger.next().first();

    trigger.popover({
      content: content.html()
    });
  }

  render() {
    return (
      <div ref={div => this.div = div}>
        <InformationHover >
          {this.props.children}
        </InformationHover>
      </div>
    );
  }
}

module.exports = InformationHoverContainer;
