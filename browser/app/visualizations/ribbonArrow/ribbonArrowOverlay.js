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

function curve(p0, p1, p2, t) {
  return [
    (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
    (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
  ];
}

module.exports = function() {
  var source = defaultSource,
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      context = null;

  function ribbonArrowOverlay() {
    var buffer,
        argv = slice.call(arguments),
        s = source.apply(this, argv),
        t = target.apply(this, argv),
        sr = +radius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - halfPi,
        sa4 = endAngle.apply(this, argv) - halfPi,
        tr = +radius.apply(this, (argv[0] = t, argv)),
        ta0 = startAngle.apply(this, argv) - halfPi,
        ta4 = endAngle.apply(this, argv) - halfPi;

    if (!context) context = buffer = path();

    var aOffset = 1,
        sa2 = (sa0 + sa4) / 2,
        sa1 = sa2 * aOffset + sa0 * (1 - aOffset),
        sa3 = sa2 * aOffset + sa4 * (1 - aOffset),
        sx0 = sr * cos(sa0),
        sy0 = sr * sin(sa0),
        sx1 = sr * cos(sa1),
        sy1 = sr * sin(sa1),
        sx2 = sr * cos(sa2),
        sy2 = sr * sin(sa2),
        sx3 = sr * cos(sa3),
        sy3 = sr * sin(sa3),
        sx4 = sr * cos(sa4),
        sy4 = sr * sin(sa4),
        ta2 = (ta0 + ta4) / 2,
        ta1 = ta2 * aOffset + ta0 * (1 - aOffset),
        ta3 = ta2 * aOffset + ta4 * (1 - aOffset),
        tx0 = tr * cos(ta0),
        ty0 = tr * sin(ta0),
        tx1 = tr * cos(ta1),
        ty1 = tr * sin(ta1),
        tx2 = tr * cos(ta2),
        ty2 = tr * sin(ta2),
        tx3 = tr * cos(ta3),
        ty3 = tr * sin(ta3),
        tx4 = tr * cos(ta4),
        ty4 = tr * sin(ta4);

    var n = 10,
        delta = 1 / n,
        height = 0.2;

    var steps = d3.range(0, 1, delta - height / (n + 1));

    steps.forEach(function(d, i) {
      var p0 = curve([sx2, sy2], [0, 0], [tx2, ty2], d + delta * height),
          p1 = curve([sx4, sy4], [0, 0], [tx0, ty0], d),
          p2 = curve([sx4, sy4], [0, 0], [tx0, ty0], d + delta * height),
          p3 = curve([sx2, sy2], [0, 0], [tx2, ty2], d + delta * height * 2),
          p4 = curve([sx0, sy0], [0, 0], [tx4, ty4], d + delta * height),
          p5 = curve([sx0, sy0], [0, 0], [tx4, ty4], d);

      context.moveTo(p0[0], p0[1]);
      context.lineTo(p1[0], p1[1]);
      context.lineTo(p2[0], p2[1]);
      context.lineTo(p3[0], p3[1]);
      context.lineTo(p4[0], p4[1]);
      context.lineTo(p5[0], p5[1]);
      context.lineTo(p0[0], p0[1]);
    });

    if (buffer) return context = null, buffer + "" || null;
  }

  ribbonArrowOverlay.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), ribbonArrowOverlay) : radius;
  };

  ribbonArrowOverlay.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), ribbonArrowOverlay) : startAngle;
  };

  ribbonArrowOverlay.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), ribbonArrowOverlay) : endAngle;
  };

  ribbonArrowOverlay.source = function(_) {
    return arguments.length ? (source = _, ribbonArrowOverlay) : source;
  };

  ribbonArrowOverlay.target = function(_) {
    return arguments.length ? (target = _, ribbonArrowOverlay) : target;
  };

  ribbonArrowOverlay.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), ribbonArrowOverlay) : context;
  };

  return ribbonArrowOverlay;
}
