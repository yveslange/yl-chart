module.exports = exp = {}

exp.Main = class Main
  constructor: (selector) ->
    @_MENU = $("<div/>", {
      id: "pluginsMenu"
    }).appendTo(selector)
    @_PLUGINSDOM = {}

  getDOM: ->
    return {root: @_MENU, plugins: @_PLUGINSDOM}

  render: (PARAMS) ->
    confCanvas  = PARAMS.confCanvas
    style       = PARAMS.style
    pluginsMenu = @_MENU

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
        context = PARAMS.context
        # Note: i don't get why we need to bind it here but
        # it's not working without it if you have more than one chart
        callback = pluginModule.onClick.bind(@, context,
          confCanvas.selector, PARAMS.confPlugins[plugin])
        icon.click( -> callback() )
        @_PLUGINSDOM[plugin] = icon

