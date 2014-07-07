module.exports = exp = {}

exp.Main = class Main
  constructor: (svg) ->
    @_CROSSX = svg.append("line")
    @_CROSSY = svg.append("line")

  render: (params)->
    padX    = params.confCanvas.padding[0]
    padY    = params.confCanvas.padding[1]
    offsetX = params.confCross.x.offset
    offsetY = params.confCross.y.offset
    width   = params.confCanvas.width
    height  = params.confCanvas.height
    _crossX = @_CROSSX
    _crossY = @_CROSSY

    _crossX
      .attr("class", "crossX")
      .attr("x1", -width).attr("y1", padY)
      .attr("x2", -width).attr("y2", height-padY)
      .attr("stroke", params.confCross.x.color)
      .attr("stroke-width", params.confCross.x.stroke)
    _crossY
      .attr("class", "crossY")
      .attr("x1", padX).attr("y1", -height)
      .attr("x2", width-padX).attr("y2", -height)
      .attr("stroke", params.confCross.y.color)
      .attr("stroke-width", params.confCross.y.stroke)
    timeoutUnmoved = null
    params.svg.on("mousemove.tooltip", (d)->
      clearTimeout(timeoutUnmoved)
      _crossX.transition().style('opacity', 1)
      _crossY.transition().style('opacity', 1)
      eventX = d3.mouse(@)[0]
      eventY = d3.mouse(@)[1]
      if params.confCross.x.show and
      eventX >= padX+offsetX and
      eventX <= width-padX+offsetX
        _crossX
          .attr("x1", eventX-offsetX)
          .attr("x2", eventX-offsetX)
      if params.confCross.y.show and
      eventY >= padY+offsetY and
      eventY <= height-padY+offsetY
        _crossY
          .attr("y1", eventY-offsetY)
          .attr("y2", eventY-offsetY)
      # Detect unmoved mouse
      timeoutUnmoved = setTimeout(( ->
        _crossY.transition().duration(500).style('opacity', 0)
        _crossX.transition().duration(500).style('opacity', 0)
      ), 2000)
    )
