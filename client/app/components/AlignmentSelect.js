var React = require("react");
var PropTypes = React.PropTypes;

var iconStyle = {
  color: "#aaa",
  pointerEvents: "none"
};

function AlignmentSelect(props) {
  function handleClick(e) {
    props.onClick(e.target.dataset.value);
  }

  function classes(alignment) {
    return "btn btn-default" + (props.alignment === alignment ? " active" : "");
  }

  var col = props.shiftRight ? "col-xs-9 col-xs-offset-3" : "col-xs-10 col-xs-offset-2";

  return (
    <div className="row">
      <div className={col}>
        <div className="btn-group btn-group-justified" data-toggle="buttons">
          <label
            className={classes("left")}
            data-toggle="tooltip"
            data-container="body"
            data-placement="auto top"
            data-value="left"
            title="Align left"
            onClick={handleClick}>
              <input type="radio" />
              <span
                className="glyphicon glyphicon-align-left"
                style={iconStyle} />
          </label>
          <label
            className={classes("justify")}
            data-toggle="tooltip"
            data-container="body"
            data-placement="auto top"
            data-value="justify"
            title="Stretch data"
            onClick={handleClick}>
              <input type="radio" />
              <span
                className="glyphicon glyphicon-align-justify"
                style={iconStyle} />
          </label>
          <label
            className={classes("right")}
            data-toggle="tooltip"
            data-container="body"
            data-placement="auto top"
            data-value="right"
            title="Align right"
            onClick={handleClick}>
              <input type="radio" />
              <span
                className="glyphicon glyphicon-align-right"
                style={iconStyle} />
          </label>
        </div>
      </div>
    </div>
  );
}

AlignmentSelect.propTypes = {
  alignment: PropTypes.string.isRequired,
  shiftRight: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = AlignmentSelect;
