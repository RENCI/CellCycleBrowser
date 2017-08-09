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

function RescaleTracesButton(props) {
  function handleClick() {
    ViewActionCreators.rescaleTraces(props.track);
  }

  var classes = "btn btn-default btn-xs" + (props.track.rescaleTraces ? " active" : "");

  return (
    <div style={divStyle}>
      <label
        className={classes}
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title={"Rescale traces"}
        onClick={handleClick}>
          <span
            className="glyphicon glyphicon-equalizer"
            style={iconStyle} />
      </label>
    </div>
  );
}

RescaleTracesButton.propTypes = {
  track: PropTypes.object.isRequired
};

module.exports = RescaleTracesButton;
