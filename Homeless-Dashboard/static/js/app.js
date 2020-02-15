var t0 = performance.now();
var url = 'http://localhost:5000/api'
d3.json(url, function(data) {
    console.log('Full Data: ', data);
    var flowData = data['flow'];
    var outcomesData = data['outcomes']
    var demoData = data['demo']
    var filteredFlow = filterFlow('2018',flowData);
    var filteredOutcomes = filterOutcomes('2018', outcomesData);
    var filteredDemo = filterDemo('2018', demoData);
    var yearlyData = unpackPage(data)

    buildPage(filteredFlow, filteredOutcomes, filteredDemo, yearlyData);
    console.log('2018 Filtered Data for PH row: ', filteredOutcomes);
    console.log('2018 Filtered Data for in/out/exit row: ', filteredFlow);
    console.log('2018 Filtered Data for Demo row: ', filteredDemo);
    console.log('Full yearly data for page load yearly graphs: ', yearlyData);
    var t1 = performance.now();
    console.log("Call to get and log data took " + (t1 - t0) + " milliseconds.");

    //Fill drop down with year options
    yearlyData.years.forEach(item => {
        d3.select('#selDataset').append("option").text(item).attr("value", item)
    });
});

 
//function to unpack yearly data for page load yearly data graphs
function unpackPage(responseData) {
    var yearly = {}
    yearly['years'] = Object.entries(responseData.flow.yearly.active).map(d => d[0]);
    yearly['in'] = Object.entries(responseData.flow.yearly.in).map(d => d[1]);
    yearly['out'] = Object.entries(responseData.flow.yearly.out).map(d => d[1]);
    yearly['active'] = Object.entries(responseData.flow.yearly.active).map(d => d[1]);
    yearly['monthlyOutcomes'] = {'exitAll':responseData.outcomes.monthly.exit_all,
                                'exitPH': responseData.outcomes.monthly.exit_ph,
                                'percentPHmo': responseData.outcomes.monthly.percent_ph};
    return yearly
}

// function to filter flowdata
//returns object with all filtered data needed for flowdata row for selected year
function filterFlow(year, flowData) {
    function monthlyDictFilter(d) {
        return (String(d).split('-')[0] === year)
    }
    var filtered = {};
    filtered['months'] = Object.entries(flowData.monthly.active).filter(monthlyDictFilter).map(d => d[0]);
    filtered['in'] = Object.entries(flowData.monthly.in).filter(monthlyDictFilter).map(d => d[1]);
    filtered['out'] = Object.entries(flowData.monthly.out).filter(monthlyDictFilter).map(d => d[1]);
    filtered['active'] = Object.entries(flowData.monthly.active).filter(monthlyDictFilter).map(d => d[1]);
    filtered['top5'] = flowData.top_5[year]
    return filtered 
}
// function to filter ph data
function filterOutcomes(year, outcomesData) {
    function monthlyDictFilter(d) {
        return (String(d[0]).split('-')[0] === year)
    }
    var filtered = {}
    // only need to filter card data for exit to PH filter,  will plot all lines and change "active" class when selected 
    // to make the selected line stand out 
    filtered['avgTimeToPH'] = Object.entries(outcomesData.yearly.average).filter(monthlyDictFilter).map(d => d[1]);
    filtered['percentPHyear'] = Object.entries(outcomesData.yearly.percent_ph).filter(monthlyDictFilter).map(d => d[1]);
    filtered['totalToPH'] = Object.entries(outcomesData.yearly.exit_ph).filter(monthlyDictFilter).map(d => d[1]);
    filtered['totalExit'] = Object.entries(outcomesData.yearly.exit_all).filter(monthlyDictFilter).map(d => d[1])

    return filtered 
}

