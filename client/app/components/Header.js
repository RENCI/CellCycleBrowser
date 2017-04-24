var React = require("react");
var PropTypes = React.PropTypes;

function Header(props) {
  return (
    <h2>
      <em className="text-info">Human </em>
      <strong>{props.header}</strong>
    </h2>
  );
}

Header.propTypes = {
  header: PropTypes.string.isRequired
};

module.exports = Header;
