var React = require("react");
var PropTypes = require("prop-types");

function Header(props) {
  return (
    <h2>
      <strong>{props.header}</strong>
    </h2>
  );
}

Header.propTypes = {
  header: PropTypes.string.isRequired
};

module.exports = Header;
