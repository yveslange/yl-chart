module.exports = exp = {}

exp.Main = class Main
  constructor: (svg) ->
    @_MENU = $("<div/>", {
      id: "pluginsMenu"
    }).appendTo(svg)
    @_PLUGINSDOM = {}
  getDOM: ->
    return {root: @_MENU, plugins: @_PLUGINSDOM}

  render: (PARAMS) ->
    pluginsMenu = @_MENU
    pluginsMenu.css({
      "position": "absolute"
      "left": PARAMS.canvas.width+1
      "top": "0px"
      "opacity": 0.1
    })
    pluginsMenu.on("mouseover.menuPlugin", ()->
      pluginsMenu.animate({opacity: 1}, 10))
    pluginsMenu.on("mouseout.menuPlugin", ()->
      pluginsMenu.animate({opacity: 0.1}, 10))

    for plugin of PARAMS.confPlugins
      if PARAMS.confPlugins[plugin].enable
        icon = $("<img/>",{
          src: "#{PARAMS.iconsFolder}/#{plugin}.png"
          title: PARAMS.confPlugins[plugin].displayName
          width: "30px"
        }).appendTo(pluginsMenu)
        icon.css({cursor: "pointer"})
        pluginModule = require 'plugins/'+plugin
        callback = pluginModule.onClick
        context = PARAMS.context
        icon.click(-> callback(context, PARAMS.canvas.selector,
          PARAMS.confPlugins[plugin]))
        @_PLUGINSDOM[plugin] = icon

