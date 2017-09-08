// JavaScript Document
var paper, $v;
var deviceId;
var currentData;//记录最新的数据
var token="";

window.onload = function () {
	if (!Raphael) {
		layer.alert("当前浏览器不支持SVG，请将浏览器升级至IE8以上，谢谢合作！");
		return null;
	}
	
	//接受来自native的消息
	document.addEventListener("message", function (e) {
		var data = eval("(" + e.data + ")");
		switch (data.type) {
			case "data": {//保存数据
				currentData = data.value;
				$v.setData(data.value);
				break;
			}
			case "token": {//保存数据
				token=data.value;
				getTemp();
				break;
			}
		}

	})
};

function getTemp(){
	try {
		$.ajax({
			url: "http://121.42.253.149:18816/v1_0_0/scadaTemp2d?system_num=1&access_token="+token,
			type: 'get',
			success: function (data) {
				paper = $("#paper");
				$v = fView("paper", 0).load(data.scada_config);
				$v.zoomsel(data.scada_size.width, data.scada_size.height);
				readDataStart();
			}
		});
	}
	catch (e) {
		alert("开始加载失败");
	}
}

//从后台服务中获取一次运行数据赋值到组态
// function loadData() {
// 	var token = $("#token").val() ? $("#token").val() : top.getToken();
// 	$.ajax({
// 		url: globalurl + "/v1_0_0/heating_station_data?station_id=" + $("#stationId").val() + "&access_token=" + token,
// 		type: 'get',
// 		success: function (data) {
// 			//console.log(data)
// 			currentData = data;
// 			$v.setData(data);
// 		}
// 	});
// }
// //开始读取数据
// function readDataStart() {
// 	loadData();
// 	updTimer = window.setInterval(loadData, 3000);
// }
