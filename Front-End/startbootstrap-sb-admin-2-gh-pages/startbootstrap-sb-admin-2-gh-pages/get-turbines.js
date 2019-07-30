var tur = 100;
var clock;
var temperatureFilter = 1000;

function refresh_data() {
  clock = setInterval(getJSON, 100);
}

/*************************************jQuery Functions****************************************************/

$("#turb_online").change(function runPython(){});

/*************************************End of jQuery*******************************************************/

function sendAlert(){
  alert("A turbine is offline!!!");
}

function runPython()
{
    $.ajax({
    type: "POST",
    //url: "/var/www/html/startbootstrap-sb-admin-2-gh-pages/startbootstrap-sb-admin-2-gh-pages/aws-sns.py",
    url: "",
    data :{},
    success: sendAlert
    });
}

function filterByTemp() {
  if(parseFloat(document.getElementById("temperatureNum").value === "")){
   temperatureFilter = 1000;
  }else{
    temperatureFilter = parseFloat(document.getElementById("temperatureNum").value); //ex.
  }
  console.log(temperatureFilter)
}

function callAPI(){
  $.ajax({
    url: 'https://1xwt8lhj3l.execute-api.eu-central-1.amazonaws.com/turbinestats/latest?id=turbine',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      tur = response.record;
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}

function getJSON() {
  callAPI();
  updateRealtimeDash(tur);
  updateKPIDash(tur);
}

function getStatus(tur) {
    var online = 0;
    var offline = 0;
    for (i = 1; i <= 66; i++) { 
      if($("#turb_" + i).length != 0){
        var template = $("#turb_" + i);
        if(template.find("#turb_online").length != 0)
          online++;
        else 
          offline++;
      }
    }
    document.getElementById("numb_kpi_online").innerHTML = online;
    document.getElementById("numb_kpi_offline").innerHTML = offline;
}

function computeTurbPower(turb){
  var pow = parseFloat(turb.windSpeed * turb.windSpeed * turb.windSpeed * 0.158 * 0.158 * 1.57).toFixed(4);
  return pow;
}

function calcPower(tur) {
    var len = tur.length;
    var pow = [0, 0, 0];
    var tot = 0;
  
    for (i = 1; i <= 66; i++) { 
      if($("#turb_" + i).length != 0){
       var template = $("#turb_" + i);
       tot += parseFloat(String(template.find(".power").text()).replace("Power: ", '').replace(" W", ''));
      }
    }
    document.getElementById("numb_kpi_totpow").innerHTML = tot.toFixed(4);
  }

function filterByIDs() {
   var id = document.getElementById("turbine_num").value; //ex. 2-66
   if(id.trim() == ""){
      showCardRange(1, 66);
    }else{  
      if(id.includes('-')){
        arr = id.split('-');
        console.log(arr);
        from = arr[0].trim();
        to = arr[1].trim();
        if(to == null){
          to = from; 
        }
        hideCardRange(0, (parseInt(from)-1)); 
        showCardRange(from, to);
        hideCardRange((parseInt(to)+1), 66);
      }else if(id.includes(',')){
        arr = id.split(',')
        hideCardRange(0, 66);
        for(i = 0; i < arr.length; i++){
          showCardRange(arr[i],arr[i]);
        }
      }else{
        to = id.trim();
        from = to;
        hideCardRange(0, (parseInt(from)-1)); 
        showCardRange(from, to);
        hideCardRange((parseInt(to)+1), 66);
      }
  }
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
  return time;
}

function hideCardRange(fromCard, toCard) {
  var i;
  for (i = fromCard; i <= toCard; i++) { 
    if($("#turb_" + i).length != 0){
      var template = $("#turb_" + i);
      template.hide()
    }
  }
}

function showCardRange(fromCard, toCard) {
  var i;
  for (i = fromCard; i <= toCard; i++) { 
    if($("#turb_" + i).length != 0){
      var template = $("#turb_" + i);
      template.show()
    }
  }
}

function modifyTurbineCard(stats){
    var template = $("#turb_" + stats.turbineId);
    var currentDate = Date.parse(template.find(".time").text().replace("Date: ", ""))
    if (currentDate < (parseInt(stats.time) * 1000) || template.find(".time").text().localeCompare("Time: ")) {
        template.find(".number_id").text("Turbine ID:    " + stats.turbineId);
        template.find(".volt").text("Voltage: " + stats.voltage);
        template.find(".temp").text("Temperature: " + stats.temp + " F");
        template.find(".windspeed").text("Wind Speed: " + String(parseFloat(stats.windSpeed).toFixed(4)) + " m/s");
        template.find(".power").text("Power: " + computeTurbPower(stats) + " W");
        template.find(".time").text("Date: " + new Date(parseInt(stats.time.substring(0, 10)) * 1000));

    }
        var icon = template.find("#Icon_Auto");

  //Modifica card color with respect to the status
  var border = template.find(".border_color");
  var title =  template.find(".title_color");
    var card = template.find("#turb_online");
    var icon = template.find("#Icon_Auto");
    if (parseFloat(stats.temp) > temperatureFilter) {
        template.find(".temp").attr("style", "color:red");
    } else {
        template.find(".temp").attr("style", "");
    }
  if (stats.status == "ONLINE"){ 
    //console.log(title);
    card.attr("id", "turb_online");
    border.attr("class", "card shadow h-100 py-2 card_color border-left-primary-online");
    title.attr("class", "text-xs font-weight-bold text-uppercase mb-1 number_id title-color text-primary-online");
    icon.attr("style", "color: #4e73df");
  }
  else {
    card.attr("id", "turb_offline");
    border.attr("class", "card shadow h-100 py-2 card_color border-left-primary-offline");
    title.attr("class", "title-color text-xs font-weight-bold text-uppercase mb-1 number_id text-primary-offline");
    icon.attr("style", "color: red");
  }
}

function createTurbineCard(stats) {
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

function updateKPIDash(tur){
  getStatus(tur);
  calcPower(tur);
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
