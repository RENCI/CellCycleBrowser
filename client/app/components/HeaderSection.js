var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("./Header");

function HeaderSection(props) {
  return (
    <div className="row well">
      <div className="media">
        <div className="media-left media-middle text-center" style={{width:"25%"}}>
          <img
            src="/static/cc_core/images/cells.gif"
            style={{width: "40%"}} />
        </div>
        <div className="media-body media-middle text-center">
          <Header header="Cell Cycle Browser" />
        </div>
        <div className="media-right media-middle text-center" style={{width:"25%"}}>
          <div>
          <img
            src="/static/cc_core/images/medium_blue_450px.png"
            style={{width: "60%"}} />
          </div>
          <div>
          <img
            src="/static/cc_core/images/RENCI-Official-Logo-No-Tagline-cropped-alpha.png"
            style={{width: "30%"}} />
            </div>
        </div>
      </div>
    </div>
  );
}

HeaderSection.propTypes = {
  profile: PropTypes.object.isRequired
};

module.exports = HeaderSection;
