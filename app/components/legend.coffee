module.exports = exp = {}

exp.Main = class Main
  constructor: (svg) ->
    @_LEGENDS = svg.append("g")

  getDOM: ->
    return {root: @_LEGENDS}

  render:(params) ->
    SERIES = params.series
    SELECTOR = params.canvas.selector
    # TODO: add to configuration parameters
    rectWidth = 10
    rectHeight = 10
    textWidth = 50
    rectMargin = 5

    # Width space available
    widthSpace = params.canvas.width-params.canvas.padding[0]*2

    posX = params.canvas.padding[0]
    posY = params.canvas.height-12
    @_LEGENDS.attr("transform", "translate(#{posX}, #{posY})")

    currentX = 0
    currentY = 15
    for i, serie of SERIES
      params.svg.attr("height", params.canvas.height+currentY)
      i = parseInt(i)
      color = serie.data[0].config.color
      text = serie.name
      if params.legends.format?
        text = params.legends.format(text)
      legend = @_LEGENDS.append("g")
        .style("cursor", "pointer")
        .attr("transform", "translate(#{currentX}, #{currentY})")
        .attr("data-serieIndex", i)
        .attr("data-hide", "false")
      rect = legend.append("rect")
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("fill", color)
        .attr("stroke", "#afafaf")
        .attr("stroke-width", "1")
        .attr("rx", 5)
        .attr("ry", 5)
      legend.append("text")
        .attr("x", rectMargin+rectWidth)
        .attr("y", rectHeight-1)
        .attr("fill", color)
        .attr("font-size", 10)
        .text(text)
      if currentX+rectWidth+textWidth+
      rectMargin > widthSpace-rectWidth-textWidth-rectMargin
        currentX = 0
        currentY += 15
        # Update canvas height
      else
        currentX += rectWidth+textWidth+rectMargin
      callback = @onClick
      legend.on("click", ()  -> callback(@, SELECTOR))

  onClick: (SCOPE, selector) ->
    opacity = $(SCOPE).css("opacity")
    serie = SCOPE.getAttribute("data-serieIndex")
    hide = SCOPE.getAttribute("data-hide")
    if hide == "false"
      $(SCOPE).find("rect").fadeTo(100, 0.1)
      $(selector).find(".series#"+serie)[0].setAttribute("data-hide", "true")
      SCOPE.setAttribute("data-hide", "true")
    else
      $(SCOPE).find("rect").fadeTo(100, 1)
      $(selector).find(".series#"+serie)[0].setAttribute("data-hide", "false")
      SCOPE.setAttribute("data-hide", "false")
    $(selector).find(".series#"+serie).toggle("normal")


