var React = require("react");
var PropTypes = React.PropTypes;
var ProfileSelectContainer = require("../containers/ProfileSelectContainer");
var ProfileDescription = require("../components/ProfileDescription");
var ProfileAddDelete = require("../components/ProfileAddDelete");

var outerStyle = {
  marginTop: -1,
  marginBottom: -1
};

var divStyle = {
  marginLeft: 20,
  marginRight: 20
};

function Profile(props) {
  var description = props.profile.description ?
                    props.profile.description :
                    "";

  return (
    <div className="text-center form-inline" style={outerStyle}>
      <div className="form-group" style={divStyle}>
        <ProfileSelectContainer />
      </div>
      <div className="form-group" style={divStyle}>
        <ProfileDescription description={description} />
      </div>
      <div className="form-group" style={divStyle}>
        <ProfileAddDelete />
      </div>
    </div>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired
};

module.exports = Profile;
