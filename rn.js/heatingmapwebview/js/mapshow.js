    $(document).ready(function(){
//  	var authorityManage = top.getUser().company_code.length;
//  	console.info(authorityManage);
//      if(authorityManage < 11){
			$(".changeIndex").empty();
			createElement(0,true);
        	getcompanyMessage(2,0);	
//      }else{
//			$(".changeIndex").empty();
//			createElement(0,true);
//      	getcompanyMessage(2,1);
//      }	
    });	  
	     
		//用来保存地址、令牌、表示权限的字段
		    var globalurl = "http://121.42.253.149:18816" ;
//		    var globalurl = "http://192.168.1.109" ;
		    var accesstoken = "59029d22320e0f107cd99c8d" ;
//       	var accesstoken = getToken(),
		    	switchValue = true ,
		        switchKey   = true ,
		        switchIndex = true ,
		        flagIndex = true,
		        branchIndex = true ,
		        stationIndex =true ,
		        //用来保存地图的级别信息
	    		savemapLevel = [],
	    		rinkMap = [] ,
	    		//用来保存地图位置和名字的数组
	    		res = []; 
	         	latCoord = []; 
	        	branchRes = [];
	         	stationRes = [];
	         	//保存后台返回的各个级别的数据
		        saveCompanyInfo = null,
		        saveChildrencompanyInfo = null ,
		        saveAreaInfo = null ,
		        saveStationInfo = null ;
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
					},
					{
					   "featureType": "highway",
					   "elementType": "all",
					   "stylers": {
								"visibility":"off",
					   }
					},
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
                if (flagX == 0){
				    	if(marker.addEventListener){				   
							marker.addEventListener("click",showcompanyCharts);
						}else if(marker.attachEvent){
						    marker.attachEvent("onclick",showcompanyCharts);
					    }  
		    	}else if(flagX == 1){
				        if(marker.addEventListener){				   
							marker.addEventListener("click",showchildrencompanyCharts);
						}else if(marker.attachEvent){
						    marker.attachEvent("onclick",showchildrencompanyCharts);
					    }  
		    	}else{
		    		if(flagX == 2){
		    		    if(marker.addEventListener){				   
							marker.addEventListener("click",showAreaCharts);
						}else if(marker.attachEvent){
						    marker.attachEvent("onclick",showAreaCharts);
					    }  
		    	    }else if(flagX == 3){	
		    	    	if(marker.addEventListener){				   
							marker.addEventListener("click",showStateCharts);
						}else if(marker.attachEvent){
						    marker.attachEvent("onclick",showStateCharts);
					    }  
		    	    }
		    	} 
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
                if (flagX == 0){
				    	if(label.addEventListener){				   
							label.addEventListener("click",showcompanyCharts);
						}else if(label.attachEvent){
						    label.attachEvent("onclick",showcompanyCharts);
					    }  
		    	}else if(flagX == 1){
				        if(label.addEventListener){				   
							label.addEventListener("click",showchildrencompanyCharts);
						}else if(label.attachEvent){
						    label.attachEvent("onclick",showchildrencompanyCharts);
					    }  
		    	}else{
		    		if(flagX == 2){
		    		    if(label.addEventListener){				   
							label.addEventListener("click",showAreaCharts);
						}else if(label.attachEvent){
						    label.attachEvent("onclick",showAreaCharts);
					    }  
		    	    }else if(flagX == 3){
		    	    	if(label.addEventListener){				   
							label.addEventListener("click",showStateCharts);
						}else if(label.attachEvent){
						    label.attachEvent("onclick",showStateCharts);
					    }  
		    	    }
		    	} 
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
		function createElement(mapLevel,flag){
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
         			    for( var x  = 0; x <data.station_tag.length; x++){
         			    	if(flag == true){
         			    		if(data.station_tag[x].tag_name == "实际能耗"){
         			    			$(".changeIndex").append("<div class='indexShow' style='float:left;'>"+
									                                "<p class='text'>"+
									                                  "<input type='radio'  name='change' onclick=getMessage("+data.station_tag[x]._id+") checked>"+data.station_tag[x].tag_name+""+
									                                "</p>"+
								                                  "</div>"
								                       		);
	         			    	}else{
	         			    		$(".changeIndex").append("<div class='indexShow' style='float:left;'>"+
										                                "<p class='text'>"+
										                                  "<input type='radio'  name='change' onclick=getMessage("+data.station_tag[x]._id+")>"+data.station_tag[x].tag_name+""+
										                                "</p>"+
									                                  "</div>"
									                        );
	         			    	}
         			    	}else if(flag == false){
         			    		if(data.station_tag[x].tag_name == "实际能耗"){
         			    			$(".changeIndex").append("<div class='indexShow' style='float:left;'>"+
									                                "<p class='text'>"+
									                                  "<input type='radio'  name='change' onclick=changeIndex("+data.station_tag[x]._id+") checked>"+data.station_tag[x].tag_name+""+
									                                "</p>"+
								                                  "</div>"
								                      		);
	         			    	}else{
	         			    		$(".changeIndex").append("<div class='indexShow' style='float:left;'>"+
										                                "<p class='text'>"+
										                                  "<input type='radio'  name='change' onclick=changeIndex("+data.station_tag[x]._id+")>"+data.station_tag[x].tag_name+""+
										                                "</p>"+
									                                  "</div>"
									                        );
	         			    	}
         			    	}
         			    	
								
						}   
         			}
	        	
         		});     	
        }
		
		//获取点击marker绑定的Id值
        function  findRes(ev,showRes){
        	var ev = ev || window.event;
			var p = ev.target || ev.srcElement;
			var markerPositionlat = p.getPosition().lat;
			var showresource = [];
			if( markerPositionlat){
                for(var x = 0 ; x < showRes.length ; x++){
                    if( showRes[x].value == markerPositionlat){
                        showId = showRes[x].name;
                        showName = showRes[x].keyValue;
                        showTag  = showRes[x].TagValue;
                        showLevel  = showRes[x].MapLevel;
                    }
                }
               return {showId:showId, showName: showName, showTag: showTag,showLevel:showLevel};
            }
	    }
        
        //2、存储指标的容器 (避免标签累加)
        //getdata from database 从后台数据库中获取所有的数据，通过传递的字段进行数据区别     
	    function  getcompanyMessage(tagValue,levelMap){
	    	//1、先清除地图上的覆盖物
				map.clearOverlays(); 
		    //2.请求数据
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
										latCoord.push( data.data[i].location.split(",")[1]); 
										res.push({
												name  : data.data[i].company_id,
											    value : latCoord.pop(),
											keyValue  : data.data[i].company_name ,
											TagValue  : tagValue,
											MapLevel  : levelMap,
										});
										//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
											if(data.data[i].data_value != 0){
												valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].company_name;
											}else{
												valueShow ="暂无数据     " + data.data[i].company_name;
											}
						                    if(data.data[i].status == 0 ){
						                    	addMarker(0, Point, i, levelMap, valueShow,"#473f3c");
						                    }else if(data.data[i].status == 1 ){
						                    	addMarker(1, Point, i, levelMap, valueShow,"#3c4d48");
						                    }
					                    }
									//3.保存地图的级别信息
									rinkMap.push(levelMap);
                   	   		}else if(data.data[0].branch_name){
                   	   				//1.设置地图的中心及显示级别
				                    	var lat = parseFloat(data.data[0].location.split(",")[0]);
			                            var lng = parseFloat(data.data[0].location.split(",")[1]);
										map.centerAndZoom(new BMap.Point(lat,lng), 9);  
									//2.格式化数据
									for(var i = 0; i < data.data.length; i++ ){
										var Point = new BMap.Point( data.data[i].location.split(",")[0],data.data[i].location.split(",")[1]);
										latCoord.push( data.data[i].location.split(",")[1]);  
										branchRes.push({
										    name  : data.data[i].branch_id,
									        value : latCoord.pop(),
									        keyValue  : data.data[i].branch_name ,
											TagValue  : tagValue,
											MapLevel   : levelMap,
									    }); 
										//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
										if(data.data[i].data_value != 0){
											valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].branch_name;
										}else{
											valueShow ="暂无数据     " + data.data[i].branch_name;
										}
							            if(data.data[i].status == 0){
							            	addMarker(0, Point, i, 2, valueShow,"#473f3c");
							            }else if(data.data[i].status == 1){
							            	addMarker(1,Point, i, 2, valueShow,"#3c4d48");
							            }
						      		}
									//3.保存地图的级别信息
									rinkMap.push(levelMap);
                   	   		}else if(data.data[0].heating_station_name){
                   	   			    //1.设置地图的中心及显示级别
				                    	var lat = parseFloat(data.data[0].location.split(",")[0]);
			                            var lng = parseFloat(data.data[0].location.split(",")[1]);
										map.centerAndZoom(new BMap.Point(lat,lng), 18)
//										if(data.data.length > 1){
//							                var pointsLocation = [];
//										    for(var i = 0; i< data.data.length ; i++){
//										    	if(data.data[i].location){
//											    	pointsLocation.push({
//											    		lat : parseFloat(data.data[i].location.split(",")[1]),
//											    		lng : parseFloat(data.data[i].location.split(",")[0]),
//											    	})
//											    }
//										    }
//					                        setZoom(pointsLocation);
//					                    }else{
//					                    	var lat = parseFloat(data.data[0].location.split(",")[0]);
//				                            var lng = parseFloat(data.data[0].location.split(",")[1]);
//											map.centerAndZoom(new BMap.Point(lat,lng),18);  
//										}
									//2.格式化数据
									    for(var i = 0; i < data.data.length; i++ ){
											var Point = new BMap.Point( data.data[i].location.split(",")[0],data.data[i].location.split(",")[1]);
											latCoord.push( data.data[i].location.split(",")[1]);
											stationRes.push({
													name  : data.data[i].station_id,
											        value : latCoord.pop(),
											        keyValue  : data.data[i].heating_station_name,
													TagValue  :  tagValue,
													MapLevel   : levelMap,
											}); 
											//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
											if(data.data[i].data_value != 0){
												valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].heating_station_name;
											}else{
												valueShow ="暂无数据     " + data.data[i].heating_station_name;
											}
						                    if(data.data[i].status == 0){
						                    	addMarker(0, Point, i, 3, valueShow,"#473f3c");
						                    }else if(data.data[i].status == 1){
						                    	addMarker(1,Point, i, 3, valueShow,"#3c4d48");
						                    }
						                    
								      	}
									//3.保存地图的级别信息
									rinkMap.push(levelMap);
                   	   		}else{
                   	   			layer.msg("网络原因，请刷新！");
                   	   		}
                   	   }
		    	});
	    }
		
		// 切换指标时执行的函数
		function  getMessage(value){
			if(switchKey == true){
			}else if(switchKey == false){
				if(value){
					var mapRink = rinkMap.pop();
					getcompanyMessage(value,mapRink);
				}
			}
		}
	    //点击搜索按钮实现搜索功能
        $("#searchPicture").click(function(){
        	judgeMaplevel();
        });
        
       
		//回车实现搜索功能
		function search(ev,tagValue,levelMap){
			var e=ev||window.event;
			if(e.keyCode == 13){
				judgeMaplevel();
			}
		}
		

        //根据地图级别进行搜索功能的实现
		function judgeMaplevel(){
			var iptValue = $("#searchFunction").val();
        	if(iptValue == ''){
        		layer.msg("搜索内容不能为空！");
        	}else{
        		var mapRink = rinkMap.pop();
        		if( mapRink == 0){
        		    searchFunction(2,0);
        		}else if(mapRink == 1){
        			searchFunction(2,1);
        		}else if(mapRink == 2){
        			searchFunction(2,2);
        		}else if(mapRink == 3){
        			searchFunction(2,3);
        		}
        	}
		}
		
		//针对搜索内容切换指标
	    function changeIndex(data){
	    	if(switchIndex == true){	
	    	}else if(switchIndex ==false){
	    		if(data){
					var mapRink = rinkMap.pop();
					searchFunction(data,mapRink);
				}
	    	}
	    	
	    }
		
		//搜索功能的实现
	    function searchFunction(tagValue,levelMap){
	    	//匹配汉字和空格的正则表达式
	    	var regTest =  /^[\u4e00-\u9fa5_0-9]+$/;  
	    	var iptValue = $("#searchFunction").val();
	    	//用户输入验证，通过验证进行查询结果的返回
	    	if(iptValue){
			    	if(regTest.test(iptValue)){
				    	    $.ajax({
				    	        url:globalurl+'/v1_0_0/mapShow',
			                    dataType:"JSON",
			                    type:"get",
			                    async:false,
			                    data:{
			                    	access_token:accesstoken,
			                    	tag:tagValue,
			                    	level:levelMap,
			                        name:iptValue,
			                    },
			                    success:function(data){
			                    	console.info(data);
			                    	//设置全局变量的值
                   	   				switchIndex  = false ;
						    		if(data.data[0].company_name){
						    					//1、清空地图上的覆盖物
							    		    	map.clearOverlays(); 
						    					
						    					//2、格式化地图的显示
						    					if( flagIndex == true){
							    					$(".changeIndex").empty();
							    					createElement(0,false);
							    		   			for(var i= 0;i< data.data.length ;i++){
								    		    		//将查询符合的数据放入容器中
								    		    			$("#messageTable").append("<li style='cursor:pointer;color:white;font-size:12px;' onclick=centerShow("+i+")>"+data.data[i].company_name+"</li>");
								    		    		}
								    		    	}
						    					flagIndex = false;
							    		    	if(data.data.length > 1){
					                                var lat = parseFloat(data.data[0].location.split(",")[0]);
						                            var lng = parseFloat(data.data[0].location.split(",")[1]);
													map.centerAndZoom(new BMap.Point(lat,lng),8);  
							                    }else{
							                    	var lat = parseFloat(data.data[0].location.split(",")[0]);
						                            var lng = parseFloat(data.data[0].location.split(",")[1]);
													map.centerAndZoom(new BMap.Point(lat,lng),7);  
												}
							    		    	for(var i = 0; i < data.data.length; i++ ){
										            var Point = new BMap.Point( data.data[i].location.split(",")[0],data.data[i].location.split(",")[1]);
													latCoord.push( data.data[i].location.split(",")[1]); 
													res.push({
															name  : data.data[i].company_id,
														    value : latCoord.pop(),
													});
													//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
													if(data.data[i].data_value != 0){
														valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].company_name;
													}else{
														valueShow ="暂无数据     " + data.data[i].company_name;
													}
								                    if(data.data[i].status == 0){
								                        	addMarker(0, Point, i, levelMap, valueShow,"#473f3c");
								                    }else if(data.data[i].status == 1 ){
								                        	addMarker(1, Point, i, levelMap, valueShow,"#3c4d48");
								                    }
								                }
							    		    	//3.保存地图的级别信息
												rinkMap.push(levelMap);
						    		}else if(data.data[0].branch_name){
						    						//清除地图上所有的覆盖物
							    		    		map.clearOverlays(); 
							    		    		//将查询符合的数据放入容器
							    		    		if( branchIndex  == true ){
							    		    			$(".changeIndex").empty();
						    							createElement(1,false);
								    		    		for(var i= 0;i< data.data.length ;i++){
								    		    			 $("#messageTable").append("<li style='cursor:pointer;color:white;font-size:12px;' onclick=centerShow("+i+")>"+data.data[i].branch_name+"</li>");
								    		    		}
							    		    			
							    		    		}
							    		    		branchIndex = false;
							    		    		//1.设置地图的中心及显示级别
					                              		var lat = parseFloat(data.data[0].location.split(",")[0]);
			                           					var lng = parseFloat(data.data[0].location.split(",")[1]);
														map.centerAndZoom(new BMap.Point(lat,lng), 9);
													//2.格式化数据
													for(var i = 0; i < data.data.length; i++ ){
														var Point = new BMap.Point( data.data[i].location.split(",")[0],data.data[i].location.split(",")[1]);
														latCoord.push( data.data[i].location.split(",")[1]);  
														branchRes.push({
														    name  : data.data[i].branch_id,
													        value : latCoord.pop(),
													    }); 
														//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
														if(data.data[i].data_value != 0){
															valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].branch_name;
														}else{
															valueShow ="暂无数据     " + data.data[i].branch_name;
														}
											            if(data.data[i].status == 0){
											            	addMarker(0, Point, i, 2, valueShow,"#473f3c");
											            }else if(data.data[i].status == 1){
											            	addMarker(1,Point, i, 2, valueShow,"#3c4d48");
											            }
										      		}
													//3.保存地图的级别信息
													rinkMap.push(levelMap);
							        }else if(data.data[0].heating_station_name){
							        				//清空地图上的覆盖物
							        				 map.clearOverlays(); 
							        	            if(stationIndex == true){
							        	          	  $(".changeIndex").empty();
							        	             createElement(2,false);	
							        				for(var i= 0;i< data.data.length ;i++){
											    		//将查询符合的数据放入容器中
											    			$("#messageTable").append("<li style='cursor:pointer;color:white;font-size:12px;' onclick=centerShow("+i+")>"+data.data[i].heating_station_name+"</li>")
											    		}
										    	    }
							        	            stationIndex =false ;
							        				//1.设置地图的中心及显示级别
					                            	 	var lat = parseFloat(data.data[0].location.split(",")[0]);
						                           		var lng = parseFloat(data.data[0].location.split(",")[1]);
														map.centerAndZoom(new BMap.Point(lat,lng), 18);
													//2.格式化数据
													for(var i = 0; i < data.data.length; i++ ){
														var Point = new BMap.Point( data.data[i].location.split(",")[0],data.data[i].location.split(",")[1]);
														latCoord.push( data.data[i].location.split(",")[1]);
														stationRes.push({
																name  : data.data[i].station_id,
														        value : latCoord.pop(),
														}); 
														//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
														if(data.data[i].data_value != 0){
															valueShow =data.data[i].data_value + data.data[i].data_unit+""+ data.data[i].heating_station_name;
														}else{
															valueShow ="暂无数据     " + data.data[i].heating_station_name;
														}
									                    if(data.data[i].status == 0){
									                    	addMarker(0, Point, i, 3, valueShow,"#473f3c");
									                    }else if(data.data[i].status == 1){
									                    	addMarker(1,Point, i, 3, valueShow,"#3c4d48");
									                    }
									                    
											      	}
													//3.保存地图的级别信息
													rinkMap.push(levelMap);
										   }
							    }
							});
				    }else{
				        layer.msg("请输入符合的关键字进行查询！");
				    } 
	    	}
	    }
	    
