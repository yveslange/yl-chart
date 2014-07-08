!function(){"use strict";var t="undefined"!=typeof window?window:global;if("function"!=typeof t.require){var e={},i={},r=function(t,e){return{}.hasOwnProperty.call(t,e)},o=function(t,e){var i,r,o=[];i=/^\.\.?(\/|$)/.test(e)?[t,e].join("/").split("/"):e.split("/");for(var n=0,a=i.length;a>n;n++)r=i[n],".."===r?o.pop():"."!==r&&""!==r&&o.push(r);return o.join("/")},n=function(t){return t.split("/").slice(0,-1).join("/")},a=function(e){return function(i){var r=n(e),a=o(r,i);return t.require(a,e)}},s=function(t,e){var r={id:t,exports:{}};return i[t]=r,e(r.exports,a(t),r),r.exports},c=function(t,n){var a=o(t,".");if(null==n&&(n="/"),r(i,a))return i[a].exports;if(r(e,a))return s(a,e[a]);var c=o(a,"./index");if(r(i,c))return i[c].exports;if(r(e,c))return s(c,e[c]);throw new Error('Cannot find module "'+t+'" from "'+n+'"')},l=function(t,i){if("object"==typeof t)for(var o in t)r(t,o)&&(e[o]=t[o]);else e[t]=i},d=function(){var t=[];for(var i in e)r(e,i)&&t.push(i);return t};t.require=c,t.require.define=l,t.require.register=l,t.require.list=d,t.require.brunch=!0}}(),require.register("agchart/app",function(t,e,i){var r,o,n;i.exports=n={},r={config:e("agchart/config"),tools:e("agchart/utils/tools"),scale:e("agchart/utils/scale"),domain:e("agchart/utils/domain"),palette:e("agchart/utils/palette"),design:e("agchart/utils/design"),effectsPoint:e("agchart/effects/point"),title:e("agchart/components/title"),tooltip:e("agchart/components/tooltip"),logo:e("agchart/components/logo"),legend:e("agchart/components/legend"),cross:e("agchart/components/cross"),axis:e("agchart/components/axis"),grid:e("agchart/components/grid"),plugin:e("agchart/components/plugin")},n.Main=o=function(){function t(t){this._CONF=new r.config.Main(t.config).get(),this._PALETTE=new r.palette.Main(this._CONF.point.color),this._CANVAS=void 0,this._CLASS={tooltip:void 0,title:void 0},this._SERIES=r.tools.prepareSeries({series:t.series,palette:this._PALETTE,confPoint:this._CONF.point}),"auto"===this._CONF.canvas.padding&&(this._CONF.canvas.padding=r.design.computePadding(this._CONF.point)),this._DOMAIN=r.domain.computeDomain(t.series),r.domain.fixDomain({domain:this._DOMAIN,confAxis:this._CONF.axis}),this._SCALE=r.scale.computeScales({confCanvas:this._CONF.canvas,confAxis:this._CONF.axis,domain:this._DOMAIN}),this.initSVG(this._CONF.canvas)}return t.prototype.toString=function(){console.log("Canvas in "+this._CONF.selector),console.log("Config",this._CONF),console.log("Classes:",this._CLASS),console.log("Series:",this._SERIES)},t.prototype.initSVG=function(t){if(null==t.selector)throw new Error("No selector defined");return $(t.selector).css({position:"relative"}),this._CANVAS=d3.select(t.selector).append("svg").attr("fill",t.bgcolor).attr("width",t.width).attr("height",t.height),this._CLASS.tooltip=new r.tooltip.Main(this._CONF.canvas.selector),this._CLASS.plugin=new r.plugin.Main(this._CONF.canvas.selector),this._CLASS.title=new r.title.Main(this._CANVAS),this._CLASS.logo=new r.logo.Main(this._CANVAS),this._CLASS.axisX=new r.axis.Main(this._CANVAS,this._CONF.canvas),this._CLASS.axisY=new r.axis.Main(this._CANVAS,this._CONF.canvas),this._CLASS.cross=new r.cross.Main(this._CANVAS),this._CLASS.legend=new r.legend.Main(this._CANVAS),this._CLASS.gridX=new r.grid.Main(this._CANVAS),this._CLASS.gridY=new r.grid.Main(this._CANVAS)},t.prototype.renderXGrid=function(){var t,e,i,r,o,n,a;switch(i=this._CONF.canvas.padding,t=this._CONF.canvas.height,a=this._CONF.canvas.width,e=this._CONF.canvas.label.x,e.textAnchor="middle",e.orient=this._CONF.axis.x.orient,e.offset=this._CONF.canvas.label.x.offset,this._CONF.axis.x.orient){case"bottom":n="translate(0, "+i[1]+")";break;case"top":n="translate(0, "+(t-i[1])+")";break;default:throw new Error("Unknown orientation: ",this._CONF.axis.x.orient)}return o=this._CONF.axis.x.tickSize,"full"===o&&(o=t-2*i[1]),r={"class":"x",height:this._CONF.canvas.height,width:this._CONF.canvas.width,scale:this._SCALE.x,ticks:this._CONF.axis.x.ticks,tickSize:o,padding:i,label:e,orient:this._CONF.axis.x.orient,trans:n,tickColor:this._CONF.axis.x.tickColor,tickWidth:this._CONF.axis.x.tickWidth,color:this._CONF.axis.x.color,strokeWidth:this._CONF.axis.x.strokeWidth,format:this._CONF.axis.x.format,fontSize:this._CONF.axis.x.font.size,fontColor:this._CONF.axis.x.font.color,fontWeight:this._CONF.axis.x.font.weight},this._CLASS.gridX.render(r)},t.prototype.renderYGrid=function(){var t,e,i,r,o,n,a;switch(i=this._CONF.canvas.padding,t=this._CONF.canvas.height,a=this._CONF.canvas.width,e=this._CONF.canvas.label.y,this._CONF.axis.y.orient){case"left":e.trans="rotate(-90) translate("+-t/2+", "+(i[0]+10)+")";break;case"right":n="translate("+(a-i[0])+", 0)",e.textAnchor="middle";break;default:throw new Error("Unknown orientation: ",this._CONF.axis.y.orient)}return o=this._CONF.axis.y.tickSize,"full"===o&&(o=-a+2*i[0]),r={"class":"y",height:this._CONF.canvas.height,width:this._CONF.canvas.width,scale:this._SCALE.y,ticks:this._CONF.axis.y.ticks,tickSize:o,padding:i,label:e,orient:this._CONF.axis.y.orient,trans:n,tickColor:this._CONF.axis.y.tickColor,tickWidth:this._CONF.axis.y.tickWidth,color:this._CONF.axis.y.color,strokeWidth:this._CONF.axis.y.strokeWidth,format:this._CONF.axis.y.format,fontSize:this._CONF.axis.y.font.size,fontColor:this._CONF.axis.y.font.color,fontWeight:this._CONF.axis.y.font.weight},this._CLASS.gridY.render(r)},t.prototype.renderPoints=function(){var t,e,i,o,n,a,s,c,l,d,h,f;if(s=this,a=this._CONF,n=this._CANVAS,d=this._CLASS.tooltip.getDOM().root,h=this._CLASS.tooltip.show,l=this._CLASS.tooltip.hide,c=a.tooltip.callback,f=a.tooltip.template,"string"==typeof c&&(c=this._CLASS.tooltip.getCallback(c)),"string"==typeof f&&(f=this._CLASS.tooltip.getTemplate(f)),e=this._SCALE.x,t=this._SCALE.y,i=this._CANVAS.selectAll(".series").data(this._SERIES).enter().append("g").attr("class","series").attr("id",function(t,e){return""+e}).attr("title",function(t){return t.name}),("line"===a.canvas.render||"dotline"===a.canvas.render)&&(o=d3.svg.line().interpolate("linear").x(function(t){return e(t.x)}).y(function(e){return t(e.y)}),i.append("path").attr("class","line").attr("d",function(t){return o(t.data)}).attr("stroke",function(t){return t.data[0].config.color}).attr("fill","none").attr("stroke-width",a.line.stroke.width)),"dot"===a.canvas.render||"dotline"===a.canvas.render)return i.selectAll(".circle").data(function(t){return t.data}).enter().append("circle").attr("cx",function(t){return e(t.x)}).attr("cy",function(e){return t(e.y)}).attr("data-x",function(t){return t.x}).attr("data-y",function(t){return t.y}).attr("data-color",function(t){return t.config.color}).attr("r",function(t){return t.config.r}).attr("stroke",function(t){if("empty"===a.point.mode)return t.config.color;if("fill"===a.point.mode)return a.canvas.bgcolor;throw new Error("Unknown point mode '"+a.point.mode+"'")}).attr("fill",function(t){if("empty"===a.point.mode)return a.canvas.bgcolor;if("fill"===a.point.mode)return t.config.color;throw new Error("Unknown point mode '"+a.point.mode+"'")}).attr("stroke-width",function(t){var e,i,r;return null!=(e=null!=(i=t.config)&&null!=(r=i.stroke)?r.width:void 0)?e:a.point.stroke.width}).on("mouseover",function(t){var e,i;return i=a.point.onMouseover,"string"==typeof i&&(i=r.effectsPoint[i].onMouseover),i({canvas:n,circleNode:this,data:t}),e=c({format:a.tooltip.format,canvas:n,tooltipNode:d,circleNode:this,data:t}),d.html(f(e)),h(this,{canvas:{width:a.canvas.width,height:a.canvas.height},tooltip:{alwaysInside:a.tooltip.alwaysInside}},d,t)}).on("mouseout",function(t){var e;return e=a.point.onMouseout,"string"==typeof e&&(e=r.effectsPoint[e].onMouseout),e({canvas:n,circleNode:this,data:t}),l(d)});throw new Error("Unknown render value '"+n.render+"'")},t.prototype.render=function(){return null==this._CANVAS&&(this._CANVAS=this.createSVG()),this._CLASS.logo.render({canvas:this._CONF.canvas,logo:this._CONF.logo}),this.renderXGrid(),this.renderYGrid(),this._CLASS.axisX.render({confAxis:this._CONF.axis.x,confCanvas:this._CONF.canvas}),this._CLASS.axisY.render({confAxis:this._CONF.axis.y,confCanvas:this._CONF.canvas}),this.renderPoints(),this._CLASS.title.render({title:this._CONF.canvas.title,padding:this._CONF.canvas.padding}),this._CONF.legends.show&&this._CLASS.legend.render({svg:this._CANVAS,canvas:this._CONF.canvas,series:this._SERIES,legends:this._CONF.legends}),this._CLASS.cross.render({svg:this._CANVAS,confCanvas:this._CONF.canvas,confCross:this._CONF.canvas.cross}),this._CLASS.cross.renderValue({scale:this._SCALE,canvas:this._CANVAS,confCanvas:this._CONF.canvas,confCrossV:this._CONF.canvas.crossValue}),this._CLASS.plugin.render({context:this,canvas:this._CONF.canvas,iconsFolder:this._CONF.pluginsIconsFolder,confPlugins:this._CONF.plugins})},t}()}),require.register("agchart/components/axis",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){this._AXIS=t.append("line")}return t.prototype.getDOM=function(){return{root:this._AXIS}},t.prototype.render=function(t){var e,i;switch(e=t.confAxis,i=t.confCanvas,this._AXIS.attr("stroke",e.color).attr("stroke-width",e.strokeWidth),e.orient){case"bottom":return this._AXIS.attr("x1",i.padding[0]).attr("y1",i.height-i.padding[1]).attr("x2",i.width-i.padding[0]).attr("y2",i.height-i.padding[1]);case"top":return this._AXIS.attr("x1",i.padding[0]).attr("y1",i.padding[1]).attr("x2",i.width-i.padding[0]).attr("y2",i.padding[1]);case"left":return this._AXIS.attr("x1",i.padding[0]).attr("y1",i.padding[1]).attr("x2",i.padding[0]).attr("y2",i.height-i.padding[1]);case"right":return this._AXIS.attr("x1",i.width-i.padding[0]).attr("y1",i.padding[1]).attr("x2",i.width-i.padding[0]).attr("y2",i.height-i.padding[1]);default:throw new Error("Unknown orientation: ",e.orient)}},t}()}),require.register("agchart/components/cross",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){this._CROSSPANEL=t.append("g"),this._CROSSX=this._CROSSPANEL.append("line"),this._CROSSY=this._CROSSPANEL.append("line"),this._VALUE=this._CROSSPANEL.append("g").style("opacity",0)}return t.prototype.getDOM=function(){return{root:this._CROSSPANEL,crossX:this._CROSSX,crossY:this._CROSSY,value:this._VALUE}},t.prototype.render=function(t){var e,i,r,o,n,a,s,c,l;return o=t.confCanvas.padding[0],n=t.confCanvas.padding[1],i=t.confCross.x.offset,r=t.confCross.y.offset,s=t.confCanvas.width,e=t.confCanvas.height,c=this._CROSSX,l=this._CROSSY,c.attr("class","crossX").attr("x1",-s).attr("y1",n).attr("x2",-s).attr("y2",e-n).attr("stroke",t.confCross.x.color).attr("stroke-width",t.confCross.x.stroke),l.attr("class","crossY").attr("x1",o).attr("y1",-e).attr("x2",s-o).attr("y2",-e).attr("stroke",t.confCross.y.color).attr("stroke-width",t.confCross.y.stroke),a=null,t.svg.on("mousemove.cross",function(){var d,h;return clearTimeout(a),c.transition().style("opacity",1),l.transition().style("opacity",1),d=d3.mouse(this)[0],h=d3.mouse(this)[1],t.confCross.x.show&&d>=o+i&&s-o+i>=d&&c.attr("x1",d-i).attr("x2",d-i),t.confCross.y.show&&h>=n+r&&e-n+r>=h&&l.attr("y1",h-r).attr("y2",h-r),a=setTimeout(function(){return l.transition().duration(500).style("opacity",0),c.transition().duration(500).style("opacity",0)},2e3)})},t.prototype.renderValue=function(t){var e,i,r,o,n;return i=this._VALUE.append("rect"),r=this._VALUE.append("text").text("AgChartPile").attr("font-size",t.confCrossV.x.fontSize).attr("text-anchor","middle").attr("fill",t.confCrossV.x.fontColor),o=r.node().getBBox(),i.attr("fill",t.confCrossV.x.color).attr("rx",t.confCrossV.x.radius).attr("ry",t.confCrossV.x.radius),t.confCrossV.x.show?(n=null,e=this._VALUE,t.canvas.on("mousemove.crossValue",function(){var a,s,c,l;switch(e.transition().duration(300).style("opacity",1),clearTimeout(n),a=d3.mouse(this)[0],a<t.confCanvas.padding[0]?a=t.confCanvas.padding[0]:a>t.confCanvas.width-t.confCanvas.padding[0]&&(a=t.confCanvas.width-t.confCanvas.padding[0]),c=a,a<t.confCanvas.padding[0]+o.width/2?c=t.confCanvas.padding[0]+o.width/2:a>t.confCanvas.width-t.confCanvas.padding[0]-o.width/2&&(c=t.confCanvas.width-t.confCanvas.padding[0]-o.width/2),r.attr("y",o.height-.25*o.height).attr("x",o.width/2),i.attr("width",o.width).attr("height",o.height),l=t.scale.x.invert(a),t.confCrossV.x.orient){case"top":s=t.confCanvas.padding[1];break;case"bottom":s=t.confCanvas.height-t.confCanvas.padding[1]}return r.text(t.confCrossV.x.format(l)),e.attr("transform","translate("+(c-o.width/2)+", "+s+")"),e.attr("cy",d3.mouse(this)[1]),n=setTimeout(function(){return e.transition().duration(500).style("opacity",0)},2e3)})):void 0},t}()}),require.register("agchart/components/grid",function(t,e,i){var r,o,n;i.exports=n={},r={label:e("agchart/components/label")},n.Main=o=function(){function t(t){console.log("Hello"),this._GRID=t.append("g"),this._LABEL=new r.label.Main(t)}return t.prototype.render=function(t){var e;return e=d3.svg.axis().scale(t.scale).orient(t.orient).tickSize(t.tickSize),"auto"!==t.ticks&&e.ticks(t.ticks),null!=t.format&&("auto"===t.ticks?e.ticks(d3.time.months.utc,1):e.ticks(d3.time.months.utc,t.ticks),e.tickFormat(d3.time.format(t.format))),this._GRID.attr("transform",t.trans).attr("class","axis "+t["class"]).call(e),this._GRID.selectAll("line").attr("stroke",t.color).attr("stroke-width",t.strokeWidth),this._GRID.selectAll("line").attr("stroke",t.tickColor).attr("width-stroke",t.tickWidth),this._GRID.selectAll("path").style("display","none"),this._GRID.selectAll("text").attr("fill",t.fontColor).attr("font-size",t.fontSize).attr("font-weight",t.fontWeight),this._LABEL.render(t)},t}()}),require.register("agchart/components/label",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){this._LABEL=t.append("text")}return t.prototype.getDOM=function(){return{root:this._LABEL}},t.prototype.render=function(t){var e,i,r,o,n,a;if(null!=t){switch(a=t.width,e=t.height,r=t.padding,i=t.label.offset||0,this._LABEL.attr("fill",t.label.color).attr("class","label "+t["class"]).attr("font-size",t.label.size+"px").attr("text-anchor",t.label.textAnchor).text(t.label.text),o=this._LABEL.node().getBBox(),t.orient){case"bottom":n="translate("+a/2+",          "+(e-r[1]+o.height+i)+")";break;case"top":n="translate("+a/2+", "+(e-2)+")";break;case"left":n="translate("+r[0]+", 0)";break;case"right":n="translate("+(a-r[0])+", "+r[1]/2+")"}return this._LABEL.attr("transform",n)}},t}()}),require.register("agchart/components/legend",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){this._LEGENDS=t.append("g"),this._HIDEALL=!1}return t.prototype.getDOM=function(){return{root:this._LEGENDS}},t.prototype.render=function(t){var e,i,r,o,n,a,s,c,l,d,h,f,u,g,p,x,v,m,_,C;for(i=t.series,e=t.canvas.selector,g=t.legends.rect.width,f=t.legends.rect.height,v=t.legends.text.width,u=t.legends.margin,m=t.canvas.width-2*t.canvas.padding[0],d=t.canvas.padding[0]-t.legends.padding[0],h=t.canvas.height-t.legends.padding[1],this._LEGENDS.attr("transform","translate("+d+", "+h+")"),n=0,a=t.legends.padding[1],l=i.length-1,t.legends.toggleAll.show&&l++,C=[],s=_=0;l>=_;s=_+=1)t.svg.attr("height",t.canvas.height+a),s===l&&t.legends.toggleAll.show?(c=this.drawLegend(this._LEGENDS,s,n,a,g,f,u,t.legends.toggleAll.color,"legend option",t.legends.toggleAll.text),r=this.toggleSeries):(p=i[s],o=p.data[0].config.color,x=p.name,null!=t.legends.format&&(x=t.legends.format(x)),c=this.drawLegend(this._LEGENDS,s,n,a,g,f,u,o,"legend",x),r=this.toggleSerie),n+g+v+u>m-g-v-u?(n=0,a+=15):n+=g+v+u,C.push(c.on("click",function(t,i,r){return function(){return i.call(this,t,e,r)}}(this,r,s)));return C},t.prototype.drawLegend=function(t,e,i,r,o,n,a,s,c,l){var d,h;return d=t.append("g").style("cursor","pointer").attr("transform","translate("+i+", "+r+")").attr("data-index",e).attr("data-hide","false").attr("class",c),h=d.append("rect").attr("width",o).attr("height",n).attr("fill",s).attr("stroke","#afafaf").attr("stroke-width","1").attr("rx",5).attr("ry",5),d.append("text").attr("x",a+o).attr("y",n-1).attr("fill",s).attr("font-size",10).text(l),d},t.prototype.toggleSerie=function(t,e,i){var r,o;return o=$(this).find("rect").css("opacity"),r=this.getAttribute("data-hide"),"false"===r?($(this).find("rect").fadeTo(100,.1),$(e).find(".series#"+i).attr("data-hide","true"),this.setAttribute("data-hide","true")):($(this).find("rect").fadeTo(100,1),$(e).find(".series#"+i).attr("data-hide","false"),this.setAttribute("data-hide","false")),$(e).find(".series#"+i).toggle("normal")},t.prototype.toggleSeries=function(t,e){var i;return i=!t._HIDEALL,t._HIDEALL=i,i?($(this).parent().find("rect").fadeTo(500,.1),$(e).find(".series").hide("normal")):($(this).parent().find("rect").fadeTo(100,1),$(e).find(".series").show("normal")),$(this).parent().find(".legend").attr("data-hide",i),$(e).find(".series").attr("data-hide",i)},t}()}),require.register("agchart/components/logo",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){this._IMAGE=t.append("image")}return t.prototype.getDOM=function(){return{root:this._IMAGE}},t.prototype.render=function(t){var e,i,r,o,n;return e=t.canvas.height,r=t.canvas.width,i=t.canvas.padding,o=n=100,"bottom"===t.logo.y&&(n=e-i[1]-t.logo.height),"top"===t.logo.y&&(n=i[1]),"right"===t.logo.x&&(o=r-i[0]-t.logo.width),"left"===t.logo.x&&(o=i[0]),this._IMAGE.attr("width",t.logo.width).attr("height",t.logo.height).attr("x",o).attr("y",n).attr("opacity",t.logo.opacity).attr("id","logo").attr("xlink:href",t.logo.url)},t}()}),require.register("agchart/components/plugin",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){this._MENU=$("<div/>",{id:"pluginsMenu"}).appendTo(t),this._PLUGINSDOM={}}return t.prototype.getDOM=function(){return{root:this._MENU,plugins:this._PLUGINSDOM}},t.prototype.render=function(t){var i,r,o,n,a,s,c;s=this._MENU,s.css({position:"absolute",left:t.canvas.width+1,top:"0px",opacity:.1}),s.on("mouseover.menuPlugin",function(){return s.animate({opacity:1},10)}),s.on("mouseout.menuPlugin",function(){return s.animate({opacity:.1},10)}),c=[];for(n in t.confPlugins)t.confPlugins[n].enable?(o=$("<img/>",{src:""+t.iconsFolder+"/"+n+".png",title:t.confPlugins[n].displayName,width:"30px"}).appendTo(s),o.css({cursor:"pointer"}),a=e("agchart/plugins/"+n),i=a.onClick,r=t.context,o.click(function(){return i(r,t.canvas.selector,t.confPlugins[n])}),c.push(this._PLUGINSDOM[n]=o)):c.push(void 0);return c},t}()}),require.register("agchart/components/title",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){this.boxTitle=t.append("g"),this.boxText=this.boxTitle.append("text"),this.boxBorder=this.boxTitle.append("rect")}return t.prototype.getDOM=function(){return{root:this.boxTitle,border:this.boxBorder,text:this.boxText}},t.prototype.render=function(t){var e,i,r;return e=t.title.position.x,i=t.title.position.y,this.boxTitle,this.boxText=this.boxTitle.attr("transform","translate("+e+","+i+")").append("text").attr("class","chart-title").attr("fill",t.title.color).attr("font-size",t.title.size).attr("font-weight","bold").attr("font-family",t.title.fontFamily).text(t.title.text),r=this.boxText.node().getBBox(),this.boxText.attr("x",t.title.border.padding[0]).attr("y",r.height-t.title.border.padding[1]-2),t.title.text?this.boxBorder.attr("width",r.width+2*t.title.border.padding[0]).attr("height",r.height+2*t.title.border.padding[1]).attr("ry",t.title.border.radius).attr("rx",t.title.border.radius).attr("stroke",t.title.border.color):void 0},t}()}),require.register("agchart/components/tooltip",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){null==this._TOOLTIP&&(this._TOOLTIP=d3.select(t).append("div").attr("class","tooltip").style("opacity",0).style("left",0).style("top",0))}return t.prototype.getDOM=function(){return{root:this._TOOLTIP}},t.prototype.show=function(t,e,i,r){var o,n,a,s,c,l;return i.attr("width",200).attr("height",100),o=d3.mouse(t)[0],n=d3.mouse(t)[1],s=o+r.config.stroke.width,c=n+r.config.stroke.width,e.tooltip.alwaysInside&&(o>e.canvas.width/2&&(l=parseFloat(i.style("width").replace("px","")),s=o-r.config.stroke.width-l),n>e.canvas.height/2&&(a=parseFloat(i.style("height").replace("px","")),c=n-r.config.stroke.width-a)),i.style("left",s+"px").style("top",c+"px").transition().duration(200).style("opacity",.9)},t.prototype.hide=function(t){return t.transition().duration(500).style("opacity",0)},t.prototype.getTemplate=function(t){return this._templates[t]},t.prototype.getCallback=function(t){return this._callbacks[t]},t.prototype._templates={singlePoint:function(t){var e;return e="<h1>"+t[0].title+"</h1>",e+="<div class='serie' id='0'>"+t[0].x+" : "+t[0].y+"<div class='swatch'"+("style='background-color: "+t[0].color+"'></div>")+"</div>"},multipleVertical:function(t){var e,i,r,o,n;for(i="<h1>"+t[0].x+"</h1>",r=o=0,n=t.length;n>o;r=++o)e=t[r],e.hide||(i+="<div class='serie' id='"+r+"'>"+e.serieName+" : "+e.y+"<div class='swatch'"+("style='background-color: "+e.color+"'></div>")+"</div>");return i},multipleVerticalInverted:function(t){var e,i,r,o,n;for(i="<h1>"+t[0].x+"</h1>",r=o=0,n=t.length;n>o;r=++o)e=t[r],e.hide||(i+="<div class='serie' id='"+r+"'>"+e.serieName+": "+e.y+"<div class='swatch'"+("style='background-color: "+e.color+"'></div>")+"</div>");return i}},t.prototype._callbacks={singlePoint:function(t){var e,i,r;return i=t.circleNode,e=parseFloat(i.getAttribute("data-x")),null!=(null!=(r=t.format)?r.x:void 0)&&(e=t.format.x(e)),[{color:t.data.config.color,serieName:t.circleNode.parentNode.getAttribute("title"),x:e,y:t.data.y.toFixed(2),hide:"true"===node.parentNode.getAttribute("data-hide")}]},multipleVertical:function(t){var e,i,r,o,n,a,s;return n=t.circleNode,e=n.getAttribute("cx"),o=parseFloat(n.getAttribute("data-x")),null!=(null!=(a=t.format)?a.x:void 0)&&(o=t.format.x(o)),r=parseInt(n.parentNode.getAttribute("title")),null!=(null!=(s=t.format)?s.title:void 0)&&(r=t.format.title(r)),i=[],$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){return i.push({title:r,serieName:e.parentNode.getAttribute("title"),color:e.getAttribute("data-color"),y:parseFloat(e.getAttribute("data-y")).toFixed(2),x:o,hide:"true"===e.parentNode.getAttribute("data-hide")})}),i},multipleVerticalInverted:function(t){var e,i,r,o,n,a,s;return n=t.circleNode,e=n.getAttribute("cx"),o=parseFloat(n.getAttribute("data-x")),null!=(null!=(a=t.format)?a.x:void 0)&&(o=t.format.x(o)),r=parseInt(n.parentNode.getAttribute("title")),null!=(null!=(s=t.format)?s.title:void 0)&&(r=t.format.title(r)),i=[],$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(e,n){var a,s;return a=parseInt(n.parentNode.getAttribute("title")),null!=(null!=(s=t.format)?s.serie:void 0)&&(a=t.format.serie(a)),i.push({title:r,serieName:a,color:n.getAttribute("data-color"),y:parseFloat(n.getAttribute("data-y")).toFixed(2),x:o,hide:"true"===n.parentNode.getAttribute("data-hide")})}),i}},t}()}),require.register("agchart/config",function(t,e,i){var r,o,n;i.exports=n={},r={tools:e("agchart/utils/tools")},n.Main=o=function(){function t(t){r.tools.updateObject(this.defaultConfig,t)}return t.prototype.get=function(){return this.defaultConfig},t.prototype.defaultConfig={tooltip:{template:"singlePoint",format:{title:null,serie:null,x:null,y:null},callback:"singlePoint",alwaysInside:!0},canvas:{scale:{x:{nice:!1,padding:[10,10]},y:{nice:!0,padding:[10,10]}},bgcolor:"#FFFFFF",render:"dot",title:{text:"",color:"#2f2f2f",size:24,fontFamily:"arial",border:{radius:2,color:"#3f3f3f",padding:[8,1]},position:{x:35,y:20}},label:{x:{text:null,size:10,color:"#7f7f7f",offset:15},y:{text:null,size:10,color:"#7f7f7f",offset:0}},selector:null,width:600,height:400,padding:[0,0],cross:{x:{show:!1,color:"black",stroke:1,offset:0},y:{show:!1,color:"black",stroke:1,offset:0}},crossValue:{x:{orient:"bottom",show:!0,color:"#0971b7",fontColor:"#ffffff",fontSize:12,format:function(t){var e,i,r;return e=t.toString().split(" ")[2],i=t.toString().split(" ")[1],r=t.toString().split(" ")[3].substring(2),""+e+" "+i+" "+r},radius:5},y:{show:!0,color:"white"}}},logo:{url:"agflow-logo.svg",width:100,height:50,x:"right",y:"bottom",opacity:.5},line:{stroke:{width:2}},point:{onMouseover:"singlePoint",onMouseout:"singlePoint",r:4,mode:"empty",color:"munin",stroke:{width:1}},axis:{x:{format:null,domainMargin:5,ticks:"auto",tickSize:null,orient:"bottom",tickColor:"#f5f5f5",tickWidth:2,strokeWidth:1,color:"#2b2e33",font:{color:"#2b2e33",size:10,weight:"normal"}},y:{format:null,domainMargin:5,ticks:"auto",tickSize:null,orient:"left",tickColor:"#f5f5f5",tickWidth:2,strokeWidth:1,color:"#2b2e33",font:{color:"#2b2e33",size:10,weight:"normal"}}},legends:{show:!0,format:null,toggleAll:{show:!0,color:"#5f5f5f",text:"Hide all"},text:{width:50},rect:{width:10,height:10},margin:5,padding:[0,15]},pluginsIconsFolder:"icons",plugins:{exportation:{displayName:"Exports the chart to a PNG file",enable:!0,copyright:{text:"(c) AgFlow 2014",color:"#9f9f9f",fontSize:12}}}},t}()}),require.register("agchart/effects/point",function(t,e,i){var r;i.exports=r={},r.singlePoint={onMouseover:function(t){var e,i;return i=t.circleNode,e=parseFloat(i.getAttribute("stroke-width")),i.setAttribute("stroke-width",2*e)},onMouseout:function(t){var e,i;return i=t.circleNode,e=parseFloat(i.getAttribute("stroke-width")),i.setAttribute("stroke-width",e/2)}},r.multipleVertical={onMouseover:function(t){var e,i,r;return r=t.circleNode,e=r.getAttribute("cx"),i=2*parseFloat(r.getAttribute("stroke-width")),$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){return $(e).attr("stroke-width",i)})},onMouseout:function(t){var e,i,r;return r=t.circleNode,e=r.getAttribute("cx"),i=parseFloat(r.getAttribute("stroke-width"))/2,$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){return $(e).attr("stroke-width",i)})}},r.multipleVerticalInverted={onMouseover:function(t){var e,i,r;return r=t.circleNode,e=r.getAttribute("cx"),i=2*parseFloat(r.getAttribute("stroke-width")),$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){var r,o;return $(e).attr("stroke-width",i),r=$(e).attr("fill"),o=$(e).attr("stroke"),$(e).attr("stroke",r),$(e).attr("fill",o)})},onMouseout:function(t){var e,i,r;return r=t.circleNode,e=r.getAttribute("cx"),i=parseFloat(r.getAttribute("stroke-width"))/2,$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){var r,o;return $(e).attr("stroke-width",i),r=$(e).attr("fill"),o=$(e).attr("stroke"),$(e).attr("stroke",r),$(e).attr("fill",o)})}}}),require.register("agchart/initialize",function(t,e,i){var r,o,n,a,s;i.exports=o={},r=e("agchart/app"),s=e("agchart/utils/time"),n=function(t,e){var i,r,o,n;for(null==e&&(e=1),i=[],r=o=0,n=t-1;e>0?n>=o:o>=n;r=o+=e)i.push({x:1e3*r,y:100*Math.random()});return i},a=function(t,e,i){var r,o,n,a;for(null==e&&(e=1),r=[],o=n=0,a=t-1;e>0?a>=n:n>=a;o=n+=e)r.push({x:1e3*o,y:10*i(o)+50});return r},o.run=function(){var t,e,i,o,n,c,l;for(n=new s.Main({lang:"en"}),o=[],o.push({name:"Serie 1",data:a(10368e3,129600,function(t){return 10*Math.cos(t)}),config:{stroke:{width:1}}}),o.push({name:"Serie 2",data:a(10368e3,259200,Math.tan),config:{color:"#ff0001",stroke:{width:1}}}),o.push({name:"Serie 3",data:a(10368e3,172800,Math.sin),config:{stroke:{width:1}}}),e=l=0;20>=l;e=++l)o.push({name:"Serie "+(e+3),data:[{x:1e3*e,y:10*e}]});return c=function(t){var e,i;return e=new Date(t),(i=d3.time.format("%b '%y"))(e)},i="multipleVerticalInverted",t=new r.Main({config:{canvas:{scale:{x:{nice:!0}},render:"dotline",width:900,height:400,title:{color:"#4f4f4f",size:16,text:"Helo",border:{padding:[8,1]}},label:{x:{text:"Some label X",size:10,color:"#7f7f7f"},y:{text:"Some label Y",size:10,color:"#7f7f7f"}},selector:"#chart1",padding:[50,50],cross:{x:{show:!0,color:"#44A0FF"},y:{show:!0,color:"#FFA044"}},crossValue:{x:{show:!0}}},logo:{url:"agflow-logo.png",width:100,height:50,x:"right",y:"bottom",opacity:.1},tooltip:{template:i,callback:i,format:{x:c}},line:{stroke:{width:1}},point:{onMouseover:i,onMouseout:i,mode:"fill",r:4,color:"agflow",stroke:{width:1,color:null}},axis:{y:{ticks:5,tickSize:"full",tickColor:"#ebebeb",tickWidth:2,orient:"right",font:{weight:"bold"}},x:{ticks:1,orient:"bottom",tickWidth:2,tickColor:"#ebebeb",format:"%b",tickSize:"full"}},legends:{show:!0},pluginsIconsFolder:"icons"},series:o}),t.render()}}),require.register("agchart/plugins/exportation",function(t,e,i){var r,o;i.exports=o={},r={logo:e("agchart/components/logo")},o.onClick=function(t,e,i){var o,n,a,s,c,l,d,h,f,u,g,p,x,v,m;return s=t._CLASS.logo.getDOM().root.remove(),g=t._CANVAS.append("text").attr("fill",i.copyright.color).attr("font-size",i.copyright.fontSize+"px").text(i.copyright.text),$(t._CLASS.legend.getDOM().root.node()).find(".legend.option").hide(),v=t._CONF.canvas.width,a=t._CONF.canvas.height,p=g.node().getBBox(),d=v-t._CONF.canvas.padding[0]-10,h=a-t._CONF.canvas.padding[1]-3,g.attr("text-anchor","end"),g.attr("transform","translate("+d+", "+h+")"),f=$(e).find("svg")[0],u=(new XMLSerializer).serializeToString(f),n=document.createElement("canvas"),$("body").after(n),canvg(n,u),$(n).remove(),c=n.toDataURL("image/png"),x=window.navigator.userAgent,l=x.indexOf("MSIE "),l>0||navigator.userAgent.match(/Trident.*rv\:11\./)?(console.log("Internet explorer detected"),window.winIE=m=window.open(),m.document.body.innerHTML="<center><img src='"+c+"'></img><br>Please right click on the image and choose 'Save image as...'</center>",m.document.close()):(o=document.createElement("a"),o.href=c,o.download="agflow.png",$("body").append(o),o.click()),t._CLASS.logo=new r.logo.Main(t._CANVAS),t._CLASS.logo.render({canvas:t._CONF.canvas,logo:t._CONF.logo}),g.remove(),$(t._CLASS.legend.getDOM().root.node()).find(".legend.option").show()}}),require.register("agchart/utils/design",function(t,e,i){var r,o;i.exports=o={},o.computePadding=r=function(t){var e;return e=t.r+t.stroke.width/2,[e,e]}}),require.register("agchart/utils/domain",function(t,e,i){var r,o,n;i.exports=r={},r.computeDomain=n=function(t){var e,i,r,o,n,a,s,c,l,d,h;for(e=i=Number.MIN_VALUE,r=o=Number.MAX_VALUE,s=0,l=t.length;l>s;s++)for(a=t[s],h=a.data,c=0,d=h.length;d>c;c++)n=h[c],n.x>e&&(e=n.x),n.x<r&&(r=n.x),n.y>i&&(i=n.y),n.y<o&&(o=n.y);return{minX:r,maxX:e,minY:o,maxY:i}},r.fixDomain=o=function(t){var e,i;return i=t.domain,e=t.confAxis,i.maxX===i.minX&&(i.maxX+=e.x.domainMargin,i.minX-=e.x.domainMargin),i.maxY===i.minY?(i.maxY+=e.y.domainMargin,i.minY-=e.y.domainMargin):void 0}}),require.register("agchart/utils/palette",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){var e;e=this.palettes(),this._PALETTE=e[t],this._INDEX=0}return t.prototype.isDefined=function(){return null!=this._PALETTE?!0:!1},t.prototype.color=function(t){return this._PALETTE[t%this._PALETTE.length]},t.prototype.palettes=function(){var t;return t={},t.spectrum14=["#ecb796","#dc8f70","#b2a470","#92875a","#716c49","#d2ed82","#bbe468","#a1d05d","#e7cbe6","#d8aad6","#a888c2","#9dc2d3","#649eb9","#387aa3"].reverse(),t.spectrum2000=["#57306f","#514c76","#646583","#738394","#6b9c7d","#84b665","#a7ca50","#bfe746","#e2f528","#fff726","#ecdd00","#d4b11d","#de8800","#de4800","#c91515","#9a0000","#7b0429","#580839","#31082b"],t.spectrum2001=["#2f243f","#3c2c55","#4a3768","#565270","#6b6b7c","#72957f","#86ad6e","#a1bc5e","#b8d954","#d3e04e","#ccad2a","#cc8412","#c1521d","#ad3821","#8a1010","#681717","#531e1e","#3d1818","#320a1b"],t.classic9=["#423d4f","#4a6860","#848f39","#a2b73c","#ddcb53","#c5a32f","#7d5836","#963b20","#7c2626","#491d37","#2f254a"].reverse(),t.httpStatus={503:"#ea5029",502:"#d23f14",500:"#bf3613",410:"#efacea",409:"#e291dc",403:"#f457e8",408:"#e121d2",401:"#b92dae",405:"#f47ceb",404:"#a82a9f",400:"#b263c6",301:"#6fa024",302:"#87c32b",307:"#a0d84c",304:"#28b55c",200:"#1a4f74",206:"#27839f",201:"#52adc9",202:"#7c979f",203:"#a5b8bd",204:"#c1cdd1"},t.colorwheel=["#b5b6a9","#858772","#785f43","#96557e","#4682b4","#65b9ac","#73c03a","#cb513a"].reverse(),t.cool=["#5e9d2f","#73c03a","#4682b4","#7bc3b8","#a9884e","#c1b266","#a47493","#c09fb5"],t.munin=["#00cc00","#0066b3","#ff8000","#ffcc00","#330099","#990099","#ccff00","#ff0000","#808080","#008f00","#00487d","#b35a00","#b38f00","#6b006b","#8fb300","#b30000","#bebebe","#80ff80","#80c9ff","#ffc080","#ffe680","#aa80ff","#ee00cc","#ff8080","#666600","#ffbfff","#00ffcc","#cc6699","#999900"],t.paired=["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],t.agflow=["#0099ef","#ff009d","#56b501","#ffee52","#a34100","#0018ef","#ff89d2","#6ee801","#ef0018","#ffa468","#00efd7","#b3006e","#aefe66","#ed7446","#572200","#0010a3","#326901"],t
},t}()}),require.register("agchart/utils/scale",function(t,e,i){var r,o,n;i.exports=n={},r={domain:e("agchart/utils/domain")},n.computeScales=o=function(t){var e,i,r,o,n;return i=t.confAxis,o=t.domain,r=t.confCanvas,n=r.padding,e={x:d3.scale.linear(),y:d3.scale.linear()},null!=i.x.format&&(e.x=d3.time.scale.utc()),e.x.domain([o.minX,o.maxX]).range([n[0],r.width-n[0]]),r.scale.x.nice&&e.x.nice(),null!=i.y.format&&(e.y=d3.time.scale()),e.y.domain([o.minY,o.maxY]).range([r.height-n[1],n[1]]),r.scale.y.nice&&e.y.nice(),e}}),require.register("agchart/utils/time",function(t,e,i){var r,o;i.exports=o={},o.Main=r=function(){function t(t){var e;null==t&&(t={}),this._CONF={lang:null!=(e=t.lang)?e:"enl"},this._DATE=new Date,this._TIMESTAMP=this._DATE.getTime(),this._MONTHSNAME={},this._MONTHSNAME.en=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],this._MONTHSNAME.enl=["January","February","March","April","May","June","July","August","September","October","November","December"],this._MONTHSNAME.fr=["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"],this._MONTHSNAME.frl=["Janvier","Février","Mars","Avril","Mai","Juin","Juil","Août","Septembre","Octobre","Novembre","Décembre"]}return t.prototype.monthsName=function(){return this._MONTHSNAME[this._CONF.lang]},t.prototype.getMonth=function(){return this.monthsName()[this._DATE.getMonth()]},t.prototype.getDay=function(){return this._DATE.getDay()},t.prototype.getFullDate=function(){return this._DATE.getDay()+" "+this.getMonth()+" "+this._DATE.getYear()+" "+this._DATE.getHours()+":"+this._DATE.getMinutes()},t.prototype.getDate=function(){return this._DATE},t.prototype.setTimestamp=function(t){return null==t?this._TIMESTAMP:(this._DATE=new Date(1e3*parseInt(t)),this._TIMESTAMP=parseInt(t))},t}()}),require.register("agchart/utils/tools",function(t,e,i){var r,o,n;i.exports=r={},r.updateObject=n=function(t,e,i){var r,o;return null==i&&(i=!0),r=function(t){var e;return null!=(null!=t&&null!=(e=t[0])?e.nodeName:void 0)?!0:!1},(o=function(t,e,i){var n,a,s,c;if(null==i&&(i=!0),null!=e)for(n in e)r(e[n])?t[n]=null!=(a=e[n][0])?a:t[n][0]:"object"==typeof e[n]?(null==t[n]&&(t[n]={}),o(t[n],e[n],i)):t[n]=i?null!=(s=e[n])?s:t[n]:null!=(c=t[n])?c:e[n];return t})(t,e,i)},r.prepareSeries=o=function(t){var e,i,r,o,n,a,s,c,l,d,h,f,u,g;if(null==(null!=(c=t.series)?c.length:void 0))throw new Error("No series defined, "+t.series+"should be an array of objects");if(t.series.length<1)throw new Error("At least one serie must be defined");for(l=t.series,e=o=0,a=l.length;a>o;e=++o)for(r=l[e],d=r.data,n=0,s=d.length;s>n;n++)i=d[n],i.serie=e,i.config={color:t.confPoint.color},t.palette.isDefined()&&(i.config.color=t.palette.color(e)),null!=(null!=(h=r.config)?h.color:void 0)&&(i.config.color=r.config.color),i.config.r=(null!=(f=r.config)?f.r:void 0)||t.confPoint.r,i.config.stroke={width:t.confPoint.stroke.width},null!=(null!=(u=r.config)&&null!=(g=u.stroke)?g.width:void 0)&&(i.config.stroke.width=r.config.stroke.width);return t.series}});