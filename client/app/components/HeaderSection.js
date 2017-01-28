var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("./Header");

function HeaderSection(props) {
  return (
    <div className="page-header well">
      <div className="media">
        <div className="media-left media-middle text-center" style={{width:"25%"}}>
          <img
            src="/static/cc_core/images/cells.gif"
            style={{height: "75px"}} />
        </div>
        <div className="media-body media-middle text-center">
          <Header header="Cell Cycle Browser" />
        </div>
        <div className="media-right media-middle text-center" style={{width:"25%"}}>
          <div>
          <img
            src="/static/cc_core/images/medium_blue_450px.png"
            style={{height: "70px"}} />
          </div>
          <div>
          <img
            src="/static/cc_core/images/RENCI-Official-Logo-No-Tagline-cropped-alpha.png"
            style={{height: "40px"}} />
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
