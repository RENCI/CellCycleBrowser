var React = require("react");

function Header(props) {
  return (
    <div className="page-header col-sm-12 text-center">
      <h1>{props.header}</h1>
    </div>
  );
}

module.exports = Header;
