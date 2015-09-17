module.exports = exp = {}
M = {
  style: require "ylchart/utils/style"
}

exp.Main = class Main
  constructor: (svg, canvas) ->
    @_IMAGE = svg.append("image")

  getDOM: ->
    return {root: @_IMAGE}

  render: (params) ->
    confCanvas = params.confCanvas
    HEIGHT  = confCanvas.height
    WIDTH   = confCanvas.width
    PADDING = confCanvas.padding
    confLogo = params.confLogo
    style = params.style
    posX = posY = 100

    if confLogo.position.y == 'bottom'
      posY = HEIGHT-PADDING[1]-style.height
    else if confLogo.position.y == 'top'
      posY = PADDING[1]
    if confLogo.position.x == 'right'
      posX = WIDTH-PADDING[0]-style.width
    else if confLogo.position.x == 'left'
      posX = PADDING[0]

    new M.style.Main(@_IMAGE).apply(params.style)
      .attr("x", posX)
      .attr("y", posY)
