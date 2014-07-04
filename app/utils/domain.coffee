module.exports = exp = {}

exp.computeDomain = getDomain = (series) ->
  maxX = maxY = Number.MIN_VALUE
  minX = minY = Number.MAX_VALUE
  for serie in series
    for point in serie.data
      maxX = point.x if point.x > maxX
      minX = point.x if point.x < minX
      maxY = point.y if point.y > maxY
      minY = point.y if point.y < minY
  {minX: minX, maxX: maxX, minY: minY, maxY: maxY}

# Fix the domain if minX == maxX and same for Y
exp.fixDomain = fixDomain = (args) ->
  domain   = args.domain
  confAxis = args.confAxis
  if domain.maxX == domain.minX
    domain.maxX += confAxis.x.domainMargin
    domain.minX -= confAxis.x.domainMargin
  if domain.maxY == domain.minY
    domain.maxY += confAxis.y.domainMargin
    domain.minY -= confAxis.y.domainMargin
