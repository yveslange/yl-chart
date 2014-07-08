module.exports = exp = {}


# Update the obj1 with the obj2
exp.updateObject = updateObject = (obj1, obj2, replace=true) ->
  # Check if the obj is a node.
  isNode = (obj) ->
    if obj?["0"]?.nodeName? then true else false

  update = (obj1,obj2, replace=true) ->
    if obj2?
      for k of obj2
        if isNode(obj2[k]) # We copy the node as it is
          obj1[k] = obj2[k][0] ? obj1[k][0]
        else if typeof obj2[k] == 'object'
          obj1[k] = {} if not obj1[k]?
          update obj1[k], obj2[k], replace
        else
          if replace
            obj1[k] = obj2[k] ? obj1[k]
          else
            obj1[k] = obj1[k] ? obj2[k]
    return obj1
  update(obj1, obj2, replace)


# Prepare the series for the chart by adding
# some configuration options to individual points
exp.prepareSeries = prepareSeries = (args) ->
  throw new Error("No series defined, #{args.series}"+
    "should be an array of objects") if not args.series?.length?
  throw new Error("At least one serie must be defined") if args.series.length < 1
  for serie, i in args.series
    for point in serie.data
      point.serie = i
      point.config = { color: args.confPoint.color }
      if args.palette.isDefined() # Set the palette color
        point.config.color = args.palette.color(i)
      if serie.config?.color? # Override by specific serie color
        point.config.color = serie.config.color
      point.config.r = serie.config?.r || args.confPoint.r
      point.config.stroke = { width: args.confPoint.stroke.width }
      if serie.config?.stroke?.width? # Override by specific stroke width
        point.config.stroke.width = serie.config.stroke.width
  args.series
