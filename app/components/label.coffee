module.exports = exp = {}

exp.Main = class Main
  constructor: (svg) ->
    @_LABEL = svg.append("text")

  getDOM: ->
    return {root: @_LABEL}

  render: (params) ->
    return if not params?
    width   = params.width
    height  = params.height
    padding = params.padding
    offset  = params.label.offset || 0

    @_LABEL
      .attr("fill", params.label.color)
      .attr("class", "label #{params.class}")
      .attr("font-size", params.label.size+"px")
      .attr("text-anchor", params.label.textAnchor)
      .text(params.label.text)

    textDim = @_LABEL.node().getBBox()

    switch params.orient
      when 'bottom'
        trans = "translate(#{width/2},
          #{height-padding[1]+textDim.height+offset})"
      when 'top'
        trans = "translate(#{width/2}, #{height-2})"
      when 'left'
        trans = "translate(#{padding[0]}, 0)"
      when 'right'
        trans = "translate(#{width-padding[0]}, #{padding[1]/2})"

    @_LABEL.attr("transform", trans)
