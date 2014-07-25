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
  confDomain = args.confDomain
  if domain.maxX == domain.minX
    domain.maxX += confDomain.x.margin
    domain.minX -= confDomain.x.margin
  if domain.maxY == domain.minY
    domain.maxY += confDomain.y.margin
    domain.minY -= confDomain.y.margin
