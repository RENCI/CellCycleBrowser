var React = require("react");
var PropTypes = React.PropTypes;

var buttonStyle = {
  height: 20,
  padding: 0
}

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
                Left
            </button>
          </div>
          <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-default"
            style={buttonStyle}
            value="stretch"
            onClick={props.onClick}>
              Stretch
          </button>
          </div>
          <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-default"
            style={buttonStyle}
            value="right"
            onClick={props.onClick}>
              Right
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
