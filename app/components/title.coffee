# Render the title of the chart with specific parameters
module.exports = exp = {}
M = {
  style : require 'ylchart/utils/style'
}

exp.Main = class Main
  constructor: (svg) ->
    @boxTitle   = svg.append("g")
    @texts = []

  getDOM: ->
    return {
      root:     @boxTitle
      texts: @texts
    }

  render: (params) ->
    confCanvas  = params.confCanvas
    confTitle   = params.confTitle
    style       = params.style
    posX = confTitle.position.x
    posY = confTitle.position.y
    nextPos = [posX, posY]
    @texts = []
    # TODO: add generic style params to the children
    # so we would have the choice to have defaults params or not
    for obj, i in confTitle.texts
      boxText = @boxTitle.append("text")
      new M.style.Main(boxText).apply(style[i])
          .attr("y", nextPos[1])
          .attr("class", confTitle.class)
          .attr("font-family", confTitle.fontFamily)
          .text(obj.text)
      dimText = boxText.node().getBBox()
      nextPos[1] = nextPos[1]+dimText.height+(obj.interline || 0)
      @texts.push {node: boxText, dim: dimText}

    @boxTitle.attr("transform", "translate(#{posX},
      #{posY+@texts[0].dim.height/2})")
