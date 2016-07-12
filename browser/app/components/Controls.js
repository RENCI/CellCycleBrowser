var React = require("react");

function Controls(props) {
  return (
    <div className="form-group">
      <label htmlFor="slider" className="col-sm-2 control-label"> Test: </label>
        <div className="col-sm-10">
          <input type="range" name="slider" />
        </div>
    </div>
  );
}

module.exports = Controls;
