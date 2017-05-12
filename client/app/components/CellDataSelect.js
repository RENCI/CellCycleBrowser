var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("./ItemSelect");

var tdStyle = {
  verticalAlign: "middle"
};

function handleCellDataChange(e) {
  console.log(e);
  console.log("celldata");
//      props.onSelectCellData(e.currentTarget.dataset.value);
}

function handleFeatureClick(e) {
  console.log(e);
  console.log("feature");
//      props.onSelectFeature(e.currentTarget.dataset.value);
}

function CellDataSelect(props) {
  function option(option, i) {
    var features = option.data.features.map(function (feature, i) {
      return (
        <li key={i}>
          <a
            href="#"
            data-name={feature}
            data-value={i}>
              {feature}
          </a>
        </li>
      );
    });

    return (
      <tr key={i}>
        <td style={tdStyle}>
          <input
            type="checkbox" />
        </td>
        <td style={tdStyle}>
          {option.data.name}
        </td>
        <td className="small text-muted" style={tdStyle}>
          {option.data.description}
        </td>
        <td style={tdStyle}>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-default dropdown-toggle"
              data-toggle="dropdown">
                Feature <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              {features}
            </ul>
          </div>
        </td>
        <td style={tdStyle}>
          <a
            href={'/cell_data_meta/' + option.data.fileName + '/'}
            target="_blank">
            metadata
          </a>
        </td>
      </tr>
    );
  }

/*
  var activeIndex = props.options.map(function(option) {
    return option.value;
  }).indexOf(props.activeValue);

  var activeName = activeIndex === -1 ? "" : props.options[activeIndex].name;
*/

  var popoverClass = "cellDataPopover";

  return (
    <div>
      <button
        type="button"
        className="btn btn-default"
        data-toggle="popover"
        data-html="true"
        data-placement="bottom"
        data-popover-content={"." + popoverClass}>
        Cell Data Select <span className="caret"></span>
      </button>
      <div className={"hidden " + popoverClass}>
        <table className="table table-hover table-condensed cellDataPopoverContent">
          <tbody>
            {props.options.map(option)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CellDataSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectCellData: PropTypes.func.isRequired,
  onSelectFeature: PropTypes.func.isRequired
};

module.exports = CellDataSelect;
