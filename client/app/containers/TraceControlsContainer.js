var React = require("react");
var PropTypes = React.PropTypes;
var TraceControlContainer = require("./TraceControlContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");
var DataStore = require("../stores/DataStore");

var TraceControlsContainer = React.createClass ({
  propTypes: {
    traces: PropTypes.arrayOf(PropTypes.object).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  },
  getInitialState: function () {
    return {
      higlightChange: false
    };
  },
  componentDidMount: function () {
    DataStore.addHighlightChangeListener(this.onHighlightChange);
  },
  componentWillUnmount: function () {
    DataStore.removeHighlightChangeListener(this.onHighlightChange);
  },
  onHighlightChange: function () {
    this.setState({
      higlightChange: !this.state.highlightChange
    });
  },
  render: function () {
    var controlStyle = {
      width: this.props.width,
      minWidth: this.props.width
    };

    var isAverage = this.props.traces[0].name === "Average";
    var height = this.props.height;

    var buttons = this.props.traces.map(function (trace, i) {
      var divStyle = {
        display: "flex",
        height: height
      };

      var labelStyle = {
        verticalAlign: "middle",
        overflow: "hidden",
        borderRadius: "5px",
        flex: 1,
        lineHeight: (trace.highlight === "primary" ? (height - 1) : height) + "px",
        color: trace.selected ? "#000" : "#ccc",
        paddingRight: trace.highlight === "primary" ? 4 : 5,
        border: trace.highlight === "primary" ? "1px solid #ccc" : null,
        backgroundColor: trace.highlight ? "#f0f0f0" : null
      };

      function handleMouseOver() {
        ViewActionCreators.highlightTrace(trace);
      }

      function handleMouseLeave() {
        ViewActionCreators.highlightTrace(null);
      }

      return (
        <div
          key={i}
          style={divStyle}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}>
            <div
              className="text-right small"
              style={labelStyle}>
                <span title={trace.name}>{isAverage ? "" : trace.name}</span>
            </div>
            <div style={controlStyle}>
              <TraceControlContainer
                trace={trace} />
            </div>
        </div>
      );
    });

    return (
      <div style={{marginTop: isAverage ? 0 : 1}}>
        {buttons}
      </div>
    );
  }
});


module.exports = TraceControlsContainer;
