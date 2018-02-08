var React = require("react");
var PropTypes = React.PropTypes;
var ViewActionCreators = require("../actions/ViewActionCreators");

var divStyle = {
  marginTop: 5,
  marginRight: 5
};

var iconStyle = {
  color: "#aaa"
};

function ClusterTracesButton(props) {
  function handleClick() {
    ViewActionCreators.clusterTraces(props.track);
  }

  var classes = "btn btn-default btn-xs";

  return (
    <div style={divStyle}>
      <label
        className={classes}
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title={"Cluster traces"}
        onClick={handleClick}>
          <span
            className="glyphicon glyphicon-tree-conifer"
            style={iconStyle} />
      </label>
    </div>
  );
}

ClusterTracesButton.propTypes = {
  track: PropTypes.object.isRequired
};

module.exports = ClusterTracesButton;
