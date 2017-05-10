var React = require("react");
var PropTypes = React.PropTypes;

var iconStyle = {
  color: "#aaa",
  pointerEvents: "none"
};

function AlignmentSelect(props) {
  function leftClick() {
    props.onClick("left");
  }

  function middleClick() {
    props.onClick("justify");
  }

  function rightClick() {
    props.onClick("right");
  }

  function classes(alignment) {
    return "btn btn-default" + (props.alignment === alignment ? " active" : "");
  }

  return (
    <div className="row">
      <div className="col-xs-10 col-xs-offset-2">
        <div className={"btn-group btn-group-justified"} data-toggle="buttons">
          <label className={classes("left")} onClick={leftClick}>
            <input type="radio" />
            <span className="glyphicon glyphicon-align-left" style={iconStyle}>
            </span>
          </label>
          <label className={classes("justify")} onClick={middleClick}>
            <input type="radio" />
            <span className="glyphicon glyphicon-align-justify" style={iconStyle}>
            </span>
          </label>
          <label className={classes("right")} onClick={rightClick}>
            <input type="radio" />
            <span className="glyphicon glyphicon-align-right" style={iconStyle}>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

AlignmentSelect.propTypes = {
  alignment: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = AlignmentSelect;
