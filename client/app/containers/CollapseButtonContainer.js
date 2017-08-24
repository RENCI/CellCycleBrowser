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
      collapse: false
    };
  },
  handleClick: function (e) {
    this.setState({
      collapse: !this.state.collapse
    });
  },
  render: function () {
    return (
      <CollapseButton
        targetId={this.props.targetId}
        onClick={this.handleClick}>
          {this.state.collapse ?
            <span className="glyphicon glyphicon-plus" /> :
            <span className="glyphicon glyphicon-minus" />}
      </CollapseButton>
    );
  }
});

module.exports = CollapseButtonContainer;
