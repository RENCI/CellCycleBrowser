var React = require("react");
var PropTypes = React.PropTypes;

function ProfileAddDelete(props) {
  return (
    <div>
      <a
        style={{marginRight: "20px"}}
        href="/add_profile/login/">
        Add profile
      </a>
      <a
        href="/delete_profile/login/">
        Delete profile
      </a>
    </div>
  );
}

module.exports = ProfileAddDelete;
