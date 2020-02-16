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
    updateDemo(demo,'2018');
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
            text: 'Program Participation by Year'
        },
        subtitle: {
            text: 'For any given period of time, participants enroll, remain active, or exit programs providing homeless related services'
        },
        xAxis: {
            categories: [
                
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                // rotation: 0,
                // y: 0
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:"black";padding:0">{series.name}: </td>' +
                '<td style="padding:0; text-align:right"><b>{point.y}</b></td></tr>',

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
            text: `${year} Program Participation by Month`
        },
        subtitle: {
            text: 'For a closer look at participant flow in and out, deselect the Active category in the legend'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
            crosshair: true
        },
        credits: {
            enabled: false
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:"black";padding:0">{series.name}: </td>' + " " +
                '<td style="padding:0; text-align: right"><b>{point.y}</b></td></tr>',
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
        // chartOptions.xAxis.categories.push(month);
    });

    Highcharts.chart('monthly-bar',chartOptions);
    
  

    //code for cards
    d3.select('#flow-row-card-header').html(`<h4> ${year} Top 5 Programs</h4>By Number of Enrollments`);
    d3.select('#flow-card-list').html('');
    flow.top5.forEach(item => {
        
        d3.select('#flow-card-list').append('p').attr('class','list-group-item').html(`<b>${item[0]}:</b> ${item[1]}`)
    });
}

//function to update exit to PH row
// ph is dictionary of filtered data for exit to ph row 
function updateOutcomes(outcomes, year) {
    // code for graphs

// 

    //code for cards
    d3.select('#outcome-row-card-header-percent').html
        (`<h4>${year}</h4>`);
        d3.select('#percent-ph-text').html(`<h1 class ='h1-card'> ${outcomes.percentPHyear}%</h1>
        <p>Of program enrollees had permanent housing upon program exit</p>`);   
        
    d3.select('#outcome-row-card-header-avg').html
        (`<h4>${year}</h4>`);
        d3.select('#avg-ph-text').html(`<h1 class='h1-card'> ${outcomes.avgTimeToPH} days</h1>
        <p>Average time from initial shelter/transitional housing to permanent housing</p>`);     
}

function updateDemo(demo,year) {
    //code for graphs
    var racechartOptions = {
        colorAxis: {
            minColor: '#ffffff',
            maxColor: '#f28f43'
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'sliceAndDice',
            data: []
        }],
        title: {
            text: `${year} Race`
        }
    };

    var race = demo.race[0];
    race.forEach(item => {
        racechartOptions.series[0].data.push(
            {name: item[0],
            value: item[1],
            colorValue: item[1]}
        )
    });
    Highcharts.chart('race', racechartOptions);
    

    var gender = demo.gender[0];
    var chartOptions =  {
        chart: {
            type: 'bar'
        },
        title: {
            text: `${year} Gender`
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [
        ],
            crosshair: true
        },
        credits: {
            enabled: false
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:"black";padding:0">{series.name}: </td>' + " " +
                '<td style="padding:0; text-align: right"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                },
                showInLegend: false
            }
        },
        series: [{
            name: 'Number of Program Enrollees',
            data: []
    
        }]
    };
    gender.reverse().forEach((item) => {
        chartOptions.series[0].data.push(item[1]);
        chartOptions.xAxis.categories.push(item[0]);
        // chartOptions.xAxis.categories.push(month);
    });

    Highcharts.chart('gender',chartOptions);

    // still need code for boxplot 
    var age = demo.age[0][0];
    console.log('FIRST');
    //have to convert data type 
    age.forEach((item,index) => {
        age[index] = parseFloat(item);
    })
    console.log(age);
    var ageOptions = {

        chart: {
            type: 'boxplot'
        },
        credits: {
            enabled: false
        },
    
        title: {
            text: `${year} Age Distribution`
        },
    
        legend: {
            enabled: false
        },
    
        xAxis: {
            categories: [`${year}`],
            title: {
                text: ''
            }
        },
    
        yAxis: {
            title: {
                text: 'Age'
            }
        },
        plotOptions: {
            boxplot: {
                fillColor: '#91e8e1',
                lineWidth: 1,
                lineColor: '#2b908f',
                medianColor: '#2b908f',
                medianWidth: 3,
                stemColor: '#2b908f',
                stemDashStyle: 'dash',
                stemWidth: 1,
                whiskerColor: '#2b908f',
                whiskerLength: '20%',
                whiskerWidth: 3
            }
        },
        series: [{
            name: 'Age',
            data: [
                age
            ],
            tooltip: {
                headerFormat: '<em>{point.key}</em><br/>'
            }
        }]
    
    };

    Highcharts.chart('age',ageOptions);
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



