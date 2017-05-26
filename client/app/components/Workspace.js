var React = require("react");
var PropTypes = React.PropTypes;
var WorkspaceSelectContainer = require("../containers/WorkspaceSelectContainer");
var WorkspaceDescription = require("../components/WorkspaceDescription");
var WorkspaceAddDelete = require("../components/WorkspaceAddDelete");

var outerStyle = {
  marginTop: -1,
  marginBottom: -1
};

var divStyle = {
  marginLeft: 20,
  marginRight: 20
};

function Workspace(props) {
  var description = props.workspace.description ?
                    props.workspace.description :
                    "";

  return (
    <div className="text-center form-inline" style={outerStyle}>
      <div className="form-group" style={divStyle}>
        <WorkspaceSelectContainer />
      </div>
      <div className="form-group" style={divStyle}>
        <WorkspaceDescription description={description} />
      </div>
      <div className="form-group" style={divStyle}>
        <WorkspaceAddDelete />
      </div>
    </div>
  );
}

Workspace.propTypes = {
  workspace: PropTypes.object.isRequired
};

module.exports = Workspace;
