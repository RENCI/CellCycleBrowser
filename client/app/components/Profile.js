var React = require("react");
var PropTypes = React.PropTypes;
var ProfileSelectContainer = require("../containers/ProfileSelectContainer");
var ProfileDescription = require("../components/ProfileDescription");
var ProfileAddDelete = require("../components/ProfileAddDelete");

function Profile(props) {
  var description = props.profile.description ?
                    props.profile.description :
                    "";

  return (
    <div className="row">
      <div className="col-md-6">
        <ProfileSelectContainer />
        <ProfileDescription description={description} />
      </div>
      <div className="col-md-6" style={{paddingTop: 5}}>
        <ProfileAddDelete />
      </div>
    </div>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired
};

module.exports = Profile;
