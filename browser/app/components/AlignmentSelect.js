var React = require("react");
var PropTypes = React.PropTypes;

var buttonStyle = {
padding: 2
};

var iconStyle = {
  color: "#aaa",
  pointerEvents: "none"
};

function AlignmentSelect(props) {
  return (
    <div className="row">
      <div className="col-sm-9 col-sm-offset-3">
        <div className="btn-group btn-group-justified" role="group">
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-default"
              style={buttonStyle}
              value="left"
              onClick={props.onClick}>
                <span
                  className="glyphicon glyphicon-align-left"
                  aria-hidden="true"
                  style={iconStyle}>
                </span>
            </button>
          </div>
          <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-default"
            style={buttonStyle}
            value="stretch"
            disabled
            onClick={props.onClick}>
              <span
                className="glyphicon glyphicon-align-justify"
                style={iconStyle}>
              </span>
          </button>
          </div>
          <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-default"
            style={buttonStyle}
            value="right"
            onClick={props.onClick}>
              <span
                className="glyphicon glyphicon-align-right"
                style={iconStyle}>
              </span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

AlignmentSelect.propTypes = {
  onClick: PropTypes.func.isRequired
};

module.exports = AlignmentSelect;
