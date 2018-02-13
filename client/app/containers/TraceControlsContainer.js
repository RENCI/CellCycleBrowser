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
      var labelStyle = {
        marginRight: 5,
        verticalAlign: "middle",
        lineHeight: height + "px",
        color: trace.selected ? "#000" : "#ccc",
        overflow: "hidden",
        flex: 1
      };

      var divStyle = {
        display: "flex",
        height: height,
        borderRadius: "5px",
        backgroundColor: trace.highlight === "primary" ? "#ccc" :
                         trace.highlight === "secondary" ? "#f0f0f0" :
                         null
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
          onMouseOver={trace.selected ? handleMouseOver : null}
          onMouseLeave={trace.selected ? handleMouseLeave : null}>
            <div
              className="text-right small"
              style={labelStyle}
              title={trace.name}>
                {isAverage ? "" : trace.name}
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
