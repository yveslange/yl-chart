# Render the tooltip and access to its methods to display/hide it
module.exports = exp = {}

exp.Main = class Main
  constructor: (selector) ->
    if not @_TOOLTIP?
      @_TOOLTIP = d3.select(selector).append("div")
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('left', 0)
        .style('top', 0)

  getDOM: () ->
    return {root: @_TOOLTIP}

  show: (context, conf, tooltipNode, d) ->
    tooltipNode.attr("width", 200).attr("height", 100)
    eventX = d3.mouse(context)[0]
    eventY = d3.mouse(context)[1]
    left = eventX+d.config.stroke.width
    top = eventY+d.config.stroke.width
    if conf.tooltip.alwaysInside
      if eventX > conf.canvas.width/2.0
        widthTooltip = parseFloat(
          tooltipNode.style('width').replace("px", ''))
        left = eventX-d.config.stroke.width-
          widthTooltip
      if eventY > conf.canvas.height/2.0
        heightTooltip = parseFloat(
          tooltipNode.style('height').replace("px", ''))
        top = eventY-d.config.stroke.width-
          heightTooltip
    tooltipNode
      .style("left", left+'px')
      .style("top", top+'px')
      .transition().duration(200).style("opacity", 0.9)

  hide: (tooltipNode) ->
    tooltipNode.transition()
      .duration(500).style("opacity", 0)

  getTemplate: (str) -> return @_templates[str]

  getCallback: (str) -> return @_callbacks[str]

  _templates:
    singlePoint: (data) ->
      html = "<h1>#{data[0].title}</h1>"
      html += "<div class='serie' id='0'>#{data[0].x} : #{data[0].y}"+
        "<div class='swatch'"+
          "style='background-color: #{data[0].color}'></div>"+
      "</div>"

    multipleVertical: (data) ->
      html = "<h1>#{data[0].x}</h1>"
      for d, i in data
        if not d.hide
          html += "<div class='serie' id='#{i}'>#{d.serieName} : #{d.y}"+
            "<div class='swatch'"+
              "style='background-color: #{d.color}'></div>"+
          "</div>"
      html
    multipleVerticalInverted: (data) ->
      html = "<h1>#{data[0].x}</h1>"
      for d, i in data
        if not d.hide
          html += "<div class='serie' id='#{i}'>#{d.serieName}: #{d.y}"+
            "<div class='swatch'"+
              "style='background-color: #{d.color}'></div>"+
          "</div>"
      html

  _callbacks:
    singlePoint:
      (params) ->
        _circleNode = params.circleNode
        x = parseFloat(_circleNode.getAttribute('data-x'))
        x = params.format.x(x) if params.format?.x?
        [{
          color: params.data.config.color
          serieName: params.circleNode.parentNode.getAttribute("title")
          x: x
          y: params.data.y.toFixed(2)
          hide: node.parentNode.getAttribute("data-hide") == "true"
        }]
    multipleVertical:
      (params) ->
        # Get all same cx value, take the fill color to
        # draw watch and show some information
        _circleNode = params.circleNode
        cx = _circleNode.getAttribute('cx')
        x = parseFloat(_circleNode.getAttribute('data-x'))
        if params.format?.x?
          x = params.format.x(x)

        title = parseInt(_circleNode.parentNode.getAttribute('title'))
        if params.format?.title?
          title = params.format.title(title)

        res = []
        $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
          res.push {
            title: title
            serieName: node.parentNode.getAttribute("title")
            color: node.getAttribute("data-color")
            y: parseFloat(node.getAttribute("data-y")).toFixed(2)
            x: x
            hide: node.parentNode.getAttribute("data-hide") == "true"
          })
        res

    multipleVerticalInverted:
      (params) ->
        # Get all same cx value, take the fill color to
        # draw watch and show some information
        _circleNode = params.circleNode
        cx = _circleNode.getAttribute('cx')
        x = parseFloat(_circleNode.getAttribute('data-x'))
        if params.format?.x?
          x = params.format.x(x)
        title = parseInt(_circleNode.parentNode.getAttribute('title'))
        if params.format?.title?
          title = params.format.title(title)
        res = []
        $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
          serieName = parseInt(node.parentNode.getAttribute("title"))
          if params.format?.serie?
            serieName = params.format.serie(serieName)
          res.push {
            title: title
            serieName: serieName
            color: node.getAttribute("data-color")
            y: parseFloat(node.getAttribute("data-y")).toFixed(2)
            x: x
            hide: node.parentNode.getAttribute("data-hide") == "true"
          })
        res