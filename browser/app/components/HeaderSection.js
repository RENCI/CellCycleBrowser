var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("./Header");
var ProfileSelectContainer = require("../containers/ProfileSelectContainer");
var ProfileDescription = require("../components/ProfileDescription");

function HeaderSection(props) {
  var description = props.profile.description ?
                    props.profile.description :
                    "";

  return (
    <div className="jumbotron text-center">
      <Header header="Cell Cycle Browser" />
      <ProfileSelectContainer />
      <ProfileDescription description={description} />
    </div>
  );
}

HeaderSection.props = {
  profile: PropTypes.object.isRequired
};

module.exports = HeaderSection;
