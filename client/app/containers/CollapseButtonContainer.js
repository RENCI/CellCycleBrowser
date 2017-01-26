var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButton = require("../components/CollapseButton");
var ViewActionCreators = require("../actions/ViewActionCreators");
var AlignmentStore = require("../stores/AlignmentStore");

var CollapseButtonContainer = React.createClass ({
  propTypes: {
    targetId: PropTypes.string.isRequired
  },
  getInitialState: function () {
    return {
      text: "-"
    };
  },
  handleClick: function (e) {
    this.setState({
      text: this.state.text === "-" ? "+" : "-"
    });

    // XXX: Hack to force render of browser container
    if (this.state.text === "+") {
      ViewActionCreators.selectAlignment(AlignmentStore.getAlignment());
    }
  },
  render: function () {
    return (
      <CollapseButton
        text={this.state.text}
        targetId={this.props.targetId}
        onClick={this.handleClick} />
    );
  }
});

module.exports = CollapseButtonContainer;
