var React = require("react");
var PropTypes = React.PropTypes;
var MapContainer = require("./MapContainer");
var BrowserContainer = require("./BrowserContainer");
//var ControlsContainer = require("./ControlsContainer");

var domain = {x: [0, 30], y: [0, 100]};

var MainContainer = React.createClass ({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.object).isRequired
  },
  render: function () {
    return (
      <div className="container-fluid well well-sm">
        <div className="row">
          <div className="col-md-3 text-center">
            <MapContainer
              data={this.props.data}
              domain={domain} />
          </div>
          <div className="col-md-6 text-center">
            <BrowserContainer
              data={this.props.data}
              domain={domain} />
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
