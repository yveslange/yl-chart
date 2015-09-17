module.exports = exp = {}
M = {
  style : require 'ylchart/utils/style'
}

exp.Main = class Main
  constructor: (svg) ->
    @_GRID = svg.append("g")

  getDOM: ->
    return {root:@_GRID}

  render: (params) ->
    confCanvas  = params.confCanvas
    confGrid    = params.confGrid
    style       = params.style

    tickSize = confGrid.tick.size
    if tickSize == 'auto'
      if confGrid.orient == 'bottom' or confGrid.orient == 'top'
        tickSize =  confCanvas.height-confCanvas.padding[1]*2
      else
        tickSize = -confCanvas.width+confCanvas.padding[0]*2

    switch confGrid.orient
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
        throw new Error("Unknown orientation: ", confGrid.orient)

    grid = d3.svg.axis()
      .scale(params.scale)
      .orient(confGrid.orient)
      .tickSize(tickSize)

    if confGrid.tick.freq != "auto"
      grid.ticks(confGrid.tick.freq)

    if confGrid.format?
      grid.tickFormat(d3.time.format(confGrid.format))

      grid.ticks(d3.time.months.utc,
        if confGrid.tick.freq == "auto" then 1
        else confGrid.tick.freq
      )

    @_GRID
      .attr("transform", trans)
      .attr("class", "axis #{style.class}")
      .call(grid)

    # Selecting the ticks and apply style
    gridTicks = @_GRID.selectAll("line")
    new M.style.Main(gridTicks).apply(style.tick)

    # Color of the text on axis
    text = @_GRID.selectAll("text")
    new M.style.Main(text).apply(style.text)

    # Trick to hide the path around the graph
    @_GRID.selectAll("path").style("display", "none")