//		//针对返回的搜索信息进行处理
//		function centerShow(data){
//			alert(data);
//		}
//      
//      //设置地图的中心坐标
//      function  setMapLocation(value){
//      	
//      }
//      
//		var str=window.navigator.userAgent.toLowerCase();
//		// 获取浏览器的识别码
//		if (str.indexOf('firefox')!=-1) {
//			//是火狐
//			window.addEventListener('DOMMouseScroll',function (e){
//				if (e.detail<0) {
//					//前滚，box加大
//					map.addEventListener("zoomend", function(){ 
//						var mapLevel = map.getZoom();
//						console.info(mapLevel);
//						if(mapLevel > 3 &&  mapLevel < 8 ){
//							//1、先清除地图上的覆盖物
//						    map.clearOverlays(); 
//						    //2.加载标签列表
//						    $(".changeIndex").empty();
//							createElement(0,true);
//							//3.加载数据
//						    getcompanyMessage(2,0);
//						}else if( mapLevel == 8){
//							//1、先清除地图
//							clearMapthing();
//						    //2.加载标签列表
//						    $(".changeIndex").empty();
//							createElement(0,true);
//							//3.加载数据
//							getcompanyMessage(2,1);
//						}else if( mapLevel > 8 && mapLevel < 10){
//							//1、先清除地图
//							clearMapthing();
//						    //2.加载标签列表
//						    $(".changeIndex").empty();
//							createElement(1,true);
//							//3.加载数据
//			   				getcompanyMessage(2,2);
//						}else if( mapLevel > 10 && mapLevel < 14){
//							//1、先清除地图
//							clearMapthing();
//						    //2.加载标签列表
//						     $(".changeIndex").empty();
//							createElement(2,true);
//							//3.加载数据
//			   				getcompanyMessage(2,3);
//			   			}
//					});
//				} else{
//					//后滚，
//					map.addEventListener("zoomend", function(){ 
//							var mapLevel = map.getZoom();
//							console.info(mapLevel);
//							if(mapLevel > 13  ){
//								//1、先清除地图
//								clearMapthing();
//							    //2.加载标签列表
//							    $(".changeIndex").empty();
//								createElement(1,true);
//								//3.加载数据
//				   				getcompanyMessage(2,2);
//							}
//						});
//			
//				}
//			},false);
//		} else{
//			//其他浏览器
//			window.onmousewheel=function (ev){
//				var e=ev||window.event;
//				if (e.wheelDelta>0) {
//					//前滚，box加大
//					map.addEventListener("zoomend", function(){ 
//						var mapLevel = map.getZoom();
//						console.info(mapLevel);
//						if(mapLevel > 3 &&  mapLevel < 8 ){
//							//1、先清除地图上的覆盖物
//						    map.clearOverlays(); 
//						    //2.加载标签列表
//						    $(".changeIndex").empty();
//							createElement(0,true);
//							//3.加载数据
//						    getcompanyMessage(2,0);
//						}else if( mapLevel == 8){
//							//1、先清除地图
//							clearMapthing();
//						    //2.加载标签列表
//						    $(".changeIndex").empty();
//							createElement(0,true);
//							//3.加载数据
//							getcompanyMessage(2,1);
//						}else if( mapLevel > 8 && mapLevel < 10){
//							//1、先清除地图
//							clearMapthing();
//						    //2.加载标签列表
//						    $(".changeIndex").empty();
//							createElement(1,true);
//							//3.加载数据
//			   				getcompanyMessage(2,2);
//						}else if( mapLevel > 9 && mapLevel < 14){
//							//1、先清除地图
//							clearMapthing();
//						    //2.加载标签列表
//						     $(".changeIndex").empty();
//							createElement(2,true);
//							//3.加载数据
//			   				getcompanyMessage(2,3);
//			   			}
//					});
//				}else{
//					//后滚，box减小
//						map.addEventListener("zoomend", function(){ 
//							var mapLevel = map.getZoom();
//							console.info(mapLevel);
//							if(mapLevel > 13  ){
//								//1、先清除地图
//								clearMapthing();
//							    //2.加载标签列表
//							    $(".changeIndex").empty();
//								createElement(1,true);
//								//3.加载数据
//				   				getcompanyMessage(2,2);
//							}
//						});
//			
//				}
//			}
//		}
//		
         //鼠标滚轮事件进行地图类别的切换
		map.addEventListener("zoomend", function(){ 
			var mapLevel = map.getZoom();
			console.info(mapLevel);
			if(mapLevel > 3 &&  mapLevel < 8 ){
				//1、先清除地图上的覆盖物
			    map.clearOverlays(); 
			    //2.加载标签列表
			    $(".changeIndex").empty();
				createElement(0,true);
				//3.加载数据
			    getcompanyMessage(2,0);
			}else if( mapLevel == 8){
				//1、先清除地图
				clearMapthing();
			    //2.加载标签列表
			    $(".changeIndex").empty();
				createElement(0,true);
				//3.加载数据
				getcompanyMessage(2,1);
			}else if( mapLevel > 8 && mapLevel < 10){
				//1、先清除地图
				clearMapthing();
			    //2.加载标签列表
			    $(".changeIndex").empty();
				createElement(1,true);
				//3.加载数据
   				getcompanyMessage(2,2);
			}else if( mapLevel > 9 && mapLevel < 14){
				//1、先清除地图
				clearMapthing();
			    //2.加载标签列表
			     $(".changeIndex").empty();
				createElement(2,true);
				//3.加载数据
   				getcompanyMessage(2,3);
   			}else if( mapLevel < 15 ){
   						//1、先清除地图

						clearMapthing();
					    //2.加载标签列表

					    $(".changeIndex").empty();
						createElement(1,true);
						//3.加载数据

		   				getcompanyMessage(2,2);
   				    }
			}); 
			
		//清空地图的覆盖物、搜索内容 、文本信息
	    function clearMapthing(){
	    	//切换层级时，清除地图上的覆盖物和容器，并且让搜索的文本框内容为空
			    map.clearOverlays(); 
        		$("#messageTable").empty();
        		$("#searchFunction").val("");
	    }
		 
		//地图点击进入数据图标的函数入口
		function showcompanyCharts(ev){
		    //通过marker坐标来获得相应的数值信息
 				showCharts(ev,res);
		}
		
		function showchildrencompanyCharts(ev){
			//通过marker坐标来获得相应的数值信息
			   showCharts(ev,res);
		}
		
		function showAreaCharts(ev){
			//通过marker坐标来获得相应的数值信息
				 showCharts(ev,branchRes);
		}
		
		function showStateCharts(ev){
			//通过marker坐标来获得相应的数值信息
			    showCharts(ev,stationRes);   
		}

     
 		//获取点击覆盖物的Id值、名字、地图级别、标签的ID值，并调用弹窗函数
 		function showCharts(ev,resName){
 				var  resource  = findRes(ev,resName);	 
                var   showId = resource.showId;
                var   showName = resource.showName;
                var   showTag  = resource.showTag;
                var   showLevel  = resource.showLevel ;
				layerOpen(showId)
 		}
       

        //点击覆盖物出弹窗
        function layerOpen(showName,showId,showTag,showLevel){
        	layer.open({
				type: 2,
				title:"数据图表",
				closeBtn: 1,
				shadeClose: true,
				skin: 'layui-layer-lan',
				shade: 0.8,
				area: ['90%', '90%'],
				content: "/list/chart?station_name="+showName+"&station_id="+showId+"&num="+showTag +"&tagLevel="+showLevel  //iframe的url
			});
        }
