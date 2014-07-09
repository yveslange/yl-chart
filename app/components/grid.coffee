module.exports = exp = {}

exp.Main = class Main
  constructor: (svg) ->
    @_GRID = svg.append("g")

  getDOM: ->
    return {root:@_GRID}

  render: (params) ->
    confCanvas = params.confCanvas
    confAxis = params.confAxis

    tickSize = confAxis.tickSize
    if tickSize == 'full'
      if confAxis.orient == 'bottom' or confAxis.orient == 'top'
        tickSize =  confCanvas.height-confCanvas.padding[1]*2
      else
        tickSize = -confCanvas.width+confCanvas.padding[0]*2

    switch confAxis.orient
      when 'bottom'
        trans = "translate(0, #{confCanvas.padding[1]})"
      when 'top'
        trans = "translate(0, #{confCanvas.height-confCanvas.padding[1]})"
      when 'right'
        trans = "translate(#{confCanvas.width-confCanvas.padding[0]}, 0)"
      when 'left'
        trans = "translate(#{confCanvas.padding[0]}, 0)"
      else
        trans = ''
        throw new Error("Unknown orientation: ", confAxis.orient)

    grid = d3.svg.axis()
      .scale(params.scale)
      .orient(confAxis.orient)
      .tickSize(tickSize)

    grid.ticks(confAxis.ticks) if confAxis.ticks != "auto"

    if confAxis.format?
      grid.tickFormat(
        d3.time.format(confAxis.format)
      )
      if confAxis.ticks == "auto"
        grid.ticks(d3.time.months.utc, 1)
      else
        grid.ticks(d3.time.months.utc, params.ticks)

    @_GRID
      .attr("transform", trans)
      .attr("class", "axis #{confAxis.className}")
      .call(grid)

    # Selecting the ticks only without the first one
    @_GRID.selectAll("line")
      .attr("stroke", confAxis.tickColor)
      .attr("width-stroke", confAxis.tickWidth)

    # Color of the text on axis
    @_GRID.selectAll("text")
      .attr("fill", confAxis.font.color)
      .attr("font-size", confAxis.font.size)
      .attr("font-weight", confAxis.font.weight)

    # Trick to hide the path around the graph
    @_GRID.selectAll("path")
      .style("display", "none")
