# Render the title of the chart with specific parameters
module.exports = exp = {}
exp.Main = class Main
  constructor: (svg) ->
    @boxTitle   = svg.append("g")
    @boxText    = @boxTitle.append("text")
    @boxBorder  = @boxTitle.append("rect")

  getDOM: ->
    return {
      root:   @boxTitle
      border: @boxBorder
      text:   @boxText
    }

  render: (params) ->
    confCanvas = params.confCanvas
    confTitle = params.confTitle
    posX = confTitle.position.x
    posY = confTitle.position.y
    @boxTitle
    @boxText = @boxTitle
      .attr("transform", "translate(#{posX},#{posY})")
      .append("text")
        .attr("class", "chart-title")
        .attr("fill", confTitle.color)
        .attr("font-size", confTitle.size)
        .attr("font-weight", "bold")
        .attr("font-family", confTitle.fontFamily)
        .text(confTitle.text)
    textDim = @boxText.node().getBBox()
    @boxText
      .attr("x", confTitle.border.padding[0])
      .attr("y", textDim.height-confTitle.border.padding[1]-2)
    if confTitle.text
      @boxBorder
        .attr("width", textDim.width+confTitle.border.padding[0]*2)
        .attr("height", textDim.height+confTitle.border.padding[1]*2)
        .attr("ry", confTitle.border.radius)
        .attr("rx", confTitle.border.radius)
        .attr("stroke", confTitle.border.color)
