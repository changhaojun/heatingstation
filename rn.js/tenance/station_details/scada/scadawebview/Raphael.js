/**
 * 此对象主要是对Raphael的画布上的每一个元素的操作
 */

//初始化组件数据
Raphael.el.initData=function(){
	var ds="";
	ds+="{";
	ds+="tag:'"+(this.data("tag")?this.data("tag"):0)+"'";
	//ds+=",type:"+(this.data("type")?"'"+this.data("type")+"'":"'none'");
	ds+=",shape:"+(this.data("shape")?"'"+this.data("shape")+"'":"'"+this.paper.curOptObj+"'");
	//ds+=",name:'"+(this.data("name")?this.data("name"):"")+"'";
	//ds+=",value:'"+(this.data("value")?this.data("value"):this.attr("text")?this.attr("text"):"")+"'";				
	//ds+=",up:"+(this.data("up")?this.data("up"):null);//up num    ***********
	//ds+=",dwn:"+(this.data("dwn")?this.data("dwn"):null);//down num  *********
	//ds+=",u:'"+(this.data("u")?this.data("u"):"")+"'";//unit ******************
	ds+=",wr:"+(this.data("wr")?this.data("wr"):0);//write
	ds+=",rd:"+(this.data("rd")?this.data("rd"):1);//read data************
	//ds+=",isdt:"+(this.data("isdt")?this.data("isdt"):0);//is data show
	ds+=",b:"+(this.data("b")?this.data("isdt"):0);//bool or float
	//ds+=",g:"+(this.data("g")?"'"+this.data("g")+"'":null);//gradient ***********
	//ds+=",opac:"+(this.data("opac")?this.data("opac"):1);//opacity
	//ds+=",path:"+(this.data("path")?this.data("path"):null);//path
	ds+=",rad:"+(this.data("rad")?this.data("rad"):0);//cirle r
	ds+=",rx:"+(this.data("rx")?this.data("rx"):0);//ellipse rx
	ds+=",ry:"+(this.data("ry")?this.data("ry"):0);//eliipse ry
	//ds+=",src:'"+(this.data("src")?this.data("src"):this.attr("src"))+"'";//img src
	ds+=",dx:"+(this.data("dx")?this.data("dx"):0);//move x
	ds+=",dy:"+(this.data("dy")?this.data("dy"):0);//move y
	ds+=",w:"+(this.data("w")?this.data("w"):this.attr("width")?this.attr("width"):0);//width
	ds+=",h:"+(this.data("h")?this.data("h"):this.attr("height")?this.attr("height"):0);//height
	ds+=",sw:"+(this.data("sw")?this.data("sw"):0);//stroke-width
	ds+=",s:"+(this.data("s")?this.data("s"):null);//stroke
	ds+=",f:"+(this.data("f")?this.data("f"):"'#ffffff'");//fill
	ds+=",sx:"+(this.data("sx")?this.data("sx"):1);//scale-x
	ds+=",sy:"+(this.data("sy")?this.data("sy"):1);//scale-y
	ds+=",r:"+(this.data("r")?this.data("r"):0);//旋转角度
	//ds+="},obj:{";
	ds+=",type:'"+this.type+"'";
	//ds+="}";
	ds+="}";
	this.data("ds",ds);
};
//初始化当前画布数据
Raphael.el.loadData=function(p_data){
	var json,dataObj;
	if(p_data){
		if(typeof(p_data)=="object"){
			dataObj=p_data;
		}else{
			dataObj=eval("("+p_data+")");
		}
	}else{
		if(this.data("ds")){
			json=eval("("+this.data("ds")+")");
			dataObj=json;
		}
	}
	this.data(dataObj);
};
//添加事件
Raphael.el.addEvent=function(){
	this.unclick();
	this.click(elClick);
};
//Raphael对象数据集
Raphael.el.setAttrByData=function(){
	//绘制对象路径，显示
	this.attr({'stroke-width':this.data("sw")
				,path:components[this.data("shape")].path
				,text:""
				,"opacity":1
				,'font-size':18
				,'font-weight:':500
				,src:components[this.data("shape")].src
				,width:this.data("w")
				,height:this.data("h")
				,r:this.data("rad")
				,rx:this.data("rx")
				,ry:this.data("ry")
				,fill:this.data("f")
				,cursor:"pointer"
				,x:0
				,y:0
			});

};

//放置对象
Raphael.el.dataSet=function(){
		this.paper.readDataSet.exclude(this);
};

//设置当前对象的位置范围
Raphael.el.transBydata=function(){
	var transtr=""
		,dx=this.data("dx")
		,dy=this.data("dy")
		,maxw=this.paper.width-this.data("w")*this.data("sx")
		,maxh=this.paper.height-this.data("h")*this.data("sy");
	transtr+="t";
	dx=dx<0?0:dx>maxw?maxw:dx;
	this.data("dx",dx);
	dy=dy<0?0:dy>maxh?maxh:dy;
	this.data("dy",dy);
	transtr+=dx;
	transtr+=",";
	transtr+=dy;
	transtr+="s";
	transtr+=this.data("sx")?this.data("sx"):1;
	transtr+=",";
	transtr+=this.data("sy")?this.data("sy"):1;
	transtr+="r";
	transtr+=this.data("r");
	this.transform(transtr);
};