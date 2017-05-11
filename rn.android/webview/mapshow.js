    $(document).ready(function(){
    	getzreaMessage();	
    });	
    	//globe instance
	        var location;
	    //保存文本框的内容
	        var iptValue;
		//用来保存区域的名字
		    var zreaName = [];
		//use for restore data 保存信息
				//保存分分公司的数据
				var res = []; 
				var geoCoord = [];
				
				//保存支线的数据
	            var newRes = [];
	            var latCoord = []; 
	                  
	    //初始化地图   
			var map = new BMap.Map("map", {}); 
		    var centerPoint = new BMap.Point(108.948024,34.263161);
		    map.centerAndZoom(centerPoint,9);
		    map.disableDoubleClickZoom(true);
		    map.enableScrollWheelZoom();
			var styleJson = [
					{
					   "featureType": "building",
					   "elementType": "all",
					   "stylers": {
								 "hue": "#007fff",
					   }
					},
					{
					   "featureType": "road",
					   "elementType": "all",
					   "stylers": {
								 "color": "#ffffff",
					   }
					}
				 ]
		    map.setMapStyle({styleJson:styleJson});
		
		//set marker type 初始化marker类型
        function addMarker(i,point,index,flagX,text){   
			    var myIcon = new BMap.Icon("img/marker"+i+".png", new BMap.Size(47, 47));
		    	var marker = new BMap.Marker(point, {icon: myIcon}); 
		    	if  (flagX== 0){
				    	if(marker.addEventListener){				   
							marker.addEventListener("click",showArea);
						}else if(marker.attachEvent){
						    marker.attachEvent("onclick",showArea);
					    }  
		    	}else if(flagX== 1){
				        if(marker.addEventListener){				   
							marker.addEventListener("click",showState);
						}else if(marker.attachEvent){
						    marker.attachEvent("onclick",showState);
					   }  
		    	}else{
		    		if(marker.addEventListener){				   
							marker.addEventListener("click",showMessage);
						}else if(marker.attachEvent){
						    marker.attachEvent("onclick",showMessage);
					   }  
		    	}
		    	var label = new BMap.Label(text,{offset:new BMap.Size(12,16)});
			    	label.setStyle({
			    	 	color           :  "white",
			    	 	border          :  "none",
			    	 	backgroundColor :  "none",
			    	 	fontSize        :  "16px",
			    	 	lineHeight      :  "12px",
						textAlign       :  "center",
						width           :  "20px",
						height          :  "40px",
			    	})
		        marker.setLabel(label);
				map.addOverlay(marker); 
				marker.enableMassClear();
	    }   
	    
        //显示分公司名字的marker
        function showNamemarker(point,index,text,i){  
	            var opts = {
				    position : point,    
				    offset   : new BMap.Size(-40, 30),  
				}
				var label = new BMap.Label(text, opts);  
					label.setStyle({
						color          :  "white",
						backgroundImage:  "url('img/squre"+i+".png')",
						fontSize       :  "13px",
						backgroundColor:  "none",
						width          :  "76px",
						border         :  "none",
						height         :  "26px",
						lineHeight     :  "20px",
						fontFamily     :  "微软雅黑",
						lineHeight     :  "26px",
						textAlign      :  "center",
					});
	            map.addOverlay(label); 
	            label.enableMassClear();
	    }
        
        //删除上一级别的maker
