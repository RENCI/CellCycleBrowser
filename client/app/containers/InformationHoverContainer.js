var React = require("react");
var PropTypes = React.PropTypes;
var ReactDOM = require("react-dom");
var InformationHover = require("../components/InformationHover");

var InformationHoverContainer = React.createClass ({
  componentDidMount: function () {
    // Activate information hover
    var trigger = $(ReactDOM.findDOMNode(this)).find("[data-toggle='popover']").first();
    var content = trigger.next().first();

    trigger.popover({
       content: content.html()
    });
  },
  render: function () {
    return (
      <InformationHover>
        {this.props.children}
      </InformationHover>
    );
  }
});

module.exports = InformationHoverContainer;