// function to filter demographic data based on input year 
function filterDemo(year, demoData) {
    function monthlyDictFilter(d) {
        return (String(d[0]).split('-')[0] === year)
    }
    var filtered = {}
    filtered['age'] = Object.entries(demoData.age).filter(monthlyDictFilter).map(d => d[1]);
    filtered['race'] = Object.entries(demoData.race).filter(monthlyDictFilter).map(d => d[1]);
    filtered['gender'] = Object.entries(demoData.sex).filter(monthlyDictFilter).map(d => d[1]);
    return filtered 
}
//function to build graphs fill cards
// will take filtered objects with flow, ph, demo data for given year
function buildPage(flow, outcomes, demo, yearlyData){
   
    // code to buld the graphs that have static data(yearly outcomes, yearly flow)
    // object variable to separate out yearly outcome data
    var monthlyOutcomesgraph = {}
    yearlyData.years.forEach(function(year) {
        function monthlyDictFilter(d) {
            return (String(d[0]).split('-')[0] === year)
        }
        monthlyOutcomesgraph[year] = {
            'percentPHmo': Object.entries(yearlyData.monthlyOutcomes.percentPHmo).filter(monthlyDictFilter).map(d => d[1]),
            'exitAll': Object.entries(yearlyData.monthlyOutcomes.exitAll).filter(monthlyDictFilter).map(d => d[1]),
            'exitPH': Object.entries(yearlyData.monthlyOutcomes.exitPH).filter(monthlyDictFilter).map(d => d[1])
        }
    });
    console.log('Data For Page Load Exit to PH Graph : ', monthlyOutcomesgraph['2015'].percentPHmo)
    
    //will use update functions to build responsive part of rows
    updateFlow(flow, '2018');
    updateOutcomes(outcomes, '2018');
    updateDemo(demo);
    buildYearlyBar(yearlyData);

    // PH chart
    d3.select('container').html
    phChart = Highcharts.chart('container', {
        // chart: {
        //     type: 'bar'
        // },
        title: {
            text: 'Program enrollees with permanent housing upon program exit'
        },
        // Turn off Highcharts.com label/link 
        credits: {
            enabled: false
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                format: '{value}%',
            }
        },
        series: [{
            name: '2015',
            // data: [
            //     // if want to add N per period as well format as:
            //     // {y: series data,
            //     // myData: outside data}
            // ]
        }, 
        {
            name: '2016',
            // data: []
        },
        {
            name: '2017',
            // data: []
        },    {
            name: '2018',
            // data: []
        },    {
            name: '2019',
            // data: []
        },
        ],
        // Moves location of series names to be as close as possible to line
        legend: {
            layout: 'proximate',
            align: 'right'
        },
        tooltip: {
            // shared: true, //makes all data for that time point visible
            useHTML: true, //allows for more custom and complicated tooltip design
            // headerFormat: '{point.key}<table>',
            // pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
            //     '<td style="text-align: right"><b>{point.y} EUR</b></td></tr>',
            // footerFormat: '</table>',
            // valueDecimals: 2
            formatter: function () {
                return this.x + " " +this.series.name + ": <b>" + this.y
                +"%</b><br> " + this.point.myData2 + " out of " + this.point.myData 
            + "<br>Exited to permanent housing";
            }
            },
            });
        let years = []
        let keys = Object.keys(monthlyOutcomesgraph);
        years.push(keys)
            
        let phSeries = []
            years[0].forEach(year =>{ 
        var toPush = []
            monthlyOutcomesgraph[year].percentPHmo.forEach((item, index) => {
               toPush.push({'y':item, 'myData':monthlyOutcomesgraph[year].exitAll[index],
                'myData2':monthlyOutcomesgraph[year].exitPH[index]})
            });
            phSeries.push(toPush);
            });

    phChart.series.forEach(year => { 
        let index = year.index
        year.update({
        data: phSeries[index]
        }, true)
        })

}
// Function to build yearly flow bar chart
function buildYearlyBar(yearlyData) {
    var years = yearlyData.years;
    var data = [yearlyData.in, yearlyData.active, yearlyData.out]

    var chartOptions =  {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Yearly Total Program Flow'
        },
        subtitle: {
            text: 'Some Subtext'
        },
        xAxis: {
            categories: [
                
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Num Enrollments'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'In',
            data: []
    
        }, {
            name: 'Active',
            data: []
    
        }, {
            name: 'Out',
            data: []
    
        }]
    };
    years.forEach((year,index) => {
        chartOptions.series[0].data.push(yearlyData.in[index]);
        chartOptions.series[1].data.push(yearlyData.active[index]);
        chartOptions.series[2].data.push(yearlyData.out[index]);
        chartOptions.xAxis.categories.push(year);
    });

    Highcharts.chart('yearly-bar',chartOptions);
    
  }
// function to update flow of in/out/exit row 
// flow will be dictionary of all data needed for this row filtered to year
function updateFlow(flow, year) {
    // code for graphs 
    // will just be changing the css class to "active"/"inactive" for yearly chart
    var months = flow.months;
    console.log(months);
    var chartOptions =  {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly'
        },
        subtitle: {
            text: 'Some Subtext'
        },
        xAxis: {
            categories: [
                
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Num Enrollments'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'In',
            data: []
    
        }, {
            name: 'Active',
            data: []
    
        }, {
            name: 'Out',
            data: []
    
        }]
    };
    months.forEach((month,index) => {
        chartOptions.series[0].data.push(flow.in[index]);
        chartOptions.series[1].data.push(flow.active[index]);
        chartOptions.series[2].data.push(flow.out[index]);
        chartOptions.xAxis.categories.push(month);
    });

    Highcharts.chart('monthly-bar',chartOptions);
    
  

    //code for cards
    d3.select('#flow-row-card-header').html(`<h4> ${year} Top 5 Programs</h4>By Number of Enrollments`);
    d3.select('#flow-card-list').html('');
    flow.top5.forEach(item => {
        
        d3.select('#flow-card-list').append('li').attr('class','list-group-item').html(`<b>${item[0]}:</b> ${item[1]}`)
    });
}

//function to update exit to PH row
// ph is dictionary of filtered data for exit to ph row 
function updateOutcomes(outcomes, year) {
    // code for graphs

// 

    //code for cards
    d3.select('#outcome-row-card-header-percent').html
        (`<h6>In ${year}</h6>`);
        d3.select('#percent-ph-text').html(`<h1 class ='h1-card'> ${outcomes.percentPHyear}%</h1>
        <p>Had permanent housing upon program exit</p>`);   
        
    d3.select('#outcome-row-card-header-avg').html
        (`<h6>In ${year}, it took an average of </h6>`);
        d3.select('#avg-ph-text').html(`<h1 class='h1-card'> ${outcomes.avgTimeToPH} days</h1>
        <p>To go from shelter/transitional housing to permanent housing</p>`);     
}

function updateDemo(demo,year) {
    //code for graphs

    // code for cards
}

// function attached to event listener in html for when the option 
// in drop down box changes 
function optionChanged(value) {
    d3.json(url, function(data) {
        var flowData = data['flow'];
        var outcomesData = data['outcomes']
        var demoData = data['demo']
        var filteredFlow = filterFlow(value,flowData);
        var filteredOutcomes = filterOutcomes(value, outcomesData);
        var filteredDemo = filterDemo(value, demoData);
        console.log(value + ' Filtered Data for PH row: ', filteredOutcomes);
        console.log(value + ' Filtered Data for in/out/exit row: ', filteredFlow);
        console.log(value + ' Filtered Data for Demo row: ', filteredDemo);



    updateFlow(filteredFlow, value);
    updateOutcomes(filteredOutcomes, value);
    updateDemo(filteredDemo, value);
    });
}



