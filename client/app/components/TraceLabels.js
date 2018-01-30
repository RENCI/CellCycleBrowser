var React = require("react");
var PropTypes = React.PropTypes;

var divStyle = {
  marginTop: 1
};

function TraceLabels(props) {
  console.log(props.traces);

  var labels = props.traces.map(function (trace, i) {
    var style = {
      marginRight: 5,
      height: props.height,
      verticalAlign: "middle",
      lineHeight: props.height + "px",
      color: trace.selected ? "#000" : "#ccc"
    };

    var classes = "";//trace.selected ? "text-dark" : "text-muted";

    return (
      <div key={i} className={classes} style={style}>
        {trace.name}
      </div>
    );
  });

  return (
    <div className="text-right small" style={divStyle}>
      {labels}
    </div>
  );
}

TraceLabels.propTypes = {
  traces: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.number.isRequired
};

module.exports = TraceLabels;
