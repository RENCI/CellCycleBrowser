var React = require("react");
var PropTypes = React.PropTypes;
var ProfileSelectContainer = require("../containers/ProfileSelectContainer");
var ProfileDescription = require("../components/ProfileDescription");

function Profile(props) {
  var description = props.profile.description ?
                    props.profile.description :
                    "";

  return (
    <div className="row">
      <div className="col-md-6">
        <ProfileSelectContainer />
        <div style={{marginTop: "10px"}}>
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
      </div>
      <div className="col-md-6">
        <ProfileDescription description={description} />
      </div>
    </div>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired
};

module.exports = Profile;
