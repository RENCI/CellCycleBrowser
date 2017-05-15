var React = require("react");
var PropTypes = React.PropTypes;

function ProfileAddDelete(props) {
  return (
    <div className="btn-group">
      <a
        href="/add_profile/login/"
        className="btn btn-default"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Add profile">
          <span className="glyphicon glyphicon-plus-sign"></span>
      </a>
      <a
        href="/delete_profile/login/"
        className="btn btn-default"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Delete profile">
        <span className="glyphicon glyphicon-minus-sign"></span>
      </a>
    </div>
  );
}

module.exports = ProfileAddDelete;
