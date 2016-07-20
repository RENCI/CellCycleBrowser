var React = require("react");
var PropTypes = React.PropTypes;
var Species = require("../components/Species");

function BrowserArea(props) {
  var species = props.species.map(function (species, i) {
    return (
      <Species
        key={i}
        name={species.name}
        cells={species.cells} />
    );
  });

  return (
    <div>
      <h2>Browser</h2>
        {species}
    </div>
  );
}

BrowserArea.propTypes = {
  species: PropTypes.array.isRequired
};

module.exports = BrowserArea;
