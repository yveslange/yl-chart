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
    posX = params.title.position.x
    posY = params.title.position.y
    @boxTitle
    @boxText = @boxTitle
      .attr("transform", "translate(#{posX},#{posY})")
      .append("text")
        .attr("class", "chart-title")
        .attr("fill", params.title.color)
        .attr("font-size", params.title.size)
        .attr("font-weight", "bold")
        .attr("font-family", params.title.fontFamily)
        .text(params.title.text)
    textDim = @boxText.node().getBBox()
    @boxText
      .attr("x", params.title.border.padding[0])
      .attr("y", textDim.height-params.title.border.padding[1]-2)
    if params.title.text
      @boxBorder
        .attr("width", textDim.width+params.title.border.padding[0]*2)
        .attr("height", textDim.height+params.title.border.padding[1]*2)
        .attr("ry", params.title.border.radius)
        .attr("rx", params.title.border.radius)
        .attr("stroke", params.title.border.color)
