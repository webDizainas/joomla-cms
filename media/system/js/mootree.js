var MooTreeIcon="I,L,Lminus,Lplus,Rminus,Rplus,T,Tminus,Tplus,_closed,_doc,_open,minus,plus".split(","),MooTreeControl=new Class({initialize:function(a,b){b.control=this;b.div=a.div;this.root=new MooTreeNode(b);this.index={};this.enabled=!0;this.theme=a.theme||"mootree.gif";this.loader=a.loader||{icon:"mootree_loader.gif",text:"Loading...",color:"#a0a0a0"};this.selected=null;this.mode=a.mode;this.grid=a.grid;this.onExpand=a.onExpand||new Function;this.onSelect=a.onSelect||new Function;this.onClick=
a.onClick||new Function;this.root.update(!0)},insert:function(a){a.control=this;return this.root.insert(a)},select:function(a){this.onClick(a);a.onClick();this.selected!==a&&(this.selected&&(this.selected.select(!1),this.onSelect(this.selected,!1)),this.selected=a,a.select(!0),this.onSelect(a,!0))},expand:function(){this.root.toggle(!0,!0)},collapse:function(){this.root.toggle(!0,!1)},get:function(a){return this.index[a]||null},adopt:function(a,b){void 0===b&&(b=this.root);this.disable();this._adopt(a,
b);b.update(!0);document.id(a).destroy();this.enable()},_adopt:function(a,b){e=document.id(a);for(var c=0,d=e.getChildren(),c=0;c<d.length;c++)if("LI"==d[c].nodeName){for(var f={text:""},i="",h=null,l=null,g=0,h=0,k=null,j=d[c].getChildren(),g=0;g<j.length;g++)switch(j[g].nodeName){case "A":for(h=0;h<j[g].childNodes.length;h++)switch(k=j[g].childNodes[h],k.nodeName){case "#text":f.text+=k.nodeValue;break;case "#comment":i+=k.nodeValue}f.data=j[g].getProperties("href","target","title","name");break;
case "UL":l=j[g]}if(""!=f.label){f.data.url=f.data.href;if(""!=i){i=i.split(";");for(h=0;h<i.length;h++)g=i[h].trim().split(":"),2==g.length&&(f[g[0].trim()]=g[1].trim())}$chk(d[c].id)&&(f.id="node_"+d[c].id);h=b.insert(f);l&&this._adopt(l,h)}}},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0;this.root.update(!0,!0)}}),MooTreeNode=new Class({initialize:function(a){this.text=a.text;this.id=a.id||null;this.nodes=[];this.parent=null;this.last=!0;this.control=a.control;this.selected=
!1;this.color=a.color||null;this.data=a.data||{};this.onExpand=a.onExpand||new Function;this.onSelect=a.onSelect||new Function;this.onClick=a.onClick||new Function;this.open=a.open?!0:!1;this.icon=a.icon;this.openicon=a.openicon||this.icon;this.id&&(this.control.index[this.id]=this);this.div={main:(new Element("div")).addClass("mooTree_node"),indent:new Element("div"),gadget:new Element("div"),icon:new Element("div"),text:(new Element("div")).addClass("mooTree_text"),sub:new Element("div")};this.div.main.adopt(this.div.indent);
this.div.main.adopt(this.div.gadget);this.div.main.adopt(this.div.icon);this.div.main.adopt(this.div.text);document.id(a.div).adopt(this.div.main);document.id(a.div).adopt(this.div.sub);this.div.gadget._node=this;this.div.gadget.onclick=this.div.gadget.ondblclick=function(){this._node.toggle()};this.div.icon._node=this.div.text._node=this;this.div.icon.onclick=this.div.icon.ondblclick=this.div.text.onclick=this.div.text.ondblclick=function(){this._node.control.select(this._node)}},insert:function(a){a.div=
this.div.sub;a.control=this.control;a=new MooTreeNode(a);a.parent=this;var b=this.nodes;b.length&&(b[b.length-1].last=!1);b.push(a);a.update();1==b.length&&this.update();1<b.length&&b[b.length-2].update(!0);return a},remove:function(){var a=this.parent;this._remove();a.update(!0)},_remove:function(){for(var a=this.nodes;a.length;)a[a.length-1]._remove();delete this.control.index[this.id];this.div.main.destroy();this.div.sub.destroy();this.parent&&(a=this.parent.nodes,a.erase(this),a.length&&(a[a.length-
1].last=!0))},clear:function(){for(this.control.disable();this.nodes.length;)this.nodes[this.nodes.length-1].remove();this.control.enable()},update:function(a,b){var c=!0;this.control.enabled||(this.invalidated=!0,c=!1);b&&(this.invalidated?this.invalidated=!1:c=!1);if(c){this.div.main.className="mooTree_node"+(this.selected?" mooTree_selected":"");for(var c=this,d="";c.parent;)c=c.parent,d=this.getImg(c.last||!this.control.grid?"":"I")+d;this.div.indent.innerHTML=d;c=this.div.text;c.empty();c.appendText(this.text);
this.color&&(c.style.color=this.color);this.div.icon.innerHTML=this.getImg(this.nodes.length?this.open?this.openicon||this.icon||"_open":this.icon||"_closed":this.icon||("folders"==this.control.mode?"_closed":"_doc"));this.div.gadget.innerHTML=this.getImg((this.control.grid?this.control.root==this?this.nodes.length?"R":"":this.last?"L":"T":"")+(this.nodes.length?this.open?"minus":"plus":""));this.div.sub.style.display=this.open?"block":"none"}a&&this.nodes.forEach(function(a){a.update(!0,b)})},getImg:function(a){var b=
'<div class="mooTree_img"';if(""!=a){var c=this.control.theme,d=MooTreeIcon.indexOf(a);-1==d&&(a=a.split("#"),c=a[0],d=2==a.length?parseInt(a[1])-1:0);b+=' style="background-image:url('+c+"); background-position:-"+18*d+'px 0px;"'}return b+"></div>"},toggle:function(a,b){this.open=void 0===b?!this.open:b;this.update();this.onExpand(this.open);this.control.onExpand(this,this.open);a&&this.nodes.forEach(function(a){a.toggle(!0,this.open)},this)},select:function(a){this.selected=a;this.update();this.onSelect(a)},
load:function(a,b){this.loading||(this.loading=!0,this.toggle(!1,!0),this.clear(),this.insert(this.control.loader),function(){(new Request({method:"GET",url:a,onSuccess:this._loaded.bind(this),onFailure:this._load_err.bind(this)})).send(b||"")}.bind(this).delay(20))},_loaded:function(a,b){this.control.disable();this.clear();this._import(b.documentElement);this.control.enable();this.loading=!1},_import:function(a){for(var a=a.childNodes,b=0;b<a.length;b++)if("node"==a[b].tagName){for(var c={data:{}},
d=a[b].attributes,f=0;f<d.length;f++)switch(d[f].name){case "text":case "id":case "icon":case "openicon":case "color":case "open":c[d[f].name]=d[f].value;break;default:c.data[d[f].name]=d[f].value}c=this.insert(c);c.data.load&&(c.open=!1,c.insert(this.control.loader),c.onExpand=function(){this.load(this.data.load);this.onExpand=new Function});a[b].childNodes.length&&c._import(a[b])}},_load_err:function(){window.alert("Error loading: "+this.text)}});
