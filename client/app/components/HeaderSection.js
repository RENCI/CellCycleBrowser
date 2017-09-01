var React = require("react");
var Header = require("./Header");

function HeaderSection() {
  return (
    <div className="row well">
        <div className="col-sm-3 text-center">
          <a href="http://www.med.unc.edu/genetics/purvislab">
            <img
              src="/static/cc_core/images/ccb_logo_alpha_cropped.png"
              style={{height: 80}} />
          </a>
        </div>
        <div className="col-sm-6 text-center">
          <Header header="Cell Cycle Browser" />
          <a style={{marginRight: 20}} href="/about/" target="_blank">About</a>
          <a href="/help/" target="_blank">Tutorial</a>
        </div>
        <div className="col-sm-3 text-center">
          <div>
            <a href="http://www.unc.edu/">
              <img
                src="/static/cc_core/images/medium_blue_450px.png"
                style={{height: 50}} />
            </a>
          </div>
          <div>
            <a href="http://renci.org/">
              <img
                src="/static/cc_core/images/RENCI-Official-Logo-No-Tagline-cropped-alpha.png"
                style={{height: 30}} />
            </a>
          </div>
        </div>
    </div>
  );
}

module.exports = HeaderSection;
