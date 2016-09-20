var slice = require("./array").slice;
var constant = require("./constant");
var math = require("./math");
var cos = math.cos;
var halfPi = math.halfPi;
var sin = math.sin;
var d3 = require("d3");
var path = d3.path;

function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

module.exports = function() {
  var source = defaultSource,
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      context = null;

  function ribbonCenterLine() {
    var buffer,
        argv = slice.call(arguments),
        s = source.apply(this, argv),
        t = target.apply(this, argv),
        sr = +radius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - halfPi,
        sa1 = endAngle.apply(this, argv) - halfPi,
        samid = (sa0 + sa1) / 2,
        sx = sr * cos(samid),
        sy = sr * sin(samid),
        tr = +radius.apply(this, (argv[0] = t, argv)),
        ta0 = startAngle.apply(this, argv) - halfPi,
        ta1 = endAngle.apply(this, argv) - halfPi,
        tamid = (ta0 + ta1) / 2,
        tx = tr * cos(tamid),
        ty = tr * sin(tamid);;

    if (!context) context = buffer = path();

    context.moveTo(sx, sy);
    context.quadraticCurveTo(0, 0, tx, ty);

    if (buffer) return context = null, buffer + "" || null;
  }

  ribbonCenterLine.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), ribbonCenterLine) : radius;
  };

  ribbonCenterLine.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), ribbonCenterLine) : startAngle;
  };

  ribbonCenterLine.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), ribbonCenterLine) : endAngle;
  };

  ribbonCenterLine.source = function(_) {
    return arguments.length ? (source = _, ribbonCenterLine) : source;
  };

  ribbonCenterLine.target = function(_) {
    return arguments.length ? (target = _, ribbonCenterLine) : target;
  };

  ribbonCenterLine.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), ribbonCenterLine) : context;
  };

  return ribbonCenterLine;
}
