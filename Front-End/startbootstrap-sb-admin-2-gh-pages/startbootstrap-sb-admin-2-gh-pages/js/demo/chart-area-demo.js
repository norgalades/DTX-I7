window.HistData = 0;
window.HistDataFiltered = 0; 
window.filterActive = false;
var clock;

function refresh_data_history() {
  clock = setInterval(callAPIForHistoricalData, 10000);
}

function callAPIForHistoricalData() {
    //console.log("callAPIForHistoricalDataArea");
    $.ajax({
        //url: 'https://a4girz51oh.execute-api.us-east-1.amazonaws.com/return/1?recordTime=1', //FIXME: get the actual link
        url: 'https://1xwt8lhj3l.execute-api.eu-central-1.amazonaws.com/turbinestats/all?id=turbine',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            window.HistData = response.record;
            if (window.filterActive){
                createChart(window.HistDataFiltered);
            }
            else{
                createChart(window.HistData);
            }
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
    //console.log(window.HistData); 
}

function cb(start, end) {
    if(start == "" && end == ""){
      document.getElementById("reportrange_span").innerHTML = String("Weird");
    }
    else{
      document.getElementById("reportrange_span").innerHTML = String(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      filterActive = true;
    }
    window.HistDataFiltered = dateFilter(start, end, window.HistData);
    console.log("filtered: " + JSON.stringify(window.HistDataFiltered));
}

function dateFilter(startDate, endDate, in_json){
  console.log("filtering... " + startDate + " - " + endDate);
  console.log("in_json: " + JSON.stringify(in_json));
  var out_json = in_json.filter(function(elem) {
      if (elem.time >= (startDate/1000) && elem.time <= (endDate/1000)) {
        console.log("elem: " + JSON.stringify(elem));
        return true;
      } 
  });
  console.log("out_json: " + JSON.stringify(out_json));
  return out_json;
}

function daterangepickler() {
  var start = moment().subtract(29, 'days');
  var end = moment();

  $('#reportrange').daterangepicker({
      startDate: start,
      endDate: end,
      ranges: {
         'Today': [moment(), moment()],
         'Last 7 Days': [moment().subtract(6, 'days'), moment()],
         'Last 30 Days': [moment().subtract(29, 'days'), moment()]
      }
  }, cb);

  //cb(start, end);
}

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function createChart(histDataLocal) {
    var count = [0,0,0,0];
    var voltArray = [0,0,0,0];
    var tempArray = [0,0,0,0];
   
    for (var i = 0; i < histDataLocal.length; i++) {
        if (parseFloat(histDataLocal[i].voltage) == NaN)
        {
            parseFloat(histDataLocal[i].voltage) == 0;
        }
        if (histDataLocal[i].turbineId == 1) {
            count[0] += 1;
            voltArray[0] += parseFloat(histDataLocal[i].voltage);
            tempArray[0] += parseFloat(histDataLocal[i].temp);
        }
        else if (histDataLocal[i].turbineId == 2){
            count[1] += 1;
            voltArray[1] += parseFloat(histDataLocal[i].voltage);
            tempArray[1] += parseFloat(histDataLocal[i].temp);
        }
        else if (histDataLocal[i].turbineId == 3) {
            count[2] += 1;
            voltArray[2] += parseFloat(histDataLocal[i].voltage);
            tempArray[2] += parseFloat(histDataLocal[i].temp);
        }
        else if (histDataLocal[i].turbineId == 4) {
            count[3] += 1;
            voltArray[3] += parseFloat(histDataLocal[i].voltage);
            tempArray[3] += parseFloat(histDataLocal[i].temp);
        }
    }
    var volLen = [];
    for (var j = 0; j < voltArray.length; j++) {
       
        volLen[j] = j;
    }
    voltArray[0] = voltArray[0] / count[0];
    voltArray[1] = voltArray[1] / count[1];
    voltArray[2] = voltArray[2] / count[2];
   
    // Area Chart Example
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Turbine 1','Turbine 2','Turbine 3'],
            datasets: [{
                label: "Voltage",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: voltArray,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            //return '' + number_format(value);
                            return '' + value;
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + tooltipItem.yLabel.toFixed(4);
                    }
                }
            }
        }
    });
}