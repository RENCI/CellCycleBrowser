var React = require("react");

var iconStyle = {
  color: "#aaa"
};

function WorkspaceCreateDelete(props) {
  return (
    <div className="btn-group">
      <a
        href="/add_profile/login/"
        className="btn btn-default"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Create system workspace">
          <span
            className="glyphicon glyphicon-plus-sign"
            style={iconStyle} />
      </a>
      <a
        href="/add_user_workspace/"
        className="btn btn-default"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Create guest playground workspace">
          <span
            className="glyphicon glyphicon-user"
            style={iconStyle} />
      </a>
      <a
        href="/delete_profile/login/"
        className="btn btn-default"
        data-toggle="tooltip"
        data-container="body"
        data-placement="auto top"
        title="Delete workspace">
        <span
          className="glyphicon glyphicon-minus-sign"
          style={iconStyle} />
      </a>
    </div>
  );
}

module.exports = WorkspaceCreateDelete;
