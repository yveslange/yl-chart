module.exports = exp = {}
M = {
  label:    require 'agchart/components/label'
}
exp.Main = class Main
  constructor: (svg) ->
    @_GRID = svg.append("g")
    @_LABEL = new M.label.Main(svg)

  render: (params) ->
    grid = d3.svg.axis()
      .scale(params.scale)
      .orient(params.orient)
      .tickSize(params.tickSize)

    if params.ticks != "auto"
      grid.ticks(params.ticks)

    if params.format?
      if params.ticks == "auto"
        grid.ticks(d3.time.months.utc, 1)
      else
        grid.ticks(d3.time.months.utc, params.ticks)
      grid.tickFormat(
        d3.time.format(params.format)
      )

    @_GRID
      .attr("transform", params.trans)
      .attr("class", "axis #{params.class}")
      .call(grid)


    @_GRID.selectAll("line")
      .attr("stroke", params.color)
      .attr("stroke-width", params.strokeWidth)

    # Selecting the ticks only without the first one
    @_GRID.selectAll("line")
      .attr("stroke", params.tickColor)
      .attr("width-stroke", params.tickWidth)

    # Trick to hide the path around the graph
    @_GRID.selectAll("path")
      .style("display", "none")

    # Color of the text on axis
    @_GRID.selectAll("text")
      .attr("fill", params.fontColor)
      .attr("font-size", params.fontSize)
      .attr("font-weight", params.fontWeight)

    # TODO: move this out of here :(
    @_LABEL.render(params)
