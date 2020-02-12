
var url = 'http://localhost:5000/api'
d3.json(url, function(data) {
    console.log(data);
    var flowData = data['flow'];
    var phData = data['ph']
    var demoData = data['demo']
    var filteredFlow = filterFlow('2018',flowData);
    var filteredPH = filterPH('2018', phData);
    var filteredDemo = filterDemo('2018', demoData);
    buildPage(filteredFlow, filteredPH, filteredDemo)
});

// function to filter fowdata
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
function filterPH() {

}


function filterDemo() {

}
//function to build graphs fill cards
// will take filtered objects with flow, ph, demo data for given year
function buildPage(flow, ph, demo){
    
    //will use update functions to build rows
    updateFlow(flow);
    updatePH(ph);
    updateDemo(demo);
}
// function to update flow of in/out/exit row 
// flow will be dictionary of all data needed for this row filtered to year
function updateFlow(flow) {
    // code for graphs 


    //code for cards
}

//function to update exit to PH row
// ph is dictionary of filtered data for exit to ph row 
function updatePH(ph) {
    // code for graphs

    //code for cards
}

function updateDemo(demo) {
    //code for graphs

    // code for cards
}

function optionChanged(value) {
    var filteredFlow = filterFlow(value,flowData);
    var filteredPH = filterPH(value, phData);
    var filteredDemo = filterDemo(value, demoData);
    updateFlow(filteredFlow);
    updatePH(filteredPH);
    updateDemo(filteredDemo);
}



