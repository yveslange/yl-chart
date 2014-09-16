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
    confCanvas  = PARAMS.confCanvas
    style       = PARAMS.style
    pluginsMenu = @_MENU
    console.log style


    switch style.panel.position
      when "right"
        style.panel.position = "absolute"
        style.panel.left = confCanvas.width+1
      when "left"
        style.panel.position = "absolute"
        style.panel.left = 0
    pluginsMenu.css(style.panel)

    pluginsMenu.on("mouseover.menuPlugin", ()->
      pluginsMenu.animate({opacity: 1}, 10))
    pluginsMenu.on("mouseout.menuPlugin", ()->
      pluginsMenu.animate({opacity: style.panel.opacity}, 10))

    for plugin of PARAMS.confPlugins
      if PARAMS.confPlugins[plugin].enable
        icon = $("<i/>",{
          class: "fa fa-#{PARAMS.confPlugins[plugin].fa} fa-2x"
          title: PARAMS.confPlugins[plugin].displayName
        }).appendTo(pluginsMenu)
        icon.css({cursor: "pointer"})
        pluginModule = require 'agchart/plugins/'+plugin
        callback = pluginModule.onClick
        context = PARAMS.context
        icon.click(-> callback(context, confCanvas.selector,
          PARAMS.confPlugins[plugin]))
        @_PLUGINSDOM[plugin] = icon

