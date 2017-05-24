var React = require("react");
var PropTypes = React.PropTypes;
var SpeciesDivider = require("../components/SpeciesDivider");

var SpeciesDividerContainer = React.createClass ({
  propTypes: {
    index: PropTypes.number.isRequired,
    onDrop: PropTypes.func.isRequired
  },
  getInitialState: function () {
    return {
      visible: false
    };
  },
  handleDragOver: function (e) {
    // Enable dragging
    e.preventDefault();

    this.setState({
      visible: true
    });
  },
  handleDragLeave: function () {
    this.setState({
      visible: false
    });
  },
  handleDrop: function (e) {
    this.setState({
      visible: false
    });

    this.props.onDrop(e);
  },
  render: function () {
    return (
      <SpeciesDivider
        index={this.props.index}
        visible={this.state.visible}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop} />
    );
  }
});

module.exports = SpeciesDividerContainer;
