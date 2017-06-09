var React = require("react");
var Header = require("./Header");

function HeaderSection() {
  return (
    <div className="row well">
      <div className="media">
        <div className="media-left media-middle text-center" style={{width:"25%"}}>
          <a href="http://www.med.unc.edu/genetics/purvislab">
            <img
              src="/static/cc_core/images/ccb_logo_alpha_cropped.png"
              style={{height: 100}} />
          </a>
        </div>
        <div className="media-body media-middle text-center">
          <Header header="Cell Cycle Browser" />
          <a style={{marginRight: 20}} href="/about/" target="_blank">About</a>
          <a style={{marginRight: 20}} href="/team/" target="_blank">Team</a>
          <a href="/help/" target="_blank">Help</a>
        </div>
        <div
          className="media-right media-middle text-center"
          style={{width:"25%", height: 100}}>
          <div>
            <a href="http://www.unc.edu/">
              <img
                src="/static/cc_core/images/medium_blue_450px.png"
                style={{height: 60}} />
            </a>
          </div>
          <div>
            <a href="http://renci.org/">
              <img
                src="/static/cc_core/images/RENCI-Official-Logo-No-Tagline-cropped-alpha.png"
                style={{height: 40}} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

module.exports = HeaderSection;
