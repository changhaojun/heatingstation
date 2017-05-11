    $(document).ready(function(){
//  	var authorityManage = top.getUser().company_code.length;
//  	console.info(authorityManage);
//      if(authorityManage < 11){
			if( defaultValue == true){
        		getcompanyMessage(0,2,0);
        		 defaultValue= false;
			}
//      }else{
//      	getcompanyMessage(1,2,0);
//      }	
    });	  
	     
		//用来保存地址、令牌、表示权限的字段
		    var globalurl = "http://121.42.253.149:18816" ,
		    	accesstoken = "5913dd8df77ace0005286c03" ,
//		    	accesstoken = getToken();
		    	switchValue = true ,
		        switchKey   = true ,
		        defaultValue = true ,
		        //用来保存地图的级别信息
	    		savemapLevel = [],
	    		rinkMap = [] ,
	    		//保存后台返回的各个级别的数据
		        saveCompanyInfo = [],
		        saveChildrencompanyInfo = [],
		        saveAreaInfo = [],
		        saveStationInfo = [];
		        
	    //初始化地图   
			var map = new BMap.Map("map", {enableMapClick:false}); 
		    map.disableDoubleClickZoom(true);
		    map.enableScrollWheelZoom();
		    map.enableAutoResize(); 
			var styleJson = [
					{
					   "featureType": "building",
					   "elementType": "all",
					   "stylers": {
								 "hue": "#f3f3f3",
					   }
					},
					{
					   "featureType": "road",
					   "elementType": "all",
					   "stylers": {
								 "color": "#f3f3f3",
					   }
					}
				 ]
		    map.setMapStyle({styleJson:styleJson});

		//set marker type 初始化marker类型
        function addMarker(state,point,index,flagX,text,showColor){ 
        	    if(state == 0 ){
        	      	var myIcon = new BMap.Icon("img/mark_wr.png", new BMap.Size(220,76));    	
        	    }else if(state == 1){
        	        var myIcon = new BMap.Icon("img/mark_ri.png", new BMap.Size(220,76));    	
        	    }		
		    	var marker = new BMap.Marker(point, {icon: myIcon}); 
		    	//数据图标的入口(点击地图上的marker显示相应的数据图表)
//              if (flagX == 0){
//				    	if(marker.addEventListener){				   
//							marker.addEventListener("click",showcompanyCharts);
//						}else if(marker.attachEvent){
//						    marker.attachEvent("onclick",showcompanyCharts);
//					    }  
//		    	}else if(flagX == 1){
//				        if(marker.addEventListener){				   
//							marker.addEventListener("click",showchildrencompanyCharts);
//						}else if(marker.attachEvent){
//						    marker.attachEvent("onclick",showchildrencompanyCharts);
//					    }  
//		    	}else{
//		    		if(flagX == 2){
//		    		    if(marker.addEventListener){				   
//							marker.addEventListener("click",showAreaCharts);
//						}else if(marker.attachEvent){
//						    marker.attachEvent("onclick",showAreaCharts);
//					    }  
//		    	    }else if(flagX == 3){	
//		    	    	if(marker.addEventListener){				   
//							marker.addEventListener("click",showStateCharts);
//						}else if(marker.attachEvent){
//						    marker.attachEvent("onclick",showStateCharts);
//					    }  
//		    	    }
//		    	} 
		    	var label = new BMap.Label(text,{offset:new BMap.Size(80,14)});
			    	label.setStyle({
			    	 	color           :  showColor,
			    	 	border          :  "none",
			    	 	backgroundColor :  "none",
			    	 	lineHeight      :  "12px",
						textAlign       :  "center",
						height          :  "20px",
						textIndent      :  "1px" ,
			    	})
			    //数据图标的入口(点击地图上的文字信息也显示相应数据图表)
//              if (flagX == 0){
//				    	if(label.addEventListener){				   
//							label.addEventListener("click",showcompanyCharts);
//						}else if(label.attachEvent){
//						    label.attachEvent("onclick",showcompanyCharts);
//					    }  
//		    	}else if(flagX == 1){
//				        if(label.addEventListener){				   
//							label.addEventListener("click",showchildrencompanyCharts);
//						}else if(label.attachEvent){
//						    label.attachEvent("onclick",showchildrencompanyCharts);
//					    }  
//		    	}else{
//		    		if(flagX == 2){
//		    		    if(label.addEventListener){				   
//							label.addEventListener("click",showAreaCharts);
//						}else if(label.attachEvent){
//						    label.attachEvent("onclick",showAreaCharts);
//					    }  
//		    	    }else if(flagX == 3){
//		    	    	if(label.addEventListener){				   
//							label.addEventListener("click",showStateCharts);
//						}else if(label.attachEvent){
//						    label.attachEvent("onclick",showStateCharts);
//					    }  
//		    	    }
//		    	} 
		        marker.setLabel(label);
				map.addOverlay(marker); 
				marker.enableMassClear();
				label.enableMassClear();
	    } 
	     
	     
		//获取地图的中心坐标及显示级别
			//1.根据后台返回数据计算两点之间的中心点
	        function setZoom(points){  
				    if(points.length>0){  
						    var maxLng = points[0].lng;  
						    var minLng = points[0].lng;  
						    var maxLat = points[0].lat;  
						    var minLat = points[0].lat;  
						    var res;  
						        for (var i = points.length - 1; i >= 0; i--) {  
						            res = points[i];  
						            if(res.lng > maxLng) maxLng =res.lng;  
						            if(res.lng < minLng) minLng =res.lng;  
						            if(res.lat > maxLat) maxLat =res.lat;  
						            if(res.lat < minLat) minLat =res.lat;  
						        };  
						        var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;  
						        var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;  
						        var zoom = getZoom(maxLng, minLng, maxLat, minLat);  
						        map.centerAndZoom(new BMap.Point(cenLng,cenLat), zoom);    
				    }else{  
						    //没有坐标，显示西安
						    map.centerAndZoom(new BMap.Point(108.948024,34.263161), 12);    
				    }   
			} 
		
		    //2.根据经纬极值计算地图显示级别 
		    function getZoom (maxLng, minLng, maxLat, minLat) {  
				    var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。  
					var pointA = new BMap.Point(maxLng,maxLat);  
				    var pointB = new BMap.Point(minLng,minLat);  
				    var distance = map.getDistance(pointA,pointB).toFixed(1);   
				    for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {  
						if(zoom[i] - distance > 0){  
						    return 18-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
						}  
				    };  
		    }  
		
		
		//动态加载指标列表
		function createElement(mapLevel){
         		$.ajax({
         			url:globalurl+"/v1_0_0/tags",
         			type:"get",
         			dataType:"JSON",
         			async: false,
         			data:{
         			   access_token:accesstoken,
         			   level:mapLevel,
         			},
         			success:function(data){
         			    console.info(data);
         			    for( var x= 0; x <data.station_tag.length; x++){
										$(".changeIndex").append("<div class='indexShow' style='margin-left:16%;'>"+
									                                "<p class='text'>"+
									                                  "<input type='radio' id='consumeData' name='change'  onclick=getMessage(\'"+data.station_tag[x]._id+"\')  class='radio' style='cursor:pointer;'>"+data.station_tag[x].tag_name+""+
									                                "</p>"+
								                                  "</div>"
								                            	);
						}
         			}
	        	
         		});     	
        }
        
        //getdata from database 从后台数据库中获取所有的数据，通过传递的字段进行数据区别     
	    function  getcompanyMessage(mapLevel,tagValue,levelMap){
	    	//1、先清除地图上的覆盖物
				map.clearOverlays(); 
	    	//2、存储指标的容器 (避免标签累加)
				$(".changeIndex").empty();
				createElement(mapLevel);
		    //3.请求数据
		    	$.ajax({
                    url:globalurl+'/v1_0_0/mapShow',
                    dataType:"JSON",
                    type:"get",
                    async:false,
                    data:{
                    	access_token:accesstoken,
                    	tag:tagValue,
                    	level:levelMap,
                    },
                    success:function(data){
                   	   		console.info(data);
                   	   		//设置全局变量的值
                   	   		switchKey = false ;
                   	   		if(data.data[0].company_name){                 	   	        	
	                   	   			//1.设置地图的中心及显示级别
	                   	   			if(data.data.length > 1){
		                                var pointsLocation = [];
									    for(var i = 0; i< data.data.length ; i++){
									    	if(data.data[i].location){
										    	pointsLocation.push({
										    		lat : parseFloat(data.data[i].location.split(",")[1]),
										    		lng : parseFloat(data.data[i].location.split(",")[0]),
										    	})
										    }
									    }
				                        setZoom(pointsLocation);
				                    }else{
				                    	var lat = parseFloat(data.data[0].location.split(",")[0]);
			                            var lng = parseFloat(data.data[0].location.split(",")[1]);
										map.centerAndZoom(new BMap.Point(lat,lng),7);  
									}
									//2.格式化数据
									for(var i = 0; i < data.data.length; i++ ){
										var Point = new BMap.Point( data.data[i].location.split(",")[0],data.data[i].location.split(",")[1]);
										//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
										if(data.data[i].data_value != 0){
											valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].company_name;
										}else{
											valueShow ="暂无数据     " + data.data[i].company_name;
										}
	                                    if(data.data[i].status == 0){
	                                    	addMarker(0, Point, i, 0, valueShow,"#473f3c");
	                                    }else if(data.data[i].status == 1){
	                                    	addMarker(1,Point, i, 0, valueShow,"#3c4d48");
	                                    }
							      	}
									//3.保存地图的级别信息
									savemapLevel.push(mapLevel);
									rinkMap.push(levelMap);
									//4.保存数据实现搜索功能
									if(mapLevel == 0){
										saveCompanyInfo.push(data.data);
									}else if(mapLevel == 1){
										saveChildrencompanyInfo.push(data.data);
									}
                   	   		}else if(data.data[0].branch_name){
                   	   				//1.设置地图的中心及显示级别
				                    	var lat = parseFloat(data.data[0].location.split(",")[0]);
			                            var lng = parseFloat(data.data[0].location.split(",")[1]);
										map.centerAndZoom(new BMap.Point(lat,lng), 9);  
									//2.格式化数据
									for(var i = 0; i < data.data.length; i++ ){
										var Point = new BMap.Point( data.data[i].location.split(",")[0],data.data[i].location.split(",")[1]);
										//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
										if(data.data[i].data_value != 0){
											valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].branch_name;
										}else{
											valueShow ="暂无数据     " + data.data[i].branch_name;
										}
	                                    if(data.data[i].status == 0){
	                                    	addMarker(0, Point, i, 0, valueShow,"#473f3c");
	                                    }else if(data.data[i].status == 1){
	                                    	addMarker(1,Point, i, 0, valueShow,"#3c4d48");
	                                    }
							      	}
									//3.保存地图的级别信息
									savemapLevel.push(mapLevel);
									rinkMap.push(levelMap);
									//4.保存数据实现搜索功能
									saveAreaInfo.push(data.data);	
                   	   		}else if(data.data[0].heating_station_name){
                   	   			    //1.设置地图的中心及显示级别
				                    	var lat = parseFloat(data.data[0].location.split(",")[0]);
			                            var lng = parseFloat(data.data[0].location.split(",")[1]);
										map.centerAndZoom(new BMap.Point(lat,lng), 18);
									//2.格式化数据
									for(var i = 0; i < data.data.length; i++ ){
										var Point = new BMap.Point( data.data[i].location.split(",")[0],data.data[i].location.split(",")[1]);
										//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
										if(data.data[i].data_value != 0){
											valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].heating_station_name;
										}else{
											valueShow ="暂无数据     " + data.data[i].heating_station_name;
										}
	                                    if(data.data[i].status == 0){
	                                    	addMarker(0, Point, i, 0, valueShow,"#473f3c");
	                                    }else if(data.data[i].status == 1){
	                                    	addMarker(1,Point, i, 0, valueShow,"#3c4d48");
	                                    }
							      	}
									//3.保存地图的级别信息
									savemapLevel.push(mapLevel);
									rinkMap.push(levelMap);
									//4.保存数据实现搜索功能
									saveStationInfo.push(data.data);	
                   	   		}else{
                   	   			layer.msg("网络原因，请稍后！");
                   	   		}
                   	   }
		    	});
	    }
		
		
		// 切换指标时执行的函数
		function  getMessage(value){
			if(switchKey == true){
			}else if(switchKey == false){
				if(value){
					var levelMap = savemapLevel.pop();
					var mapRink = rinkMap.pop();
					getcompanyMessage(levelMap,value,mapRink);
				}
			}
		}
	
		//搜索功能的实现
