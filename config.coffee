# Brunch.io configuration file
{name} = require './package'

exports.config =
  modules:
    nameCleaner: (path) ->
      "#{name}/#{path.replace(/^app\//, '')}"

  path:
    public: 'public'
  files:
    javascripts:
      joinTo:
        'js/vendor.js': /^vendor/
        'js/agchart.js': /^app/
    stylesheets:
      joinTo: 'css/agchart.css': /^app\/styles\//
