var React = require("react");
var PropTypes = require("prop-types");
var ReactDOM = require("react-dom");
var ToggleButtonContainer = require("./ToggleButtonContainer");
var TraceControlPopup = require("../components/TraceControlPopup");
var ViewActionCreators = require("../actions/ViewActionCreators");

var divStyle = {
  width: "100%",
  height: "100%",
  position: "relative"
};

class TraceControlContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      mouseOver: false
    };

    // Need to bind this to callback functions here
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleUnselectAll = this.handleUnselectAll.bind(this);
    this.handleSelectAllAndPhase = this.handleSelectAllAndPhase.bind(this);
  }

  componentDidUpdate() {
    $(this.div).find("[data-toggle='tooltip']").tooltip();
  }

  handleMouseOver() {
    this.setState({
      mouseOver: true
    });
  }

  handleMouseLeave() {
    this.setState({
      mouseOver: false
    });
  }

  handleToggle() {
    ViewActionCreators.selectTrace(this.props.trace, !this.props.trace.selected);
  }

  handleSelectAll() {
    ViewActionCreators.selectAllTraces(this.props.trace, true);
  }

  handleUnselectAll() {
    ViewActionCreators.selectAllTraces(this.props.trace, false);
  }

  handleSelectAllAndPhase() {
    ViewActionCreators.selectAllTraces(this.props.trace, true, true);
  }

  render() {
    var trace = this.props.trace;
    var isPhase = trace.hasOwnProperty("phases");
    var hasPhase = !isPhase && trace.track.phases.length > 0;
    var handleSAAP = hasPhase ? this.handleSelectAllAndPhase : null;

    return (
      <div
        ref={div => this.div = div}
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
}

TraceControlContainer.propTypes = {
  trace: PropTypes.object.isRequired
};

module.exports = TraceControlContainer;
