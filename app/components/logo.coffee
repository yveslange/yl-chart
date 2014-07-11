module.exports = exp = {}
M = {
  style: require "agchart/utils/style"
}

exp.Main = class Main
  constructor: (svg, canvas) ->
    @_IMAGE = svg.append("image")

  getDOM: ->
    return {root: @_IMAGE}

  render: (params) ->
    confCanvas = params.confCanvas
    HEIGHT = confCanvas.height
    WIDTH = confCanvas.width
    PADDING = confCanvas.padding
    posX = posY = 100

    if params.logo.y == 'bottom'
      posY = HEIGHT-PADDING[1]-params.logo.height
    if params.logo.y == 'top'
      posY = PADDING[1]
    if params.logo.x == 'right'
      posX = WIDTH-PADDING[0]-params.logo.width
    if params.logo.x == 'left'
      posX = PADDING[0]

    new M.style.Main(@_IMAGE).apply(params.style)
      .attr("x", posX)
      .attr("y", posY)
