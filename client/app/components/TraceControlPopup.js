var React = require("react");
var PropTypes = require("prop-types");
var SelectAllButton = require("../components/SelectAllButton");
var SelectAllAndPhaseButton = require("../components/SelectAllAndPhaseButton");
var UnselectAllButton = require("../components/UnselectAllButton");

function TraceControlPopup(props) {
  var style = {
    position: "absolute",
    margin: "auto",
    zIndex: 1,
    bottom: 0,
    left: "100%",
    width: 100,
    height: "100%",
    pointerEvents: "none"
  };

  return (
    <div className="btn-group" style={style}>
      <SelectAllButton
        onClick={props.onSelectAll} />
      {props.onSelectAllAndPhase ?
        <SelectAllAndPhaseButton
          onClick={props.onSelectAllAndPhase} />
      : null}
      <UnselectAllButton
        onClick={props.onUnselectAll} />
    </div>
  );
}

TraceControlPopup.propTypes = {
  onSelectAll: PropTypes.func.isRequired,
  onUnselectAll: PropTypes.func.isRequired,
  onSelectAllAndPhase: PropTypes.func
};

module.exports = TraceControlPopup;
