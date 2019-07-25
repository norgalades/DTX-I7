window.HistData = 0;
var clock;

function refresh_data_history_Line() {
  clock = setInterval(callAPIForHistoricalDataLine, 10000);
}

function callAPIForHistoricalDataLine() {
    //console.log("callAPIForHistoricalDataPie");
    $.ajax({
        //url: 'https://a4girz51oh.execute-api.us-east-1.amazonaws.com/return/1?recordTime=1', //FIXME: get the actual link
        url: 'https://1xwt8lhj3l.execute-api.eu-central-1.amazonaws.com/turbinestats/all?id=turbine',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            window.HistData = response.record;
            if (window.filterActive){
                createChartLine(window.HistDataFiltered);
            }
            else{
                createChartLine(window.HistData);
            }
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
    //console.log(window.HistData);
}

function createChartLine(histDataLocal) {
    var count = [0, 0, 0, 0];
    var voltArray = [0, 0, 0, 0];
    var tempArray = [0, 0, 0, 0];

    for (var i = 0; i < histDataLocal.length; i++) {
        if (parseFloat(histDataLocal[i].voltage) == NaN) {
            parseFloat(histDataLocal[i].voltage) == 0;
        }
        if (histDataLocal[i].turbineId == 1) {
            count[0] += 1;
            voltArray[0] += parseFloat(histDataLocal[i].voltage);
            tempArray[0] += parseFloat(histDataLocal[i].temp);
        }
        else if (histDataLocal[i].turbineId == 2) {
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
    for (var j = 0; j < tempArray.length; j++) {

        volLen[j] = j;
    }
    tempArray[0] = 0;
    tempArray[1] = tempArray[1] / count[0];
    tempArray[2] = tempArray[2] / count[1];
    tempArray[3] = tempArray[3] / count[2];
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    // Pie Chart Example
    var ctx = document.getElementById("myPieChart");
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Turbine 1", "Turbine 2", "Turbine 3"],
            datasets: [{
                label: "Temperature",
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                hoverBackgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 0.05)",
                data: tempArray,
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
                        unit: 'Temperature'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 150,
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return '' + number_format(value);
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
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
                    }
                }
            },
        }
    });
}