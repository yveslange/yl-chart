agChart
=======
Chart librairie for Web application with interactive options.

![Screenshot of AgChart](https://bitbucket.org/agflow/agchart/raw/master/docs/screenshot.png)

## Features
* Cross lines to help comparing values
* Cross values to have more precise overview on the axis values
* Legends with toggles for comparing series
* Tooltips when hovering dots
* Fadeout on series to avoid confusion while comparing series
* Easy multiple title configuration
* All style in non CSS (for the exported)
* Grid background to compare values
* Configurable axis (style, text, position, ...)
* Customizable labels for the axis
* Benchmark logo integration
* Interactive menu with custom options (plugins)
* Plugin: Exportation to PNG
* Easy to create a plugin !

## Installation (for developpers only)
* `pacman -S nodejs` to install NodeJS if you don't already have it.
* `make install` to install the tools needed to compile the chart

### JavaScript dependencies
* jQuery: ~2.1
* D3JS: ~3.3

*The dependencies are included in the projet*

## Compiling
`make build`: normal compilation with `*.map` and unminified javascript files. A unminified version will be copied to the release folder.

`make build-prod`: minified javascript version without `*.map`. A minified version will be copied to the release folder.


## Watch
`make watch`: watch changes with auto-reload script


# Initialization and usage
* Everything your need is located into the `release` folder.
* Import `vendor.js` file that contains the dependencies (*don't do this is you already imported d3js or jquery for example*)
* Import the CSS file `agchart.css` and the agchart library called `agchart.js`. This should be done in the headers of you HTML file (normally between `<head>` and `</head>`)

Here is a example of what you should find in the header section:
```HTML
<link rel="stylesheet" type="text/css" href="css/agchart.min.css" media="screen">
<script src="vendor.js" charset="utf-8"></script>
<script src="js/agchart.min.js" charset="utf-8"></script>
```

*Don't forget that `vendor.js` (or dependencies files) should be imported before importing agchart library*

** You can also import the none minified files by removing the `.min` suffixes **

Then you should be able to call the library like that:

```Javascript
agChart = new agChart.Main()
agChart.render()
```

or with a specific configuration

```Javascript
config = {...} // Described in the next section
agChart = new agChart.Main(config)
agChart.render()
```

The final step is to have a container that will contain the generated chart. You can add this between `<body>` and `</body>` in your HTML file for the purpose of this example:

```HTML
<div id='agchart'></div>
```

## Configuration
To configure the chart, it should be done when calling the agChart librairy. It's a simple javascript object that contains options.

### Basic configuration
Here is a example of a simple configuration:
```Javascript
config = {config:
  canvas:
    render: 'dotline'
    selector: '#agchart'
}
agChart = new agChart.Main(config)
agChart.render()
```

This simple and basic configuration should be passed to agChart and will render a simple chart without any data.

### Some datas
In this example we are going to create two series of datas.

```Javascript
serie1 = {
  name: "Serie 1"
  data: [{x: 1, y: 20.1}, {x:2, y: 19.8}, {x:3, y:24.05}]
  color: "#ff0000"
  config: {width: 1}
}
serie2 = {
  name: "Serie 2"
  data: [{x: 1, y: 5}, {x:2, y: 25.01}, {x:3, y:10}]
  color: "#ff0000"
  config: {width: 1}
}
config = {
  ...
  series: [serie1, serie2]
  ...
}
agChart = new agChart.Main(config)
agChart.render()
```

For more informations, please check the full configuration explanation located here:
[docs/configuration.md](/docs/configuration.md)

And voila !

#TODO
* Remove window.brunch.server for watcher in production
* Add `make clean` in *Makefile* to clean the project
