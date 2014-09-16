module.exports = exp = {}

M = {
  logo: require 'agchart/components/logo'
}

exp.onClick = (context, selector, conf) ->
  # Replace logo by copyright text
  image = context._CLASS.logo.getDOM().root.remove()
  text = context._SVG.append("text")
    .attr("fill", conf.copyright.color)
    .attr("font-size", conf.copyright.fontSize+"px")
    .text(conf.copyright.text)

  # Remove the legends that are hidden.
  $(context._CLASS.legend.getDOM().root.node()).find(".legend.option").hide()
  $(context._CLASS.legend.getDOM().root.node()).find(".legend[data-hide='true']").hide()

  width = context._CONF.canvas.width
  height = context._CONF.canvas.height
  textDim = text.node().getBBox()
  pX = width-context._CONF.canvas.padding[0]-10
  pY = height-context._CONF.canvas.padding[1]-3
  text.attr("text-anchor", "end")
  text.attr("transform", "translate(#{pX}, #{pY})")

  # Converting the SVG to a canvas
  svg = $(selector).find("svg")[0]
  svg_xml = (new XMLSerializer()).serializeToString(svg)
  canvas = document.createElement('canvas')
  $("body").after(canvas)
  canvg(canvas, svg_xml)
  $(canvas).remove()

  # Convert canvas to PNG
  img = canvas.toDataURL("image/png")

  # Internet explorer can't save data URI scheme
  ua = window.navigator.userAgent
  msie = ua.indexOf("MSIE ")
  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
    console.log "Internet explorer detected"
    window.winIE = win = window.open()
    win.document.body.innerHTML = "<center><img src='"+img+"'>"+
      "</img><br>Please right click on the image and choose 'Save image as...'</center>"
    win.document.close()
    #setTimeout('window.winIE.document.execCommand("SaveAs")', 1000)
  else
    a = document.createElement('a')
    a.href = img
    a.download = "agflow.png"
    $("body").append(a)
    a.click()

  # Trick: we need to re-render the logo
  context._CLASS.logo = new M.logo.Main(context._SVG)
  context._CLASS.logo.render(
    confCanvas: context._CONF.canvas
    confLogo: context._CONF.logo
    style: context._CONF.style.logo
  )
  text.remove()

  # Show the options of the legend
  $(context._CLASS.legend.getDOM().root.node()).find(".legend.option").show()
  $(context._CLASS.legend.getDOM().root.node()).find(".legend[data-hide='true']").show()
