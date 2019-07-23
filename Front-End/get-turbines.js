function getJSON() {
  $.ajax({
    url: 'https://a4girz51oh.execute-api.us-east-1.amazonaws.com/return/1?recordTime=1', //FIXME: get the actual link
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      //Call the functions that will use the json
      tur = response.turbines;
      getWindSpeed(tur, 1);
      getVoltage(tur, 1);
      getTemp(tur, 1);
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}

function getWindSpeed(tur, filteredId) {
    var len = tur.length;
	for (i = 0; i < len; i++) {
		if (tur[i].turbineId == filteredId){
			var ret = tur[i];
    		document.getElementById("turbines_windspeed").innerHTML = String(ret.windSpeed);
    	}
	}
}

function getVoltage(tur, filteredId) {
    var len = tur.length;
	for (i = 0; i < len; i++) {
		if (tur[i].turbineId == filteredId){
			var ret = tur[i];
    		document.getElementById("turbines_volt").innerHTML = String(ret.voltage);
    	}
	}
}

function getTemp(tur, filteredId) {
    var len = tur.length;
	for (i = 0; i < len; i++) {
		if (tur[i].turbineId == filteredId){
			var ret = tur[i];
    		document.getElementById("turbines_temp").innerHTML = String(ret.temp);
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