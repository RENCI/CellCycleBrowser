var React = require("react");
var MapContainer = require("./MapContainer");
var BrowserContainer = require("./BrowserContainer");
//var ControlsContainer = require("./ControlsContainer");

// Dummy data
var mData = [
  {id: '5fbmzmtc', x: 7, y: 41, z: 6},
  {id: 's4f8phwm', x: 11, y: 45, z: 9},
];

var bData = [
  {id: '5fbmzmtc', x: 7, y: 41, z: 6},
  {id: 's4f8phwm', x: 6, y: 48, z: 3},
  {id: '5fbmzmtc', x: 14, y: 41, z: 6},
  {id: 's4f8phwm', x: 20, y: 50, z: 2},
];

var MainContainer = React.createClass ({
  getInitialState: function() {
    return {
      mData: mData,
      bData: bData,
      domain: {x: [0, 30], y: [0, 100]}
    };
  },
  render: function () {
    return (
      <div className="container-fluid well well-sm">
        <div className="row">
          <div className="col-md-3 text-center">
            <MapContainer
              data={mData}
              domain={this.state.domain} />
          </div>
          <div className="col-md-6 text-center">
            <BrowserContainer
              data={bData}
              domain={this.state.domain} />
            </div>
          <div className="col-md-3 text-center">
            <h2>Controls</h2>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MainContainer;
