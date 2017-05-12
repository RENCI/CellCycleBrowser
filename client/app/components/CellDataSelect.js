var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("./ItemSelect");

var tdStyle = {
  verticalAlign: "middle"
};

function CellDataSelect(props) {
  function option(option, i) {
    var features = option.data.features.map(function (feature, i) {
      return (
        <li key={i}>
          <a
            href="#"
            data-feature={feature}
            data-celldata={option.data.name}>
              {feature}
          </a>
        </li>
      );
    });

    return (
      <tr key={i}>
        <td style={tdStyle}>
          <input
            type="checkbox"
            data-celldata={option.data.name} />
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

  var popoverContentClass = "cellDataPopoverContent";

  return (
    <div>
      <button
        type="button"
        className="btn btn-default"
        data-toggle="popover"
        data-html="true"
        data-placement="bottom"
        data-popover-content={"." + popoverContentClass}>
        Cell Data Select <span className="caret"></span>
      </button>
      <div className={"hidden " + popoverContentClass}>
        <table className={"table table-hover table-condensed " + props.popoverBodyClass}>
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
  popoverBodyClass: PropTypes.string.isRequired
};

module.exports = CellDataSelect;
