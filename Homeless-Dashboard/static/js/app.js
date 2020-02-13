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
});


//function to unpack yearly data for page load yearly data graphs
function unpackPage(responceData) {
    var yearly = {}
    yearly['years'] = Object.entries(responceData.flow.yearly.active).map(d => d[0]);
    yearly['in'] = Object.entries(responceData.flow.yearly.active).map(d => d[1]);
    yearly['out'] = Object.entries(responceData.flow.yearly.out).map(d => d[1]);
    yearly['active'] = Object.entries(responceData.flow.yearly.active).map(d => d[1]);
    yearly['monthlyOutcomes'] = {'exitAll':responceData.outcomes.monthly.exit_all,
                                'exitPH': responceData.outcomes.monthly.exit_ph};
    return yearly
}

// function to filter fowdata
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
            'exitAll': Object.entries(yearlyData.monthlyOutcomes.exitAll).filter(monthlyDictFilter).map(d => d[1]),
            'exitPH': Object.entries(yearlyData.monthlyOutcomes.exitAll).filter(monthlyDictFilter).map(d => d[1])
        }
    });
    console.log('Data For Page Load Exit to PH Graph : ', monthlyOutcomesgraph)

    //will use update functions to build responsive part of rows
    updateFlow(flow);
    updateOutcomes(outcomes);
    updateDemo(demo);
}

// function to update flow of in/out/exit row 
// flow will be dictionary of all data needed for this row filtered to year
function updateFlow(flow, year) {
    // code for graphs 
    // will just be changing the css class to "active"/"inactive" for yearly chart


    //code for cards
}

//function to update exit to PH row
// ph is dictionary of filtered data for exit to ph row 
function updateOutcomes(outcomes, year) {
    // code for graphs

    //code for cards
}

function updateDemo(demo,year) {
    //code for graphs

    // code for cards
}

// function attached to event listener in html for when the option 
// in drop down box changes 
function optionChanged(value) {
    var filteredFlow = filterFlow(value,flowData);
    var filteredOutcomes = filterOutcomes(value, phData);
    var filteredDemo = filterDemo(value, demoData);
    updateFlow(filteredFlow, value);
    updateOutcomes(filteredOutcomes, value);
    updateDemo(filteredDemo, value);
}



