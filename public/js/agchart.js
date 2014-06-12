!function(){"use strict";var t="undefined"!=typeof window?window:global;if("function"!=typeof t.require){var e={},r={},i=function(t,e){return{}.hasOwnProperty.call(t,e)},n=function(t,e){var r,i,n=[];r=/^\.\.?(\/|$)/.test(e)?[t,e].join("/").split("/"):e.split("/");for(var a=0,o=r.length;o>a;a++)i=r[a],".."===i?n.pop():"."!==i&&""!==i&&n.push(i);return n.join("/")},a=function(t){return t.split("/").slice(0,-1).join("/")},o=function(e){return function(r){var i=a(e),o=n(i,r);return t.require(o,e)}},s=function(t,e){var i={id:t,exports:{}};return r[t]=i,e(i.exports,o(t),i),i.exports},l=function(t,a){var o=n(t,".");if(null==a&&(a="/"),i(r,o))return r[o].exports;if(i(e,o))return s(o,e[o]);var l=n(o,"./index");if(i(r,l))return r[l].exports;if(i(e,l))return s(l,e[l]);throw new Error('Cannot find module "'+t+'" from "'+a+'"')},c=function(t,r){if("object"==typeof t)for(var n in t)i(t,n)&&(e[n]=t[n]);else e[t]=r},d=function(){var t=[];for(var r in e)i(e,r)&&t.push(r);return t};t.require=l,t.require.define=c,t.require.register=c,t.require.list=d,t.require.brunch=!0}}(),require.register("agchart",function(t,e,r){var i,n,a;a=e("utils/palette"),r.exports=n={},n.Main=i=function(){function t(t){this._CONF={tooltip:{template:"singlePoint",format:{x:null,y:null},callback:"singlePoint",alwaysInside:!0},canvas:{bgcolor:"#FFFFFF",render:"dot",title:{text:"",color:"#2f2f2f",size:24,fontFamily:"arial",border:{radius:2,color:"#3f3f3f",padding:[8,1]},position:{x:35,y:20}},label:{x:{text:null,size:10,color:"#7f7f7f"},y:{text:null,size:10,color:"#7f7f7f"}},selector:null,width:600,height:400,padding:[0,0],cross:{x:{show:!1,color:"black",stroke:1,offset:0},y:{show:!1,color:"black",stroke:1,offset:0}},crossValue:{x:{orient:"bottom",show:!0,color:"#0971b7",fontColor:"#ffffff",fontSize:12,format:function(t){var e,r,i;return e=t.toString().split(" ")[2],r=t.toString().split(" ")[1],i=t.toString().split(" ")[3].substring(2),""+e+" "+r+" "+i},radius:5},y:{show:!0,color:"white"}}},logo:{url:"agflow-logo.svg",width:100,height:50,x:"right",y:"bottom",opacity:.5},line:{stroke:{width:2}},point:{onMouseover:"singlePoint",onMouseout:"singlePoint",r:4,mode:"empty",color:"munin",stroke:{width:1}},axis:{x:{format:null,tickSize:null,orient:"bottom",tickColor:"#f5f5f5",tickWidth:2,strokeWidth:1,color:"#2b2e33"},y:{format:null,tickSize:null,orient:"left",tickColor:"#f5f5f5",tickWidth:2,strokeWidth:1,color:"#2b2e33"}},plugins:{exportation:{enable:!0,copyright:{text:"(c) AgFlow 2014",color:"#9f9f9f",fontSize:12}}}},this._CANVAS=void 0,this._TOOLTIP=void 0,this._SCALE={x:void 0,y:void 0},this.defaultConfig(t.config),this._SERIES=this.prepareSeries(t.series),this.computePadding(),this.computeScales()}return t.prototype.updateObject=function(t,e,r){var i,n;return null==r&&(r=!0),i=function(t){var e;return null!=(null!=t&&null!=(e=t[0])?e.nodeName:void 0)?!0:!1},(n=function(t,e,r){var a,o,s,l;if(null==r&&(r=!0),null!=e)for(a in e)i(e[a])?t[a]=null!=(o=e[a][0])?o:t[a][0]:"object"==typeof e[a]?(null==t[a]&&(t[a]={}),n(t[a],e[a],r)):t[a]=r?null!=(s=e[a])?s:t[a]:null!=(l=t[a])?l:e[a];return t})(t,e,r)},t.prototype.defaultConfig=function(t){return null==t&&(t={}),this.updateObject(this._CONF,t),this._CONF},t.prototype.effects={singlePoint:{onMouseover:function(t){var e,r;return r=t.circleNode,e=parseFloat(r.getAttribute("stroke-width")),r.setAttribute("stroke-width",2*e)},onMouseout:function(t){var e,r;return r=t.circleNode,e=parseFloat(r.getAttribute("stroke-width")),r.setAttribute("stroke-width",e/2)}},multipleVertical:{onMouseover:function(t){var e,r,i;return i=t.circleNode,e=i.getAttribute("cx"),r=2*parseFloat(i.getAttribute("stroke-width")),$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){return $(e).attr("stroke-width",r)})},onMouseout:function(t){var e,r,i;return i=t.circleNode,e=i.getAttribute("cx"),r=parseFloat(i.getAttribute("stroke-width"))/2,$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){return $(e).attr("stroke-width",r)})}},multipleVerticalInverted:{onMouseover:function(t){var e,r,i;return i=t.circleNode,e=i.getAttribute("cx"),r=2*parseFloat(i.getAttribute("stroke-width")),$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){var i,n;return $(e).attr("stroke-width",r),i=$(e).attr("fill"),n=$(e).attr("stroke"),$(e).attr("stroke",i),$(e).attr("fill",n)})},onMouseout:function(t){var e,r,i;return i=t.circleNode,e=i.getAttribute("cx"),r=parseFloat(i.getAttribute("stroke-width"))/2,$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){var i,n;return $(e).attr("stroke-width",r),i=$(e).attr("fill"),n=$(e).attr("stroke"),$(e).attr("stroke",i),$(e).attr("fill",n)})}}},t.prototype.toString=function(){console.log("Canvas in "+this._CONF.selector),console.log("Config",this._CONF),console.log("Datas:",this._SERIES)},t.prototype.computePadding=function(){var t;return t=this._CONF.point.r+this._CONF.point.stroke.width/2,"auto"===this._CONF.canvas.padding?this._CONF.canvas.padding=[t,t]:void 0},t.prototype.getDomain=function(){var t,e,r,i,n,a,o,s,l,c,d,h;for(t=e=Number.MIN_VALUE,r=i=Number.MAX_VALUE,d=this._SERIES,o=0,l=d.length;l>o;o++)for(a=d[o],h=a.data,s=0,c=h.length;c>s;s++)n=h[s],n.x>t&&(t=n.x),n.x<r&&(r=n.x),n.y>e&&(e=n.y),n.y<i&&(i=n.y);return{minX:r,maxX:t,minY:i,maxY:e}},t.prototype.computeScales=function(){var t,e,r;return t=this._CONF.canvas,r=t.padding,e=this.getDomain(),this._SCALE.width=d3.scale.linear(),null!=this._CONF.axis.x.format&&(this._SCALE.width=d3.time.scale()),this._SCALE.width.domain([e.minX,e.maxX]).nice().range([r[0],t.width-r[0]]),this._SCALE.height=d3.scale.linear(),null!=this._CONF.axis.y.format&&(this._SCALE.height=d3.time.scale()),this._SCALE.height.domain([e.minY,e.maxY]).nice().range([t.height-r[1],r[1]])},t.prototype.createCanvas=function(){if(null==this._CONF.canvas.selector)throw new Error("No selector defined");return $(this._CONF.canvas.selector).css({position:"relative"}),this._CANVAS=d3.select(this._CONF.canvas.selector).append("svg").attr("fill",this._CONF.canvas.bgcolor).attr("width",this._CONF.canvas.width).attr("height",this._CONF.canvas.height)},t.prototype.renderTitle=function(t){var e,r,i,n,a,o;return null==t&&(t={title:null,padding:null}),r=t.title.position.x,i=t.title.position.y,e=this._CANVAS.append("g").attr("transform","translate("+r+","+i+")"),n=e.append("rect"),a=e.append("text").attr("class","chart-title").attr("fill",t.title.color).attr("font-size",t.title.size).attr("font-weight","bold").attr("font-family",t.title.fontFamily).text(t.title.text),o=a.node().getBBox(),a.attr("x",t.title.border.padding[0]).attr("y",o.height-t.title.border.padding[1]-2),n.attr("width",o.width+2*t.title.border.padding[0]).attr("height",o.height+2*t.title.border.padding[1]).attr("ry",t.title.border.radius).attr("rx",t.title.border.radius).attr("stroke",t.title.border.color)},t.prototype.renderLabel=function(t){return null==t&&(t={label:{color:null,size:null,trans:null,text:"",textAnchor:""},"class":null}),this._CANVAS.append("text").attr("fill",t.label.color).attr("class","label "+t["class"]).attr("font-size",t.label.size+"px").attr("text-anchor",t.label.textAnchor).attr("transform",t.label.trans).text(t.label.text)},t.prototype.renderAxis=function(t){var e;switch(e=this._CANVAS.append("line").attr("stroke",t.axis.color).attr("stroke-width",t.axis.strokeWidth),t.axis.orient){case"bottom":return e.attr("x1",t.canvas.padding[0]).attr("y1",t.canvas.height-t.canvas.padding[1]).attr("x2",t.canvas.width-t.canvas.padding[0]).attr("y2",t.canvas.height-t.canvas.padding[1]);case"top":return e.attr("x1",t.canvas.padding[0]).attr("y1",t.canvas.padding[1]).attr("x2",t.canvas.width-t.canvas.padding[0]).attr("y2",t.canvas.padding[1]);case"left":return e.attr("x1",t.canvas.padding[0]).attr("y1",t.canvas.padding[1]).attr("x2",t.canvas.padding[0]).attr("y2",t.canvas.height-t.canvas.padding[1]);case"right":return e.attr("x1",t.canvas.width-t.canvas.padding[0]).attr("y1",t.canvas.padding[1]).attr("x2",t.canvas.width-t.canvas.padding[0]).attr("y2",t.canvas.height-t.canvas.padding[1]);default:throw new Error("Unknown orientation: ",t.axis.orient)}},t.prototype.renderGrid=function(t){var e,r;return null==t&&(t={"class":null,color:null,scale:null,height:null,width:null,padding:null,orient:null,trans:null,label:null,format:null}),r=d3.svg.axis().scale(t.scale).orient(t.orient).tickSize(t.tickSize),null!=t.format&&(r.ticks(d3.time.months,1),r.tickFormat(d3.time.format(t.format))),e=this._CANVAS.append("g").attr("transform",t.trans).attr("class","axis "+t["class"]).call(r),this.renderLabel(t),e.selectAll("line").attr("stroke",t.color).attr("stroke-width",t.strokeWidth),e.selectAll("line").attr("stroke",t.tickColor).attr("width-stroke",t.tickWidth),e.selectAll("path").style("display","none"),e.selectAll("text").attr("fill",t.label.color).attr("font-size",t.label.size)},t.prototype.renderXGrid=function(){var t,e,r,i,n,a,o;switch(r=this._CONF.canvas.padding[1],t=this._CONF.canvas.height,o=this._CONF.canvas.width,e=this._CONF.canvas.label.x,e.textAnchor="middle",this._CONF.axis.x.orient){case"bottom":a="translate(0, "+r+")",e.trans="translate("+o/2+", "+(t-2)+")";break;case"top":a="translate(0, "+(t-r)+")",e.trans="translate("+o/2+", "+r/2+")";break;default:throw new Error("Unknown orientation: ",this._CONF.axis.x.orient)}return n=this._CONF.axis.x.tickSize,"full"===n&&(n=t-2*r),i={"class":"x",height:this._CONF.canvas.height,width:this._CONF.canvas.width/2,scale:this._SCALE.width,tickSize:n,padding:r,label:e,orient:this._CONF.axis.x.orient,trans:a,tickColor:this._CONF.axis.x.tickColor,tickWidth:this._CONF.axis.x.tickWidth,color:this._CONF.axis.x.color,strokeWidth:this._CONF.axis.x.strokeWidth,format:this._CONF.axis.x.format},this.renderGrid(i)},t.prototype.renderYGrid=function(){var t,e,r,i,n,a,o;switch(r=this._CONF.canvas.padding,t=this._CONF.canvas.height,o=this._CONF.canvas.width,e=this._CONF.canvas.label.y,this._CONF.axis.y.orient){case"left":a="translate("+r[0]+", 0)",e.trans="rotate(-90) translate("+-t/2+", "+(r[0]+10)+")";break;case"right":a="translate("+(o-r[0])+", 0)",e.trans="translate("+(o-r[0])+", "+r[1]/2+")",e.textAnchor="middle";break;default:throw new Error("Unknown orientation: ",this._CONF.axis.y.orient)}return n=this._CONF.axis.y.tickSize,"full"===n&&(n=-o+2*r[0]),i={"class":"y",height:this._CONF.canvas.height,width:this._CONF.canvas.width,scale:this._SCALE.height,tickSize:n,padding:r,label:e,orient:this._CONF.axis.y.orient,trans:a,tickColor:this._CONF.axis.y.tickColor,tickWidth:this._CONF.axis.y.tickWidth,color:this._CONF.axis.y.color,strokeWidth:this._CONF.axis.y.strokeWidth,format:this._CONF.axis.y.format},this.renderGrid(i)},t.prototype.prepareSeries=function(t){var e,r,i,n,o,s,l,c,d,h,u,f,p;for(c=new a.Main(this._CONF.point.color),e=n=0,s=t.length;s>n;e=++n)for(i=t[e],d=i.data,o=0,l=d.length;l>o;o++)r=d[o],r.serie=e,r.config={},r.config.color=this._CONF.point.color,c.isDefined()&&(r.config.color=c.color(e)),null!=(null!=(h=i.config)?h.color:void 0)&&(r.config.color=i.config.color),r.config.r=(null!=(u=i.config)?u.r:void 0)||this._CONF.point.r,r.config.stroke={width:this._CONF.point.stroke.width},null!=(null!=(f=i.config)&&null!=(p=f.stroke)?p.width:void 0)&&(r.config.stroke.width=i.config.stroke.width);return t},t.prototype.renderPoints=function(){var t,e,r,i,n,a,o,s,l,c,d,h,u;if(s=this,a=this._CONF,n=this._CANVAS,o=this.effects,h=this.tooltip.show,c=this.tooltip.hide,d=this._TOOLTIP,l=a.tooltip.callback,u=a.tooltip.template,"string"==typeof l&&(l=this.tooltip.callbacks[l]),"string"==typeof u&&(u=this.tooltip.templates[u]),e=this._SCALE.width,t=this._SCALE.height,r=this._CANVAS.selectAll(".series").data(this._SERIES).enter().append("g").attr("class","series").attr("id",function(t,e){return""+e}).attr("title",function(t){return t.name}),("line"===a.canvas.render||"dotline"===a.canvas.render)&&(i=d3.svg.line().interpolate("linear").x(function(t){return e(t.x)}).y(function(e){return t(e.y)}),r.append("path").attr("class","line").attr("d",function(t){return i(t.data)}).attr("stroke",function(t){return t.data[0].config.color}).attr("fill","none").attr("stroke-width",a.line.stroke.width)),"dot"===a.canvas.render||"dotline"===a.canvas.render)return r.selectAll(".circle").data(function(t){return t.data}).enter().append("circle").attr("cx",function(t){return e(t.x)}).attr("cy",function(e){return t(e.y)}).attr("data-x",function(t){return t.x}).attr("data-y",function(t){return t.y}).attr("data-color",function(t){return t.config.color}).attr("r",function(t){return t.config.r}).attr("stroke",function(t){if("empty"===a.point.mode)return t.config.color;if("fill"===a.point.mode)return a.canvas.bgcolor;throw new Error("Unknown point mode '"+a.point.mode+"'")}).attr("fill",function(t){if("empty"===a.point.mode)return a.canvas.bgcolor;if("fill"===a.point.mode)return t.config.color;throw new Error("Unknown point mode '"+a.point.mode+"'")}).attr("stroke-width",function(t){var e,r,i;return null!=(e=null!=(r=t.config)&&null!=(i=r.stroke)?i.width:void 0)?e:a.point.stroke.width}).on("mouseover",function(t){var e,r;return r=a.point.onMouseover,"string"==typeof r&&(r=o[r].onMouseover),r({canvas:n,circleNode:this,data:t}),e=l({format:a.tooltip.format,canvas:n,tooltipNode:d,circleNode:this,data:t}),d.html(u(e)),h(this,{canvas:{width:a.canvas.width,height:a.canvas.height},tooltip:{alwaysInside:a.tooltip.alwaysInside}},d,t)}).on("mouseout",function(t){var e;return e=a.point.onMouseout,"string"==typeof e&&(e=o[e].onMouseout),e({canvas:n,circleNode:this,data:t}),c(d)});throw new Error("Unknown render value '"+n.render+"'")},t.prototype.renderTooltip=function(){return null==this._TOOLTIP?this._TOOLTIP=d3.select(this._CONF.canvas.selector).append("div").attr("class","tooltip").style("opacity",0).attr("left",0).attr("top",0):void 0},t.prototype.renderCrossValue=function(t){var e,r,i,n,a;return null==t&&(t={scale:null,canvas:null,confCanvas:null,confCrossV:null}),r=t.canvas.append("g").style("opacity",0),e=r.append("rect"),i=r.append("text").text("AgChartPile").attr("font-size",t.confCrossV.x.fontSize).attr("text-anchor","middle").attr("fill",t.confCrossV.x.fontColor),n=i.node().getBBox(),e.attr("fill",t.confCrossV.x.color).attr("rx",t.confCrossV.x.radius).attr("ry",t.confCrossV.x.radius),t.confCrossV.x.show?(a=null,t.canvas.on("mousemove.crossValue",function(){var o,s,l,c;switch(r.transition().duration(300).style("opacity",1),clearTimeout(a),o=d3.mouse(this)[0],o<t.confCanvas.padding[0]?o=t.confCanvas.padding[0]:o>t.confCanvas.width-t.confCanvas.padding[0]&&(o=t.confCanvas.width-t.confCanvas.padding[0]),l=o,o<t.confCanvas.padding[0]+n.width/2?l=t.confCanvas.padding[0]+n.width/2:o>t.confCanvas.width-t.confCanvas.padding[0]-n.width/2&&(l=t.confCanvas.width-t.confCanvas.padding[0]-n.width/2),i.attr("y",n.height-.25*n.height).attr("x",n.width/2),e.attr("width",n.width).attr("height",n.height),c=t.scale.width.invert(o),t.confCrossV.x.orient){case"top":s=t.confCanvas.padding[1];break;case"bottom":s=t.confCanvas.height-t.confCanvas.padding[1]}return i.text(t.confCrossV.x.format(c)),r.attr("transform","translate("+(l-n.width/2)+", "+s+")"),r.attr("cy",d3.mouse(this)[1]),a=setTimeout(function(){return r.transition().duration(500).style("opacity",0)},2e3)})):void 0},t.prototype.renderCross=function(t){var e,r,i,n,a,o,s,l,c;return null==t&&(t={canvas:nulle,confCanvas:null,confCross:null}),n=t.confCanvas.padding[0],a=t.confCanvas.padding[1],r=t.confCross.x.offset,i=t.confCross.y.offset,s=t.confCanvas.width,e=t.confCanvas.height,l=t.canvas.append("line").attr("class","crossX").attr("x1",-s).attr("y1",a).attr("x2",-s).attr("y2",e-a).attr("stroke",t.confCross.x.color).attr("stroke-width",t.confCross.x.stroke),c=t.canvas.append("line").attr("class","crossY").attr("x1",n).attr("y1",-e).attr("x2",s-n).attr("y2",-e).attr("stroke",t.confCross.y.color).attr("stroke-width",t.confCross.y.stroke),o=null,t.canvas.on("mousemove.tooltip",function(){var d,h;return clearTimeout(o),c.transition().style("opacity",1),l.transition().style("opacity",1),d=d3.mouse(this)[0],h=d3.mouse(this)[1],t.confCross.x.show&&d>=n+r&&s-n+r>=d&&l.attr("x1",d-r).attr("x2",d-r),t.confCross.y.show&&h>=a+i&&e-a+i>=h&&c.attr("y1",h-i).attr("y2",h-i),o=setTimeout(function(){return c.transition().duration(500).style("opacity",0),l.transition().duration(500).style("opacity",0)},2e3)})},t.prototype.renderLogo=function(t){return"bottom"===t.y&&(t.y=this._CONF.canvas.height-this._CONF.canvas.padding[1]-t.height),"top"===t.y&&(t.y=this._CONF.canvas.padding[1]),"right"===t.x&&(t.x=this._CONF.canvas.width-this._CONF.canvas.padding[0]-t.width),"left"===t.y&&(t.x=this._CONF.canvas.padding[0]),this._CANVAS.append("image").attr("width",t.width).attr("height",t.height).attr("x",t.x).attr("y",t.y).attr("opacity",t.opacity).attr("xlink:href",this._CONF.logo.url)},t.prototype.render=function(){return null==this._CANVAS&&(this._CANVAS=this.createCanvas()),this.renderLogo({opacity:this._CONF.logo.opacity,url:this._CONF.logo.url,width:this._CONF.logo.width,height:this._CONF.logo.height,x:this._CONF.logo.x,y:this._CONF.logo.y}),this.renderCross({canvas:this._CANVAS,confCanvas:this._CONF.canvas,confCross:this._CONF.canvas.cross}),this.renderXGrid(),this.renderYGrid(),this.renderAxis({canvas:this._CONF.canvas,axis:this._CONF.axis.x}),this.renderAxis({canvas:this._CONF.canvas,axis:this._CONF.axis.y}),this.renderCrossValue({scale:this._SCALE,canvas:this._CANVAS,confCanvas:this._CONF.canvas,confCrossV:this._CONF.canvas.crossValue}),this.renderTooltip(),this.renderPoints(),this.renderTitle({title:this._CONF.canvas.title,padding:this._CONF.canvas.padding}),this.renderPluginMenu({selector:this._CONF.canvas.selector,confPlugins:this._CONF.plugins}),this.renderLegends()},t.prototype.renderLegends=function(){var t,e,r,i,n,a,o,s,l,c,d,h,u,f,p,g;console.log("Render legends"),d=30,l=10,u=100,c=2,f=this._CONF.canvas.width-2*this._CONF.canvas.padding[0],o=this._CONF.canvas.padding[0],s=this._CONF.canvas.height-12,e=0,r=15,n=this._CANVAS.append("g").attr("transform","translate("+o+", "+s+")"),p=this._SERIES,g=[];for(i in p)h=p[i],i=parseInt(i),t=h.data[0].config.color,console.log(h.name,t),a=n.append("g").attr("transform","translate("+e+", "+r+")"),a.append("rect").attr("width",d).attr("height",10).attr("fill",t).attr("stroke","#afafaf").attr("stroke-width","1"),a.append("text").attr("x",c+d).attr("y",10).attr("fill","#3f3f3f").attr("font-size",10).text(h.name),console.log(e,f),e+d+u+c>f-d-u-c?(console.log(h.name,"is out"),e=0,r+=15,g.push(this._CANVAS.attr("height",this._CONF.canvas.height+r))):g.push(e+=d+u+c);return g},t.prototype.renderPluginMenu=function(t){var e,r,i,n,a,o;null==t&&(t={selector:null,confPlugins:{}}),a=$("<div/>",{id:"pluginsMenu"}).appendTo(t.selector),a.css({position:"absolute",left:this._CONF.canvas.width+1,top:"0px",opacity:.1}),a.on("mouseover.menuPlugin",function(){return a.animate({opacity:1},10)}),a.on("mouseout.menuPlugin",function(){return a.animate({opacity:.1},10)}),o=[];for(n in t.confPlugins)t.confPlugins[n].enable?(i=$("<img/>",{src:"icons/"+n+".png",width:"30px"}).appendTo(a),i.css({cursor:"pointer"}),e=this.plugins[n].onClick,r=this,o.push(i.click(function(){return e(r,t.selector,t.confPlugins[n])}))):o.push(void 0);return o},t.prototype.plugins={exportation:{onClick:function(t,e,r){var i,n,a,o,s,l,c,d,h,u,f,p;return o=$(e).find("image").remove(),u=t._CANVAS.append("text").attr("fill",r.copyright.color).attr("font-size",r.copyright.fontSize+"px").text(r.copyright.text),p=t._CONF.canvas.width,a=t._CONF.canvas.height,f=u.node().getBBox(),l=p-t._CONF.canvas.padding[0]-10,c=a-t._CONF.canvas.padding[1]-3,u.attr("text-anchor","end"),u.attr("transform","translate("+l+", "+c+")"),d=$(e).find("svg")[0],h=(new XMLSerializer).serializeToString(d),n=document.createElement("canvas"),$("body").append(n),canvg(n,h),n.remove(),s=n.toDataURL("image/png"),i=document.createElement("a"),i.href=s,i.download="agflow.png",$("body").append(i),i.click(),t.renderLogo({opacity:t._CONF.logo.opacity,url:t._CONF.logo.url,width:t._CONF.logo.width,height:t._CONF.logo.height,x:t._CONF.logo.x,y:t._CONF.logo.y}),u.remove()}}},t.prototype.tooltip={show:function(t,e,r,i){var n,a,o,s,l,c;return n=d3.mouse(t)[0],a=d3.mouse(t)[1],s=n+i.config.stroke.width,l=a+i.config.stroke.width,e.tooltip.alwaysInside&&(n>e.canvas.width/2&&(c=parseFloat(r.style("width").replace("px","")),s=n-i.config.stroke.width-c),a>e.canvas.height/2&&(o=parseFloat(r.style("height").replace("px","")),l=a-i.config.stroke.width-o)),r.style("left",s+"px").style("top",l+"px").transition().duration(200).style("opacity",.9)},hide:function(t){return t.transition().duration(500).style("opacity",0)},templates:{singlePoint:function(t){return"<div>"+t[0].serieName+"<div class='swatch'"+("style='background-color: "+t[0].color+"'></div>")+"</div>"+("<div>"+t[0].x+" "+t[0].y+"</div>")},multipleVertical:function(t){var e,r,i,n;for(r="",i=0,n=t.length;n>i;i++)e=t[i],r+="<div>"+e.serieName+"<div class='swatch'"+("style='background-color: "+e.color+"'></div>")+"</div>"+("<div>"+e.x+" "+e.y+"</div>");return r},multipleVerticalInverted:function(t){var e,r,i,n;for(r=""+t[0].x,i=0,n=t.length;n>i;i++)e=t[i],r+="<div>"+e.serieName+": "+e.y+"<div class='swatch'"+("style='background-color: "+e.color+"'></div>")+"</div>";return r}},callbacks:{singlePoint:function(t){var e,r,i;return r=t.circleNode,e=parseFloat(r.getAttribute("data-x")),null!=(null!=(i=t.format)?i.x:void 0)&&(e=t.format.x(e)),[{color:t.data.config.color,serieName:t.circleNode.parentNode.getAttribute("title"),x:e,y:t.data.y.toFixed(2)}]},multipleVertical:function(t){var e,r,i,n,a;return n=t.circleNode,e=n.getAttribute("cx"),i=parseFloat(n.getAttribute("data-x")),null!=(null!=(a=t.format)?a.x:void 0)&&(i=t.format.x(i)),r=[],$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){return r.push({serieName:e.parentNode.getAttribute("title"),color:e.getAttribute("data-color"),y:parseFloat(e.getAttribute("data-y")).toFixed(2),x:i})}),r},multipleVerticalInverted:function(t){var e,r,i,n,a;return n=t.circleNode,e=n.getAttribute("cx"),i=parseFloat(n.getAttribute("data-x")),null!=(null!=(a=t.format)?a.x:void 0)&&(i=t.format.x(i)),r=[],$(t.canvas[0]).find("circle[cx='"+e+"']").each(function(t,e){return r.push({serieName:e.parentNode.getAttribute("title"),color:e.getAttribute("data-color"),y:parseFloat(e.getAttribute("data-y")).toFixed(2),x:i})}),r}}},t}()}),require.register("initialize",function(t,e,r){var i,n,a,o,s;r.exports=n={},i=e("agchart"),s=e("utils/time"),a=function(t,e){var r,i,n,a;for(null==e&&(e=1),r=[],i=n=0,a=t-1;e>0?a>=n:n>=a;i=n+=e)r.push({x:1e3*i,y:100*Math.random()});return r},o=function(t,e,r){var i,n,a,o;for(null==e&&(e=1),i=[],n=a=0,o=t-1;e>0?o>=a:a>=o;n=a+=e)i.push({x:1e3*n,y:10*r(n)+50});return i},n.run=function(){var t,e,r,n,a;return r=new s.Main({lang:"en"}),n=function(t){var e,r;return e=new Date(t),(r=d3.time.format("%b '%y"))(e)},a=function(t){return console.log(t)},e="multipleVerticalInverted",t=new i.Main({config:{canvas:{render:"dotline",width:900,height:400,title:{color:"#4f4f4f",size:16,text:"AgChart demonstration",border:{padding:[8,1]}},label:{x:{text:"Some label X",size:10,color:"#7f7f7f"},y:{text:"Some label Y",size:10,color:"#7f7f7f"}},selector:"#chart1",padding:[50,50],cross:{x:{show:!0,color:"#44A0FF"},y:{show:!0,color:"#FFA044"}}},logo:{url:"agflow-logo.png",width:100,height:50,x:"right",y:"bottom",opacity:.3},tooltip:{template:e,callback:e,format:{x:n}},line:{stroke:{width:2}},point:{onMouseover:e,onMouseout:e,mode:"fill",r:4,color:"paired",stroke:{width:1,color:null}},axis:{y:{tickSize:"full",tickColor:"#ebebeb",tickWidth:2,orient:"right"},x:{orient:"bottom",tickWidth:2,tickColor:"#ebebeb",format:"%b",tickSize:"full"}}},series:[{name:"Serie 1",data:o(10368e3,129600,function(t){return 10*Math.cos(t)}),config:{stroke:{width:1}}},{name:"Serie 2",data:o(10368e3,259200,Math.tan),config:{color:"#ff0001",stroke:{width:1}}},{name:"Serie 3",data:o(10368e3,172800,Math.sin),config:{stroke:{width:1}}},{name:"Serie",data:[{x:1,y:100}]},{name:"Serie",data:[{x:1,y:110}]},{name:"Serie",data:[{x:1,y:120}]},{name:"Serie",data:[{x:1,y:130}]},{name:"Serie",data:[{x:1,y:140}]},{name:"Serie",data:[{x:1,y:150}]},{name:"Serie",data:[{x:1,y:160}]},{name:"Serie",data:[{x:1,y:170}]},{name:"Serie",data:[{x:1,y:180}]},{name:"Serie",data:[{x:1,y:190}]},{name:"Serie",data:[{x:1,y:200}]}]}),t.render()}}),require.register("utils/palette",function(t,e,r){var i,n;r.exports=n={},n.Main=i=function(){function t(t){var e;e=this.palettes(),this._PALETTE=e[t],this._INDEX=0}return t.prototype.isDefined=function(){return null!=this._PALETTE?!0:!1},t.prototype.color=function(t){return this._PALETTE[t%this._PALETTE.length]},t.prototype.palettes=function(){var t;return t={},t.spectrum14=["#ecb796","#dc8f70","#b2a470","#92875a","#716c49","#d2ed82","#bbe468","#a1d05d","#e7cbe6","#d8aad6","#a888c2","#9dc2d3","#649eb9","#387aa3"].reverse(),t.spectrum2000=["#57306f","#514c76","#646583","#738394","#6b9c7d","#84b665","#a7ca50","#bfe746","#e2f528","#fff726","#ecdd00","#d4b11d","#de8800","#de4800","#c91515","#9a0000","#7b0429","#580839","#31082b"],t.spectrum2001=["#2f243f","#3c2c55","#4a3768","#565270","#6b6b7c","#72957f","#86ad6e","#a1bc5e","#b8d954","#d3e04e","#ccad2a","#cc8412","#c1521d","#ad3821","#8a1010","#681717","#531e1e","#3d1818","#320a1b"],t.classic9=["#423d4f","#4a6860","#848f39","#a2b73c","#ddcb53","#c5a32f","#7d5836","#963b20","#7c2626","#491d37","#2f254a"].reverse(),t.httpStatus={503:"#ea5029",502:"#d23f14",500:"#bf3613",410:"#efacea",409:"#e291dc",403:"#f457e8",408:"#e121d2",401:"#b92dae",405:"#f47ceb",404:"#a82a9f",400:"#b263c6",301:"#6fa024",302:"#87c32b",307:"#a0d84c",304:"#28b55c",200:"#1a4f74",206:"#27839f",201:"#52adc9",202:"#7c979f",203:"#a5b8bd",204:"#c1cdd1"},t.colorwheel=["#b5b6a9","#858772","#785f43","#96557e","#4682b4","#65b9ac","#73c03a","#cb513a"].reverse(),t.cool=["#5e9d2f","#73c03a","#4682b4","#7bc3b8","#a9884e","#c1b266","#a47493","#c09fb5"],t.munin=["#00cc00","#0066b3","#ff8000","#ffcc00","#330099","#990099","#ccff00","#ff0000","#808080","#008f00","#00487d","#b35a00","#b38f00","#6b006b","#8fb300","#b30000","#bebebe","#80ff80","#80c9ff","#ffc080","#ffe680","#aa80ff","#ee00cc","#ff8080","#666600","#ffbfff","#00ffcc","#cc6699","#999900"],t.paired=["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],t},t}()}),require.register("utils/time",function(t,e,r){var i,n;r.exports=n={},n.Main=i=function(){function t(t){var e;null==t&&(t={}),this._CONF={lang:null!=(e=t.lang)?e:"enl"},this._DATE=new Date,this._TIMESTAMP=this._DATE.getTime(),this._MONTHSNAME={},this._MONTHSNAME.en=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],this._MONTHSNAME.enl=["January","February","March","April","May","June","July","August","September","October","November","December"],this._MONTHSNAME.fr=["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"],this._MONTHSNAME.frl=["Janvier","Février","Mars","Avril","Mai","Juin","Juil","Août","Septembre","Octobre","Novembre","Décembre"]}return t.prototype.monthsName=function(){return this._MONTHSNAME[this._CONF.lang]},t.prototype.getMonth=function(){return this.monthsName()[this._DATE.getMonth()]},t.prototype.getDay=function(){return this._DATE.getDay()},t.prototype.getFullDate=function(){return this._DATE.getDay()+" "+this.getMonth()+" "+this._DATE.getYear()+" "+this._DATE.getHours()+":"+this._DATE.getMinutes()},t.prototype.getDate=function(){return this._DATE},t.prototype.setTimestamp=function(t){return null==t?this._TIMESTAMP:(this._DATE=new Date(1e3*parseInt(t)),this._TIMESTAMP=parseInt(t))},t}()});