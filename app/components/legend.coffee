module.exports = exp = {}

exp.Main = class Main
  constructor: (svg) ->
    @_LEGENDS = svg.append("g")
    @_HIDEALL = false

  getDOM: ->
    return {root: @_LEGENDS}

  render:(params) ->
    confCanvas = params.confCanvas
    confLegends = params.confLegends

    SERIES = params.series
    SELECTOR = confCanvas.selector
    rectWidth = confLegends.rect.width
    rectHeight = confLegends.rect.height
    textWidth = confLegends.text.width
    rectMargin = confLegends.margin

    # Width space available
    widthSpace = confCanvas.width-confCanvas.padding[0]*2

    posX = confCanvas.padding[0]-confLegends.padding[0]
    posY = confCanvas.height-confLegends.padding[1]
    @_LEGENDS.attr("transform", "translate(#{posX}, #{posY})")

    currentX = 0
    currentY = confLegends.padding[1]
    nbrLegends = SERIES.length-1
    nbrLegends++ if confLegends.toggleAll.show # Special options to toggle

    for i in [0..nbrLegends] by 1
      params.svg.attr("height", confCanvas.height+currentY)

      # Toggle for all hide
      # TODO: better to create a function add legend than doing this tricky hard loop
      if i == nbrLegends && confLegends.toggleAll.show
        legend = @drawLegend(@_LEGENDS, i, currentX, currentY,
          rectWidth, rectHeight, rectMargin,
          confLegends.toggleAll.color,
          "legend option",
          confLegends.toggleAll.text[0])
        callback = @toggleSeries
      else
        serie = SERIES[i]
        color = serie.data[0].config.color
        text = serie.name
        if confLegends.format?
          text = confLegends.format(text)
        legend = @drawLegend(@_LEGENDS, i, currentX, currentY,
          rectWidth, rectHeight, rectMargin, color, "legend", text)
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
            cb.call(this, scope, SELECTOR, index, [legend, confLegends.toggleAll.text])
        )(@, callback, i)
      )

  drawLegend: (LEGENDS, i, currentX, currentY, rectWidth,
    rectHeight, rectMargin, color, className, text) ->
    legend = LEGENDS.append("g")
      .style("cursor", "pointer")
      .attr("transform", "translate(#{currentX}, #{currentY})")
      .attr("data-index", i)
      .attr("data-hide", "false")
      .attr("class", className)
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

  toggleSeries: (scope, selector, index, options) ->
    hide = !scope._HIDEALL
    scope._HIDEALL = hide
    if hide
      options[0].select("text").text(options[1][1])
      $(@).parent().find("rect").fadeTo(500, 0.1)
      $(selector).find(".series").hide("normal")
    else
      options[0].select("text").text(options[1][0])
      $(@).parent().find("rect").fadeTo(100, 1)
      $(selector).find(".series").show("normal")
    $(@).parent().find(".legend").attr("data-hide", hide)
    $(selector).find(".series").attr("data-hide", hide)

