var React = require("react");
var PropTypes = React.PropTypes;
var Species = require("../components/Species");

function BrowserArea(props) {
  var speciesData = props.cellData.length > 0
                  ? props.cellData[0].species
                  : [];

  var species = speciesData.map(function (species, i) {
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
  cellData: PropTypes.arrayOf(PropTypes.object).isRequired
};

module.exports = BrowserArea;
