(function(window,undefined){

var document=window.document;
var fView=function(paper,size){
	return new fView.fn.init(paper,size);
	//初始化
};
//初始界面
fView.fn=fView.prototype={
	constructor: fView,
	init:function(paper,size){
		this.paper=typeof(paper)=="string"?$("#paper"):paper;
		var dwidth=window.screen.width;
		if(dwidth<1080){
			dwidth=dwidth+1024;
		}
		//this.drawCanvas=new Raphael(paper,dwidth,window.screen.height+1024);
		this.drawCanvas=new Raphael(paper,1284,596);
		this.drawCanvas.readDataSet=this.drawCanvas.set();
		return this;
	},

	//画布
	drawCanvas:null,
	paper:null,
	//加载页面布局数据
	load:function(jsonStr){
		if(jsonStr.length>0){
			for(var i = 0 ; i < jsonStr.length;i++){
				this.attachComponents(jsonStr[i]);
			}
		}
		return this;
	},
	//刷新当前页面数据
	setData:function(data){
		var tag;
		this.drawCanvas.forEach(function(el){
			tag=el.data("tag")+"";
			if(el.data("type")=="text"){
				for(var i=0;i<data.length;i++){
					if(tag==data[i].tag_id){
            var value=data[i].data_value?data[i].data_value:"-";
						el.attr({text:data[i].tag_name+":"+value+data[i].data_unit});
					}
				}
			}
		});
	},
	//添加形状类型
	attachComponents:function(_components){
		var set,el;
		if(_components){
			set=this.drawCanvas.add([_components]);
			if(set[0]){
				el=set[0];
				el.loadData(_components);//初始化当前画布数据
				el.addEvent();//添加事件
				el.initData();//初始化组件数据
				el.setAttrByData();//绘制对象路径，显示
				el.transBydata();//设置当前对象的位置范围
				el.dataSet();//放置对象
			}
		}else{
			throw ("con't find "+type+" components");
		}
	},
	//设置组态整体的位置
	zoomsel:function(width,height){
		ww=$("#divoutside").width();
		hh=$("#divoutside").height();
		if(width&&height){
			if(width>ww||height>hh){
				this.drawCanvas.setSize(ww-50,hh-50);
				this.drawCanvas.setViewBox(0, 0, width, height, false);
			}
			if(height>hh&&height/hh>width/ww){
				width=width*hh/height;
			}
			
			if(width<ww){
				$("#paper").width(width);
			}
		}
	}

};
fView.fn.init.prototype=fView.fn;
window.fView=fView;
})(window);

