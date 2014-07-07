module.exports = exp = {}

exp.Main = class Main
  constructor: (svg, canvas) ->
    @_IMAGE = svg.append("image")

  getDOM: ->
    return {root: @_IMAGE}

  render: (params) ->
    HEIGHT = params.canvas.height
    WIDTH = params.canvas.width
    PADDING = params.canvas.padding
    posX = posY = 100

    if params.logo.y == 'bottom'
      posY = HEIGHT-PADDING[1]-params.logo.height
    if params.logo.y == 'top'
      posY = PADDING[1]
    if params.logo.x == 'right'
      posX = WIDTH-PADDING[0]-params.logo.width
    if params.logo.x == 'left'
      posX = PADDING[0]

    @_IMAGE.attr("width", params.logo.width)
      .attr("height", params.logo.height)
      .attr("x", posX)
      .attr("y", posY)
      .attr("opacity", params.logo.opacity)
      .attr("id", "logo")
      .attr("xlink:href", params.logo.url)
