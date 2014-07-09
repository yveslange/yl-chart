# Render the title of the chart with specific parameters
module.exports = exp = {}
exp.Main = class Main
  constructor: (svg) ->
    @boxTitle   = svg.append("g")
    @boxBorder  = @boxTitle.append("rect")
    @boxTexts   = @boxTitle.append("g")

  getDOM: ->
    return {
      root:     @boxTitle
      border:   @boxBorder
      texts:    @boxTexts
    }

  render: (params) ->
    confCanvas = params.confCanvas
    confTitle = params.confTitle
    posX = confTitle.position.x
    posY = confTitle.position.y
    nextPos = [posX, posY]
    texts = []
    for k, v of confTitle.texts
      boxText = @boxTexts
        .append("text")
          .attr("y", nextPos[1])
          .attr("class", "chart-title")
          .attr("fill", v.color)
          .attr("font-size", v.size)
          .attr("font-weight", v.weight)
          .attr("font-family", confTitle.fontFamily)
          .text(v.text)
      dimText = boxText.node().getBBox()
      nextPos[1] = nextPos[1]+dimText.height+(v.interline || 0)
      texts.push {node: boxText, dim: dimText}

    @boxTexts.attr("transform", "translate(#{posX},
      #{posY+texts[0].dim.height/2})")
