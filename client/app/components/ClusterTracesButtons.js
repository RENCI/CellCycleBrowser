var React = require("react");
var PropTypes = require("prop-types");
var ViewActionCreators = require("../actions/ViewActionCreators");

var divStyle = {
  marginTop: 5,
  marginRight: 5
};

var iconStyle = {
  color: "#aaa"
};

function ClusterTracesButtons(props) {
  function handleClusterClick() {
    ViewActionCreators.clusterTraces(props.track, true);
  }

  function handleSortClick() {
    ViewActionCreators.clusterTraces(props.track, false);
  }

  function handleShowClick() {
    ViewActionCreators.showDendrogram(props.track, !props.track.showDendrogram);
  }

  var cluster = props.track.cluster;
  var dendrogram = props.track.showDendrogram;

  var classes = "btn btn-default btn-xs";

  return (
    <div className="btn-group" style={divStyle}>
      <label
        className={classes}
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title={"Sort traces"}
        onClick={handleSortClick}>
          <span
            className="glyphicon glyphicon-sort-by-alphabet"
            style={iconStyle} />
      </label>
      <label
        className={classes}
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title={"Cluster traces"}
        onClick={handleClusterClick}>
          <span
            className="glyphicon glyphicon-tree-conifer"
            style={iconStyle} />
      </label>
      <label
        className={classes + (!cluster ? " disabled" : "") + (dendrogram ? " active" : "")}
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title={"Show dendrogram"}
        onClick={cluster ? handleShowClick : null}>
          <span
            className="glyphicon glyphicon-eye-open"
            style={iconStyle} />
      </label>
    </div>
  );
}

ClusterTracesButtons.propTypes = {
  track: PropTypes.object.isRequired
};

module.exports = ClusterTracesButtons;