//		function deleteMaker(){
//		       //getMapLabel();
//		        var allOverlay = map.getOverlays();
//		        console.info(allOverlay );
//		        for (var i = 0; i < allOverlay.length - 1; i++) {
//		        console.log(allOverlay[i].toString() )
//		            if (allOverlay[i].toString() == "[object Marker]") {
//		                if (allOverlay[i].getLabel().content == "城南分公司") {
//		                    map.removeOverlay(allOverlay[i]);
//		                    console.log(allOverlay[i])
//		                    return false;
//		                }
//		            }
//		        }
//		}
		   
        //getdata from database 从后台数据库中获取区域数据      
		function  getzreaMessage(){
		    	$.ajax({
                    url:"/v1_0_0/company",
                    dataType:"JSON",
                    type:"get",
                    success:function(data){
                   	    console.info(data);
                        for(var x = 0;x < data.company_data.length; x++){
                        	    var maxLocation =  data.company_data[0].location;
                        	    var minLocation =  data.company_data[1].location;
                        	    if(maxLocation < data.company_data[x].location){
                        	    	maxLocation = data.company_data[x].location;
                        	    }
                        	    if(minLocation > data.company_data[x].location){
                        	    	minLocation = data.company_data[x].location;
                        	    }
			                    geoCoord.push( data.company_data[x].location.split(",")[0]);
								var point = new BMap.Point( data.company_data[x].location.split(",")[0],data.company_data[x].location.split(",")[1]);
							    var numberShow = data.company_data[x].data_value;
							    var companyName = data.company_data[x].company_name;
							    addMarker(0,point, x, 0,numberShow);
							    showNamemarker(point,x,companyName,1);	    
							res.push({
							        name  : data.company_data[x].company_id,
							        value : geoCoord.pop(),
							});
                        }
                        console.info(res);
				        //允许鼠标拖动，但是地图中心不改变
						var b = new BMap.Bounds(new BMap.Point(minLocation.split(",")[0], minLocation.split(",")[1]),new BMap.Point(maxLocation.split(",")[0], maxLocation.split(",")[1]));
						console.info(b);
						try {
							BMapLib.AreaRestriction.setBounds(map, b);
						} catch (e) {
							alert(e);
						}

                    }
		    	});
	    }
		    
	    //get into lineZone (进入支线区域)
		function  showArea(ev){
		    	//1.清除上一个级别的覆盖物并设置新的地图的尺寸，允许通过鼠标滚轮来进行地图的缩放
		    	map.clearOverlays();  
		    	map.setZoom(11);
		    	map.enableScrollWheelZoom();
		    	//2.获取当前点击公司的ID值获取新支线地理坐标信息
	        	var ev = ev || window.event;
				var p = ev.target || ev.srcElement;
				var markerPositionlng = p.getPosition().lng;
				var companyId;
			    //3.find companyId (通过marker坐标来获得相应的id值)
//			    if( markerPositionlng){
//                      for(var x = 0 ; x < res.length ; x++){
//                          if( res[x].value == markerPositionlng){
//                              companyId=res[x].name;
//                              alert(companyId);
//                          }
//                      }
//                      //use Id to receive lineInfo data
////                      if(companyId){
//	                        //用来检测是否获得到了公司的ID值
////	                        console.info(111);
                            //4.获取具体支线数据
		                        $.ajax({
////								url:"/v1_0_0/company/"+companyId+"/branch",
                                    url:"/v1_0_0/company/58c5080b83023e0c8848e6dc/branch",
								    dataType:"JSON",
                  					type:"get",
								    success:function(data){
								        console.info(data);
										//5.开始填充数据
										for(var i = 0; i < data.branch_data.length; i++ ){
										  	var linePoint = new BMap.Point( data.branch_data[i].location.split(",")[0],data.branch_data[i].location.split(",")[1]);
								            var energyShow = data.branch_data[i].data_value;
								            var branchName = data.branch_data[i].branch_name;
								            latCoord.push( data.branch_data[i].location.split(",")[1]);  
								            addMarker(1,linePoint, i, 1,energyShow);
								            showNamemarker(linePoint,i,branchName,3)
								            var maxLocation =  data.branch_data[0].location;
			                        	    var minLocation =  data.branch_data[1].location;
			                        	    if(maxLocation < data.branch_data[i].location){
			                        	    	maxLocation = data.branch_data[i].location;
			                        	    }
			                        	    if(minLocation > data.branch_data[i].location){
			                        	    	minLocation = data.branch_data[i].location;
			                        	    }
								            newRes.push({
										        name  : data.branch_data[i].branch_id,
										        value : latCoord.pop(),
										    });  
									    }
										//6.允许鼠标拖动，但是地图中心不改变
										var b = new BMap.Bounds(new BMap.Point(minLocation.split(",")[0], minLocation.split(",")[1]),new BMap.Point(maxLocation.split(",")[0], maxLocation.split(",")[1]));
										console.info(b);
										try {
											BMapLib.AreaRestriction.setBounds(map, b);
										} catch (e) {
											alert(e);
										}
										console.info(newRes);
								    }
//								    
								});
//					    }else{
////					    	alert("当前点击的分公司没有换热站！");
//					    }
		    }
