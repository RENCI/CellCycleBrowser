var React = require("react");
var PropTypes = React.PropTypes;
var MultiSelect = require("./MultiSelect");

var tdStyle = {
  verticalAlign: "middle"
};

var labelStyle = {
  fontWeight: "normal !important"
};

function DatasetSelect(props) {
  function option(option, i) {
    var features = option.features ?
      option.features.filter(function (feature) {
        return feature.name.indexOf("SphaseClassification") === -1;
      }).map(function (feature, i) {
        return {
          name: feature.name,
          value: feature.name + ":" + option.id,
          selected: feature.active
        };
      }) : [];

    var labelClass = option.active ? null : "text-muted active";

    return (
      <tr key={i} className={labelClass}>
        <td style={tdStyle}>
          {option.default ?
            <span className="glyphicon glyphicon-star" /> :
            null}
        </td>
        <td style={tdStyle}>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                defaultChecked={option.active}
                data-value={option.id} />
              {option.name}
            </label>
          </div>
        </td>
        <td className="small text-muted" style={tdStyle}>
          {option.description}
        </td>
        <td style={tdStyle}>
          {option.active ?
            <MultiSelect
              label="Features: "
              labelStrong={false}
              options={features}
              enabled={option.active}
              minSelected={1} />
          : null}
        </td>
        <td style={tdStyle}>
          {option.active ?
            <a
              href={'/cell_data_meta/' + option.fileName + '/'}
              target="_blank">
              metadata
            </a>
          : null}
        </td>
        <td style={tdStyle}>
          {option.active ?
            <a
              href={'/download/' + option.fileName + '/'}>
              download
            </a>
          : null}
        </td>
      </tr>
    );
  }

  return (
    <div>
      <strong>
        {"Datasets: "}
      </strong>
      <button
        type="button"
        className="btn btn-default"
        data-toggle="popover"
        data-container="body"
        data-html="true"
        data-placement="bottom"
        data-trigger="manual"
        onClick={props.onClick}>
        Select <span className="caret"></span>
      </button>
      <div className="hidden">
        <table className={"table table-hover table-condensed"}>
          <tbody>
            {props.options.map(option)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DatasetSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func.isRequired
};

module.exports = DatasetSelect;
