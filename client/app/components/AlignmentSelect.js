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
//    props.onClick("justify");
  }

  function rightClick() {
    props.onClick("right");
  }

  return (
    <div className="row">
      <div className="col-sm-10 col-sm-offset-2">
        <div className="btn-group btn-group-justified" data-toggle="buttons">
          <label className="btn btn-default active" onClick={leftClick}>
            <input type="radio" />
            <span className="glyphicon glyphicon-align-left" style={iconStyle}>
            </span>
          </label>
          <label className="btn btn-default" onClick={middleClick} disabled>
            <input type="radio" />
            <span className="glyphicon glyphicon-align-justify" style={iconStyle}>
            </span>
          </label>
          <label className="btn btn-default"  onClick={rightClick} disabled>
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
  onClick: PropTypes.func.isRequired
};

module.exports = AlignmentSelect;
