var React = require("react");
//var MapContainer = require("./MapContainer");
//var BrowserContainer = require("./BrowserContainer");
//var ControlsContainer = require("./ControlsContainer");

var MainContainer = React.createClass ({
  render: function () {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 text-center well well-sm">
            <h2>Map</h2>
          </div>
          <div className="col-md-6 text-center well well-sm">
            <h2>Browser</h2>
          </div>
          <div className="col-md-3 text-center well well-sm">
            <h2>Controls</h2>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MainContainer;
