// Use the D3 library to read in samples.json.
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
d3.json('samples.json').then((data)=>{
    var id=data.names;
    console.log(data.metadata);
    var select=d3.selectAll('#selDataset');
    Object.entries(id).forEach(([i,v])=>{
        select.append('option').text(v);
    })
})

// Use sample_values as the values for the bar chart.
function makePlot(testId){
    d3.json('samples.json').then((data)=>{
       // Array
        var samples=data.samples;
        var testNum=samples.map(row=>row.id).indexOf(testId);
        // Bar Graph
        var otuValueTen=samples.map(row=>row.sample_values);
        var otuValueTen=otuValueTen[testNum].slice(0,10).reverse();
        // Use otu_ids as the labels for the bar chart.
        var otuIdTen=samples.map(row=>row.otu_ids);
        var otuIdTen=otuIdTen[testNum].slice(0,10);
        // Use otu_labels as the hovertext for the chart.
        var otuLabelTen=samples.map(row=>row.otu_labels); 
        var otuLabelTen=otuLabelTen[testNum].slice(0,10); 
        var trace={
            x: otuValueTen,
            y: otuIdTen.map(r=>`UTO ${r}`),
            text: otuLabelTen,
            type:'bar',
            orientation:'h'
        }
        Plotly.newPlot('bar',[trace]);
        // Create a bubble chart that displays each sample.
        var otuValue=samples.map(row=>row.sample_values);
        var otuValue=otuValue[testNum];
        var otuId=samples.map(row=>row.otu_ids);
        var otuId=otuId[testNum];
        var otuLabel=samples.map(row=>row.otu_labels); 
        var otuLabel=otuLabel[testNum];
        var minIds=d3.min(otuId);
        var maxIds=d3.max(otuId);
        var mapNr = d3.scaleLinear().domain([minIds, maxIds]).range([0, 1]);
        var bubbleColors = otuId.map( val => d3.interpolateRgbBasis(["royalblue", "greenyellow", "goldenrod"])(mapNr(val)));
        var trace1={
            x: otuId,
            y: otuValue,
            text: otuLabel,
            mode: 'markers',
            marker: {
                color: bubbleColors,
                size: otuValue.map(x=>x*10),
                sizemode: 'area'
            }
        };
        var data1=[trace1];
        var bubbleLayout={
            xaxis:{
                autochange: true,
                height: 600,
                width: 1000,
                title: {
                    text: 'OTU ID'
                }
            },
        };
        Plotly.newPlot('bubble',data1,bubbleLayout);   
        
        // Display the sample metadata, i.e., an individual's demographic information.
        var metadata=d3.select('#sample-metadata');
        metadata.html('');
        Object.entries(meta[testNum]).forEach(([k,v])=>{
            metadata.append('p').text(`${k.toUpperCase()}:\n${v}`);
        })
    })
}

// Submit Button handler
function optionChanged(newId) {
    // Select the input value from the form
    makePlot(newId);
}
  