//		    
////		//进入具体的换热站
		    function  showState(ev){
		    //1.清除上一级别的覆盖物并设置新的地图尺寸，
		    	map.setZoom(10);
		    	map.clearOverlays();
		    //2.获取当前点击支线的ID值获取换热站的地理坐标信息
		    	var ev = ev || window.event;
				var p = ev.target || ev.srcElement;
				var markerPositionlat = p.getPosition().lat;
				var branchId;
				//3.find branchId (通过marker坐标来获得相应的id值)
//			    if( markerPositionlat){
//                      for(var x = 0 ; x < newRes.length ; x++){
//                          if( newRes[x].value == markerPositionlat){
//                              branchId = newRes[x].name;
////                              alert(branchId);
//                          }
//                      }
                        // use id to find state information
//                      if(branchId){
                        	//用来检测是否获取到支线的ID值
//                      	console.info(222); 
                            //4.用来获取具体的换热站的数据
	                            $.ajax({
		                           	url:"/v1_0_0/company/58c20d5f9aa7a32554f770ab/station",
		                           	dataType:"JSON",
		                           	type:"get",
		                           	success:function(data){
		                           		console.info(data);
		                            //5.开始填充数据
				                        for(var x = 0;x < data.station_data.length; x++){
				                        	    var maxLocation =  data.station_data[0].location;
				                        	    var minLocation =  data.station_data[1].location;
				                        	    if(maxLocation < data.station_data[x].location){
				                        	    	maxLocation = data.station_data[x].location;
				                        	    }
				                        	    if(minLocation > data.station_data[x].location){
				                        	    	minLocation = data.station_data[x].location;
				                        	    }
												var statePoint = new BMap.Point( data.station_data[x].location.split(",")[0],data.station_data[x].location.split(",")[1]);
											    var valueShow=data.station_data[x].data_value;
											    var stationName=data.station_data[x].station_name;
											    addMarker(2,statePoint,2,x,valueShow);
											    showNamemarker(statePoint,x,stationName,2);	    
				                    }
			                        console.info(res);
							        //6.允许鼠标拖动，但是地图中心不改变
									var b = new BMap.Bounds(new BMap.Point(minLocation.split(",")[0], minLocation.split(",")[1]),new BMap.Point(maxLocation.split(",")[0], maxLocation.split(",")[1]));
									console.info(b);
									try {
										BMapLib.AreaRestriction.setBounds(map, b);
									} catch (e) {
										alert(e);
									}
			
			                    }
		    	            });    
//                      }else{
//                         alert("当前点击的支线没有具体的换热站信息！");
//                      }
//		        }
		}
		    function showMessage(ev){
		    	  	var ev = ev || window.event;
				var p = ev.target || ev.srcElement;
				var markerPositionlat = p.getPosition().lat;

                WebViewBridge.send(markerPositionlat.toString());
				//alert(markerPositionlat);
		    }
   
		//添加滚轮事件判断当前地图的级别进行不同级别的显示
		//鼠标滚轮事件的监听 listen mapwheel function  
		mousewheelListen();
        function mousewheelListen (){
            var str = window.navigator.userAgent.toLowerCase();
		    if (str.indexOf('firefox')!=-1) {
			    map.addEventListener('DOMMouseScroll',function (ev){
					var e = ev || window.event;
					if (e.detail < 0) {
					   			//前滚，地图级别加大
					    var a=map.getZoom(); //改变地图的级别
					} else {
					   			//后滚，地图级别减小
			   		};
			    },false);
            } else{
					   	//其他浏览器
			    map.onmousewheel = function (ev){
					var e=ev||window.event;
					if (e.wheelDelta>0) {
					   			//前滚，地图级别加大
					}else{
					   			//后滚，地图级别减小
					};
					
			    }
			        }
            }    