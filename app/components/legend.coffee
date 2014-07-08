module.exports = exp = {}

exp.Main = class Main
  constructor: (svg) ->
    @_LEGENDS = svg.append("g")
    @_HIDEALL = false

  getDOM: ->
    return {root: @_LEGENDS}

  render:(params) ->
    SERIES = params.series
    SELECTOR = params.canvas.selector
    # TODO: add to configuration parameters
    rectWidth = params.legends.rect.width
    rectHeight = params.legends.rect.height
    textWidth = params.legends.text.width
    rectMargin = params.legends.margin

    # Width space available
    widthSpace = params.canvas.width-params.canvas.padding[0]*2

    posX = params.canvas.padding[0]-params.legends.padding[0]
    posY = params.canvas.height-params.legends.padding[1]
    @_LEGENDS.attr("transform", "translate(#{posX}, #{posY})")

    currentX = 0
    currentY = params.legends.padding[1]

    nbrLegends = SERIES.length-1
    nbrLegends++ if params.legends.toggleAll.show # Special options to toggle

    for i in [0..nbrLegends] by 1
      params.svg.attr("height", params.canvas.height+currentY)

      # Toggle for all hide
      if i == nbrLegends && params.legends.toggleAll.show
        legend = @drawLegend(@_LEGENDS, i, currentX, currentY,
          rectWidth, rectHeight, rectMargin,
          params.legends.toggleAll.color,
          params.legends.toggleAll.text)
        callback = @toggleSeries
      else
        serie = SERIES[i]
        color = serie.data[0].config.color
        text = serie.name
        if params.legends.format?
          text = params.legends.format(text)
        legend = @drawLegend(@_LEGENDS, i, currentX, currentY,
          rectWidth, rectHeight, rectMargin, color, text)
        callback = @toggleSerie

      # Update canvas height
      if currentX+rectWidth+textWidth+
          rectMargin > widthSpace-rectWidth-textWidth-rectMargin
        currentX = 0
        currentY += 15
      else
        currentX += rectWidth+textWidth+rectMargin

      # Careful, a closure is needed here !
      legend.on("click",
        ((scope, cb, index) ->
          return ->
            cb.call(this, scope, SELECTOR, index)
        )(@, callback, i)
      )

  drawLegend: (LEGENDS, i, currentX, currentY, rectWidth,
    rectHeight, rectMargin, color, text) ->
    legend = LEGENDS.append("g")
      .style("cursor", "pointer")
      .attr("transform", "translate(#{currentX}, #{currentY})")
      .attr("data-index", i)
      .attr("data-hide", "false")
      .attr("class", "legend")
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
    return legend

  toggleSerie: (scope, selector, index) ->
    opacity = $(@).find("rect").css("opacity")
    hide = @getAttribute("data-hide")
    if hide == "false"
      $(@).find("rect").fadeTo(100, 0.1)
      $(selector).find(".series#"+index).attr("data-hide", "true")
      @setAttribute("data-hide", "true")
    else
      $(@).find("rect").fadeTo(100, 1)
      $(selector).find(".series#"+index).attr("data-hide", "false")
      @setAttribute("data-hide", "false")
    $(selector).find(".series#"+index).toggle("normal")

  toggleSeries: (scope, selector) ->
    hide = !scope._HIDEALL
    scope._HIDEALL = hide
    if hide
      $(@).parent().find("rect").fadeTo(100, 0.1)
      $(selector).find(".series").hide("normal")
    else
      $(@).parent().find("rect").fadeTo(100, 1)
      $(selector).find(".series").show("normal")
    $(@).parent().find(".legend").attr("data-hide", hide)
    $(selector).find(".series").attr("data-hide", hide)

