var React = require("react");
var PropTypes = React.PropTypes;

function ProfileAddDelete(props) {
  return (
    <div>
      <a
        href="/add_profile/login/">
        Add profile
      </a>
      <a
        style={{marginLeft: "10px"}}
        href="/delete_profile/login/">
        Delete profile
      </a>
    </div>
  );
}

module.exports = ProfileAddDelete;
