window.tur = 100;

var clock;

function refresh_data() {
  clock = setInterval(getJSON, 1000);
}

function callAPI(){
  $.ajax({
    //url: 'https://a4girz51oh.execute-api.us-east-1.amazonaws.com/return/1?recordTime=1', //FIXME: get the actual link
    //url: 'https://1xwt8lhj3l.execute-api.eu-central-1.amazonaws.com/turbinestats/all?id=turbine',
    url: 'https://1xwt8lhj3l.execute-api.eu-central-1.amazonaws.com/turbinestats/latest?id=turbine',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      window.tur = response.record;
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}

function getJSON() {
  //console.log("Another call!")
  callAPI();
  updateRealtimeDash(window.tur)
}

function filterById() {
  var id = document.getElementById("turbine_num").value;
  var from = id.match(/ain/gi);
  getData(window.tur, id);
  getWindSpeed(window.tur, id);
  console.log(id);
  getVoltage(window.tur, id);
  getTemp(window.tur, id);
} 

function convertTimestamp(ts){
  var s = new Date(Math.round((ts.replace(/[^0-9]/g, ''))) * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = s.getFullYear();
  var month = months[s.getMonth()];
  var date = s.getDate();
  var hour = s.getHours();
  var min = s.getMinutes();
  var sec = s.getSeconds();
  var time = String(date) + '-' + String(month) + '-'+"2019" + ' ' + hour + ':' + min + ':' + sec ;
  //console.log(String(date) + " time: " + time);
  console.log(" time: " + time);
  return time;
}

function modifyTurbineCard(stats){
  var template = $("#turb_" + stats.turbineId);
  //console.log(template.find(".number_id"));
  template.find(".number_id").text("Turbine ID:    " + stats.turbineId);
  template.find(".volt").text("Voltage: " + stats.voltage);
  template.find(".temp").text("Temperature: " + stats.temp);
  template.find(".windspeed").text("Wind Speed: " + stats.windSpeed);
  template.find(".power").text("Power: " + "60 MW");
  template.find(".direction").text("Direction: " + "EST");
  template.find(".unk").text("Current: " + "UNK");
  console.log(parseInt(stats.time.substring(0,10)))
  template.find(".time").text("Timestamp: " + new Date(parseInt(stats.time.substring(0,10)) * 1000));

  //Modifica card color with respect to the status
  var border = template.find(".border_color");
  var title =  template.find(".title_color");
  if (stats.status == "ONLINE"){ 
    console.log(title);
    border.attr("class", "card shadow h-100 py-2 card_color border-left-primary-online");
    title.attr("class", "text-xs font-weight-bold text-uppercase mb-1 number_id title-color text-primary-online");
  }
  else {
    border.attr("class", "card shadow h-100 py-2 card_color border-left-primary-offline");
    title.attr("class", "title-color text-xs font-weight-bold text-uppercase mb-1 number_id text-primary-offline");
  }

}

function createTurbineCard(stats) {
  //console.log("Card: " + stats.turbineId + " created!");
  var template = $("#turbines_box_template").clone();
  template.attr("id", "turb_" + stats.turbineId);
  template.attr("style", "");
  $("#realtime").append(template);
  modifyTurbineCard(stats)
}

function updateRealtimeDash(tur) {
  var len = tur.length;
  for (i = 0; i < len; i++) {
    //console.log("Update: " + $("#turb_" + tur[i].turbineId).length);
    if($("#turb_" + tur[i].turbineId).length != 0){
      var template = $("#turb_" + tur[i].turbineId);
      modifyTurbineCard(tur[i])
    }
    else{
      createTurbineCard(tur[i]);
    }
  }
}


function getVoltage(tur, filteredId) {
  var len = tur.length;
  for (i = 0; i < len; i++) {
    if (tur[i].turbineId == filteredId){
      var ret = tur[i];
      document.getElementById("turbines_volt").innerHTML = parseFloat(ret.voltage).toFixed(2);
      }
  }
}

function getWindSpeed(tur, filteredId) {
  var len = tur.length;
	for (i = 0; i < len; i++) {
		if (tur[i].turbineId == filteredId){
			var ret = tur[i];
    		document.getElementById("turbines_windspeed").innerHTML = parseFloat(ret.windSpeed).toFixed(2);
    	}
	}
}

function getTemp(tur, filteredId) {
  var len = tur.length;
	for (i = 0; i < len; i++) {
		if (tur[i].turbineId == filteredId){
			var ret = tur[i];
    		document.getElementById("turbines_temp").innerHTML = parseFloat(ret.temp).toFixed(2);
    	}
	}
}

//DONE
function handleException(request, message, error) {
	var msg = "";
	msg += "Code: " + request.status + "\n";
	msg += "Text: " + request.statusText + "\n";
	if (request.responseJSON != null) {
		msg += "Message" + request.responseJSON.Message + "\n";
	}
	console.log(msg);
}