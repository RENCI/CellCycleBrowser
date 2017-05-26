var React = require("react");
var PropTypes = React.PropTypes;

function WorkspaceCreateDelete(props) {
  return (
    <div className="btn-group">
      <a
        href="/add_profile/login/"
        className="btn btn-default"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Create workspace">
          <span className="glyphicon glyphicon-plus-sign"></span>
      </a>
      <a
        href="/delete_profile/login/"
        className="btn btn-default"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Delete workspace">
        <span className="glyphicon glyphicon-minus-sign"></span>
      </a>
    </div>
  );
}

module.exports = WorkspaceCreateDelete;