//	    function searchFunction(data){
//	    	var regTest = /^[\u2E80-\u9FFF]+$/i;
//	    	var iptValue = $("#searchFunction").val();
//	    	//用户输入验证，通过验证进行查询结果的返回
//	    	if(regTest.test(iptValue)){
//	    		    for(var x = 0;x < data.length ; x++){
//	    		    	if(data.company_name.indexOf(iptValue) > -1){
//	    		    		//将查询符合的数据放入容器中
//	    		    		$("#messageTable").empty();
//	    		    		$("#messageTable").append("<li style='cursor:pointer;' onclick=searchShow(\'"+data+"\',\'"+x+"\');>'"+data[x].company_name+"'</li>");
//	    		    	}
//	    		    }
//	    		    console.info(locationSave);
//	    	}else{
//	    		layer.msg("请输入汉字进行查询");
//	    	}
//	    
//		}
//				
//		//针对返回的搜索信息进行处理
//		function searchShow(data,value){
//			alert(value);
//			if(value){
//				var Point = new BMap.Point( data[value].location.split(",")[0],data[value].location.split(",")[1]);
//	    		map.centerAndZoom(Point,8);
//	    		if(data[value].data_value != 0){
//						valueShow =data[value].data_value + data[value].data_unit+""+ data[value].company_name;
//				}else{
//						valueShow ="暂无数据     " + data[value].company_name;
//				}
//	    		if(data[value].status == 0){
//	                    addMarker(0, Point, i, 0, valueShow,"#473f3c");
//	            }else if(data[value].status == 1){
//	                    addMarker(1,Point, i, 0, valueShow,"#3c4d48");
//	            }
//			}
//		}
//			
//		
//		//点击搜索图标实现搜索
//		$("#search").click(function(){
//			searchFunction(data);
//		})
//		
//		//回车实现搜索功能
//		function search(ev){
//			var e=ev||window.event;
//			if(e.keyCode==13){
//				searchFunction(data);
//			}
//		}

    //鼠标滚轮事件进行地图类别的切换
		map.addEventListener("zoomend", function(){ 
			var mapLevel = map.getZoom();
			console.info(mapLevel );
			if(mapLevel > 3 &&  mapLevel < 8 ){
				//1、先清除地图上的覆盖物
			    map.clearOverlays(); 
			     //2.显示相应数
			     	getcompanyMessage(0,2,0);
			}else if( mapLevel == 8){
				//1、先清除地图上的覆盖物
			    map.clearOverlays(); 
			    //2.显示相应数据
				getcompanyMessage(0,2,1);
			}else if( mapLevel > 11 && mapLevel < 14){
				//1、先清除地图上的覆盖物
			    map.clearOverlays(); 
			    //2.显示相应数据
   				getcompanyMessage(1,2,2);
			}else if( mapLevel > 15 && mapLevel < 20){
				//1、先清除地图上的覆盖物
			    map.clearOverlays(); 
			    //2.显示相应数据
   				getcompanyMessage(2,2,3);
   			}
		});  