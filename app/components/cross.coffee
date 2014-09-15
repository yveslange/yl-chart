module.exports = exp = {}
M = {
  style : require 'agchart/utils/style'
}

exp.Main = class Main
  constructor: (svg) ->
    @_CROSSPANEL = svg.append("g")
    @_CROSSX = @_CROSSPANEL.append("line")
    @_CROSSY = @_CROSSPANEL.append("line")
    @_VALUE = @_CROSSPANEL.append("g").style("opacity", 0)

  getDOM: ->
    return {
      root: @_CROSSPANEL
      crossX: @_CROSSX
      crossY: @_CROSSY
      value: @_VALUE
    }

  render: (params)->
    confCanvas  = params.confCanvas
    style       = params.style
    padX    = confCanvas.padding[0]
    padY    = confCanvas.padding[1]
    width   = confCanvas.width
    height  = confCanvas.height
    offsetX = params.confCross.x.offset
    offsetY = params.confCross.y.offset
    _crossX = @_CROSSX
    _crossY = @_CROSSY

    new M.style.Main(@_CROSSX).apply(style.x)
      .attr("x1", -width).attr("y1", padY)
      .attr("x2", -width).attr("y2", height-padY)
    new M.style.Main(@_CROSSY).apply(style.y)
      .attr("x1", padX).attr("y1", -height)
      .attr("x2", width-padX).attr("y2", -height)

    timeoutUnmoved = null
    params.svg.on("mousemove.cross", (d)->
      eventX = d3.mouse(@)[0]
      eventY = d3.mouse(@)[1]

      if eventY >= padY+offsetY and eventY <= height-padY-offsetY and
      eventX >= padX+offsetX and eventX <= width-padX-offsetX
        if params.confCross.x.show and
        eventX >= padX+offsetX and
        eventX <= width-padX-offsetX
          _crossX
            .attr("x1", eventX-offsetX)
            .attr("x2", eventX-offsetX)
        if params.confCross.y.show and eventY >= padY+offsetY and eventY <= height-padY-offsetY
          _crossY
            .attr("y1", eventY-offsetY)
            .attr("y2", eventY-offsetY)

        _crossX.transition().style('opacity', 1)
        _crossY.transition().style('opacity', 1)
        clearTimeout(timeoutUnmoved)
        # Detect unmoved mouse
        timeoutUnmoved = setTimeout(( ->
          _crossY.transition().duration(500).style('opacity', 0)
          _crossX.transition().duration(500).style('opacity', 0)
        ), 2000)
    )

  renderValue: (params)->
    style = params.style

    box = @_VALUE.append("rect")
    new M.style.Main(box).apply(style.background)

    text = @_VALUE.append("text")
    new M.style.Main(text).apply(style.text)
      .text("AgChartPile")
    textDim = text.node().getBBox()

    if params.confCrossV.x.show
      timeoutUnmoved = null
      VALUE = @_VALUE
      params.svg.on("mousemove.crossValue", ->
        eventX = d3.mouse(@)[0]
        eventY = d3.mouse(@)[1]

        # Detect unmoved mouse
        if d3.mouse(@)[1] >= params.confCanvas.padding[1] and
        d3.mouse(@)[1] <= params.confCanvas.height-params.confCanvas.padding[1] and
        d3.mouse(@)[0] >= params.confCanvas.padding[0] and
        d3.mouse(@)[0] <= params.confCanvas.width-params.confCanvas.padding[0]

          # Blocking the X value
          if eventX < params.confCanvas.padding[0]
            eventX = params.confCanvas.padding[0]
          else if eventX > params.confCanvas.width-params.confCanvas.padding[0]
            eventX = params.confCanvas.width-params.confCanvas.padding[0]

          # Blocking the position of the pile
          positionX = eventX
          if eventX < params.confCanvas.padding[0]+textDim.width/2
            positionX = params.confCanvas.padding[0]+textDim.width/2
          else if eventX > params.confCanvas.width-params.confCanvas.padding[0]-textDim.width/2
            positionX = params.confCanvas.width-params.confCanvas.padding[0]-textDim.width/2
          text
            .attr("y", textDim.height-textDim.height*0.25) # Seems that we need to remove 25%
                                                           # to have it centered. Auto magically
                                                           # resolved !
            .attr("x", textDim.width/2)
          box
            .attr("width", textDim.width)
            .attr("height", textDim.height)

          valueX = params.scale.x.invert(eventX)
          switch params.confCrossV.x.orient
            when 'top'
              eventY = params.confCanvas.padding[1]
            when 'bottom'
              eventY = params.confCanvas.height-params.confCanvas.padding[1]
          text.text(params.confCrossV.x.format(valueX))
          VALUE.attr("transform", "translate(#{positionX-textDim.width/2}, #{eventY})")
          VALUE.attr("cy", d3.mouse(@)[1])

          VALUE.transition().duration(300).style('opacity', 1)
          clearTimeout(timeoutUnmoved)
          timeoutUnmoved = setTimeout(( ->
            VALUE.transition().duration(500).style('opacity', 0)
          ), 2000)
      )
