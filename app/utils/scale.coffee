module.exports = exp = {}
M = {
  domain: require 'utils/domain'
}

# Computes D3JS Scales for X and Y
exp.computeScales = computeScales = (args)->
  _axis   = args.confAxis
  _domain = args.domain
  _canvas = args.confCanvas
  _pad    = _canvas.padding

  # WARN: care we changed from width to x and from height to y !
  scales = {x: d3.scale.linear(), y: d3.scale.linear()}

  scales.x = d3.time.scale.utc() if _axis.x.format?
  scales.x.domain([_domain.minX,_domain.maxX]).range([_pad[0], _canvas.width-_pad[0]])
  scales.x.nice() if _canvas.scale.x.nice

  scales.y = d3.time.scale() if _axis.y.format?
  scales.y.domain([_domain.minY,_domain.maxY]).range([_canvas.height-_pad[1], _pad[1]])
  scales.y.nice()if _canvas.scale.y.nice

  return scales

