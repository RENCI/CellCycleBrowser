var React = require("react");
var PropTypes = React.PropTypes;
var ProfileSelectContainer = require("../containers/ProfileSelectContainer");
var ProfileDescription = require("../components/ProfileDescription");

function Profile(props) {
  var description = props.profile.description ?
                    props.profile.description :
                    "";

  return (
        <div>
            <div>
              <ProfileSelectContainer />
              <ProfileDescription description={description} />
            </div>
            <div>
              <a href="/add_profile/login/">Add new profile</a>&nbsp;&nbsp;<a href="/delete_profile/login/">Delete profile</a>
            </div>
        </div>

  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired
};

module.exports = Profile;
