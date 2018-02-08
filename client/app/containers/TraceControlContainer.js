var React = require("react");
var PropTypes = React.PropTypes;
var ReactDOM = require("react-dom");
var ToggleButtonContainer = require("./ToggleButtonContainer");
var TraceControlPopup = require("../components/TraceControlPopup");
var ViewActionCreators = require("../actions/ViewActionCreators");

var divStyle = {
  width: "100%",
  height: "100%",
  position: "relative"
};

var TraceControlContainer = React.createClass ({
  propTypes: {
    trace: PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      mouseOver: false
    };
  },
  componentDidUpdate: function () {
    $(ReactDOM.findDOMNode(this)).find("[data-toggle='tooltip']").tooltip();
  },
  handleMouseOver: function () {
    this.setState({
      mouseOver: true
    });
  },
  handleMouseLeave: function () {
    this.setState({
      mouseOver: false
    });
  },
  handleToggle: function () {
    ViewActionCreators.selectTrace(this.props.trace, !this.props.trace.selected);
  },
  handleSelectAll: function () {
    ViewActionCreators.selectAllTraces(this.props.trace, true);
  },
  handleUnselectAll: function () {
    ViewActionCreators.selectAllTraces(this.props.trace, false);
  },
  handleSelectAllAndPhase: function () {
    ViewActionCreators.selectAllTraces(this.props.trace, true, true);
  },
  render: function () {
    var hasPhase = this.props.trace.track.phases.length > 0;
    var handleSAAP = hasPhase ? this.handleSelectAllAndPhase : null;

    return (
      <div
        style={divStyle}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}>
          <ToggleButtonContainer
            selected={this.props.trace.selected}
            onClick={this.handleToggle} />
          {this.state.mouseOver ?
            <TraceControlPopup
              onSelectAll={this.handleSelectAll}
              onUnselectAll={this.handleUnselectAll}
              onSelectAllAndPhase={hasPhase ? this.handleSelectAllAndPhase : null} />
            : null}
      </div>
    );
  }
});

module.exports = TraceControlContainer;
