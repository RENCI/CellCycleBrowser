var React = require("react");
var PropTypes = React.PropTypes;
var MapContainer = require("./MapContainer");
var BrowserContainer = require("./BrowserContainer");
var ControlsContainer = require("./ControlsContainer");

var MainContainer = React.createClass ({
  propTypes: {
    data: PropTypes.object.isRequired
  },
  render: function () {
    return (
      <div className="container-fluid well well-sm">
        <div className="row">
          <div className="col-md-3 text-center">
            <MapContainer map={this.props.data.map} />
          </div>
          <div className="col-md-6 text-center">
            <BrowserContainer data={this.props.data.cells} />
            </div>
          <div className="col-md-3 text-center">
            <ControlsContainer />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MainContainer;
