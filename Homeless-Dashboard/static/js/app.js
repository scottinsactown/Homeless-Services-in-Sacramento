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
            data: [
                // if want to add N per period as well format as:
                // {y: series data,
                // myData: outside data}
            ]
        }, 
        {
            name: '2016',
            data: []
        },
        {
            name: '2017',
            data: []
        },    {
            name: '2018',
            data: []
        },    {
            name: '2019',
            data: []
        },
        ],
        // Moves location of series names to be as close as possible to line
        legend: {
            layout: 'proximate',
            align: 'right'
        },
        tooltip: {
            // shared: true, //makes all data for that time point visible
            // useHTML: true, //allows for more custom and complicated tooltip design
            // headerFormat: '{point.key}<table>',
            // pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
            //     '<td style="text-align: right"><b>{point.y} EUR</b></td></tr>',
            // footerFormat: '</table>',
            // valueDecimals: 2
            formatter: function () {
                return this.x + " " +this.series.name + ": <b>" + this.y
                // +"%<b><br> N = ?????"
                // +'<br>The value for <b>' + this.x +
                //     '</b> is <b>' + this.y + '</b>'+'<br>here is explanation';
            }
        },
    });
    let years = []
    let keys = Object.keys(monthlyOutcomesgraph);
    years.push(keys)

    let phSeries = []
    years[0].forEach(year => 
        phSeries.push(monthlyOutcomesgraph[year].percentPHmo)
        )

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
    var maxes = [d3.max(data[0]), d3.max(data[1]), d3.max(data[2])]
    console.log(maxes);
    var windowWidth = window.innerWidth;
    
    var chartMargin = {
        top:30,
        right:30,
        bottom:65,
        left:30
    };
    var svgHeight = 300;
    var svgWidth = windowWidth/3;
    var yearlybarchartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var yearlybarchartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
    d3.select('#yearly-bar').html('');
    var yearlyflowSVG = d3.select('#yearly-bar')
        .append('svg')
        .attr("height", svgHeight)
       .attr("width", svgWidth);
    var yScale = d3.scaleBand()
        .domain(years)
        .range([0, yearlybarchartHeight]);
  //   console.log(yScale.bandwidth());
    var totalXScale = d3.scaleBand()
        .domain(['in','active','out'])
        .range([0, yearlybarchartWidth]);
    var yearlybarchartGroup = yearlyflowSVG.append('g').attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    var topAxis = d3.axisTop(totalXScale);
    var leftAxis = d3.axisLeft(yScale);
    yearlybarchartGroup.append("g")
      .call(leftAxis);
    yearlybarchartGroup.append("g")
    .attr("transform", `translate(0, 0)`)
    .call(topAxis);
    for (var i = 0; i < 3; i++) {
        if (i === 0) {var classed = 'bar-in'}
        else if (i === 1) {var classed = 'bar-act'}
        else {var classed = 'bar-out'}
      var XScale = d3.scaleLinear()
          .domain([0, maxes[i]+1500])
          .range([(i * totalXScale.bandwidth())+5, ((i + 1) * totalXScale.bandwidth())-5])
      var bottomAxis = d3.axisBottom(XScale);
          yearlybarchartGroup.append('g')
            .attr('transform',`translate(0,${yearlybarchartHeight})`)
            .call(bottomAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', "-.8em")
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)');
      years.forEach((item, index) => {
          yearlybarchartGroup
              .append('rect')
              .attr('class', classed)
              .attr('x', (i * totalXScale.bandwidth()))
              .attr('y', yScale(item))
              .attr('width', XScale(data[i][index])/(i+1))
              .attr('height',yScale.bandwidth()-10)
              
      });
    }
  }

// function to update flow of in/out/exit row 
// flow will be dictionary of all data needed for this row filtered to year
function updateFlow(flow, year) {
    // code for graphs 
    // will just be changing the css class to "active"/"inactive" for yearly chart
    var months = flow.months;
    var data = [flow.in, flow.active, flow.out]
    var maxes = [d3.max(data[0]), d3.max(data[1]), d3.max(data[2])]
    console.log(maxes);
    var windowWidth = window.innerWidth;
    var chartMargin = {
        top:30,
        right:30,
        bottom:65,
        left:60
    }; 
    var svgHeight = 400;
    var svgWidth = windowWidth/2.5;
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
    d3.select('#monthly-bar').html('');
    var svg = d3.select('#monthly-bar')
        .append('svg')
        .attr("height", svgHeight)
       .attr("width", svgWidth);
    var yScale = d3.scaleBand()
        .domain(months)
        .range([0, chartHeight]);
  //   console.log(yScale.bandwidth());
    var totalXScale = d3.scaleBand()
        .domain(['in','active','out'])
        .range([0, chartWidth]);
    var chartGroup = svg.append('g').attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    var topAxis = d3.axisTop(totalXScale);
    var leftAxis = d3.axisLeft(yScale);
    chartGroup.append("g")
      .call(leftAxis);
    chartGroup.append("g")
    .attr("transform", `translate(0, 0)`)
    .call(topAxis);
    for (var i = 0; i < 3; i++) {
        if (i === 0) {var classed = 'bar-in'}
        else if (i === 1) {var classed = 'bar-act'}
        else {var classed = 'bar-out'}
      var XScale = d3.scaleLinear()
          .domain([0, maxes[i]+100])
          .range([(i * totalXScale.bandwidth())+5, ((i + 1) * totalXScale.bandwidth())-5])

      var bottomAxis = d3.axisBottom(XScale);
      chartGroup.append('g')
        .attr('transform',`translate(0,${chartHeight})`)
        .call(bottomAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', "-.8em")
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)');
      months.forEach((item, index) => {
          chartGroup
              .append('rect')
              .attr('class', classed)
              .attr('x', (i * totalXScale.bandwidth()))
              .attr('y', yScale(item))
              .attr('width', XScale(data[i][index])/(i+1))
              .attr('height',yScale.bandwidth()-10)
              
      });
    }

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

d3.select('container').html
    Highcharts.chart('container', {
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
            }
        },
        series: [{
            name: '2018',
            data: [10,20,30,40,50,60,60,50,40,30,20,10],
        }, 
        {
            name: '2017',
            data: [40,20,30,10,50,60,40,50,40,50,20,60]
        }
        ],
        // Moves location of series names to be as close as possible to line
        legend: {
            layout: 'proximate',
            align: 'right'
        },
    });
;

    //code for cards
    d3.select('#outcome-row-card-header-percent').html
        (`<h6>In ${year}</h6>`);
        d3.select('#percent-ph-text').html(`<h1> ${outcomes.percentPHyear}%</h1>
        <p>Had permanent housing upon program exit</p>`);   
        
    d3.select('#outcome-row-card-header-avg').html
        (`<h6>In ${year}, it took an average of </h6>`);
        d3.select('#avg-ph-text').html(`<h1> ${outcomes.avgTimeToPH} days</h1>
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



