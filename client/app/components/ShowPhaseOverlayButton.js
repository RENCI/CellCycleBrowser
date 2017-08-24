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

function ShowPhaseOverlayButton(props) {
  function handleClick() {
    ViewActionCreators.showPhaseOverlay(props.track);
  }

  var disabled = props.track.phases.length === 0;

  var classes = "btn btn-default btn-xs" +
                (props.track.showPhaseOverlay ? " active" : "") +
                (disabled ? " disabled" : "");

  return (
    <div style={divStyle}>
      <label
        className={classes}
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        data-original-title={disabled ? "No phase information" : "Show phase overlay"}
        onClick={disabled ? null : handleClick}>
          <span
            className="glyphicon glyphicon-tasks"
            style={iconStyle} />
      </label>
    </div>
  );
}

ShowPhaseOverlayButton.propTypes = {
  track: PropTypes.object.isRequired
};

module.exports = ShowPhaseOverlayButton;
