module.exports = exp = {}

exp.Main = class Main
  constructor: (svg) ->
    @_LABEL = svg.append("text")

  getDOM: ->
    return {root: @_LABEL}

  render: (params) ->
    confCanvas = params.confCanvas
    confLabel = params.confLabel

    offset  = confLabel.offset || 0

    @_LABEL
      .attr("fill", confLabel.color)
      .attr("class", "label #{confLabel.className}")
      .attr("font-size", confLabel.size+"px")
      .attr("text-anchor", confLabel.textAnchor)
      .text(confLabel.text)

    textDim = @_LABEL.node().getBBox()

    switch confLabel.orient
      when 'bottom'
        trans = "translate(#{confCanvas.width/2},
          #{confCanvas.height-confCanvas.padding[1]+textDim.height+offset})"
      when 'top'
        trans = "translate(#{confCanvas.width/2}, #{confCanvas.padding[1]-offset})"
      when 'left'
        trans =
          "rotate(-90) translate(#{-confCanvas.height/2}, #{confCanvas.padding[0]+10})"
      when 'right'
        trans =
          "translate(#{confCanvas.width-confCanvas.padding[0]}, #{confCanvas.padding[1]/2})"
      else
        trans = ''
        throw new Error("Unknown orientation: ", confLabel.orient)

    @_LABEL.attr("transform", trans)
