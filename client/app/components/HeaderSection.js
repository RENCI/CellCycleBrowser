var React = require("react");
var Header = require("./Header");

function HeaderSection() {
  return (
    <div className="row well">
      <div className="media">
        <div className="media-left media-middle text-center" style={{width:"25%"}}>
          <img
            src="/static/cc_core/images/cells.gif"
            style={{height: "50px"}} />
        </div>
        <div className="media-body media-middle text-center">
          <Header header="Cell Cycle Browser" />
          <a style={{marginRight: 20}} href="/about/" target="_blank">About</a>
          <a href="/help/" target="_blank">Help</a>
        </div>
        <div className="media-right media-middle text-center" style={{width:"25%"}}>
          <img
            src="/static/cc_core/images/medium_blue_450px.png"
            style={{height: "70px", float: "left"}} />
          <img
            src="/static/cc_core/images/RENCI-Official-Logo-No-Tagline-cropped-alpha.png"
            style={{width: "80px", marginTop: 5, marginRight: 20}} />
        </div>
      </div>
    </div>
  );
}

module.exports = HeaderSection;
