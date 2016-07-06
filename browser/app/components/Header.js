var React = require("react");
var PropTypes = React.PropTypes;

function Header(props) {
  return <h1>{props.header}</h1>
}

Header.propTypes = {
  header: PropTypes.string.isRequired
};

module.exports = Header;
