  var sampleJSON;
//------index.html--------------------------------------
//Fill the Information div this the selected individual metadata
//This is connecting with the index.html 
function fillInformation(information){
  //getting information div reference
  // use const instead of var or let -Javascript ES-6 
  //this is referencing index.html - <div id="sample-metadata" class="panel-body"></div>
  const informationDiv = document.getElementById("sample-metadata");

  //---------JSON data formatting----------------------------------------------
  //formatting the data
  //concatente string with backtick - template literals
  const innerData = `<div>id: ${information.id}</div>
    <div>ethnicity: ${information.ethnicity}</div
    <div>gender:W ${information.gender}</div>
    <div>age: ${information.age}</div>
    <div>location: ${information.location}</div>
    <div>bbtype: ${information.bbtype}</div>
    <div>wfreq: ${information.wfreq}</div>`;

  //----------index.html------------------------------------------------
  //filling the information div with the individual data
  informationDiv.innerHTML = innerData;
}


//-----------------------Filling Chart Data & styles - function begin----------------------
//FIlling the three charts (bar, bubble and gauge) with the selected individual data
function fillChartData(selectedData, wfreq){
  
  //getting charts references
  var barChart = document.getElementById("bar");
  var bubbleChart = document.getElementById("bubble");
  var gaugeChart = document.getElementById("gauge");
  
  //------------------style for charts-------------------------
  //bar chart settings
  var barData = [
    {
      x: selectedData.sample_values.slice(0,10),
      y: selectedData.otu_ids.slice(0,10).map((id) => "OTU "+id),
      text: selectedData.otu_labels.slice(0,10),
      type: "bar",
      orientation: "h",
      marker: {
        color: 'rgba(55,128,191,0.6)',
        width: 5
      },
    }
  ]
  
  //bubble chart settings
  var bubbleData = [
    {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      mode: "markers",
      marker: {
        color: selectedData.otu_ids,
        size: selectedData.sample_values,
      },
      text: selectedData.otu_labels,
    }
  ]
  
  //gauge chart data
  var gaugeData = [
    {
      title: { text: "Belly Button Washing Frecuency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        steps: [
          { range: [0, 1], color: "#D8E4DF" },
          { range: [1, 2], color: "#C4E0D2" },
          { range: [2, 3], color: "#B0DCC5" },
          { range: [3, 4], color: "#9BD7B7" },
          { range: [4, 5], color: "#87D3AA" },
          { range: [5, 6], color: "#73CF9D" },
          { range: [6, 7], color: "#5FCB90" },
          { range: [7, 8], color: "#4AC682" },
          { range: [8, 9], color: "#36C275" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: wfreq
        }
      }
    }
  ];
//-----------------------Filling Chart Data & styles - function end----------------------
  

  //----------------charts--------------
  //creating charts in view with plotly
  Plotly.newPlot(barChart, barData);
  Plotly.newPlot(bubbleChart, bubbleData);
  Plotly.newPlot(gaugeChart,gaugeData);
}
//-----------drop down list variable data--------------------------------
//Obtaning the data with fetch and when ready, create the initial charts
//Arrow functions
//Reads data from JSON
fetch("./samples.json").then((response) => response.json()).then(response => {
  sampleJSON = response;
  const select = document.getElementById("selDataset");
  //
  //filling the select dropdown with the individuals ids
  sampleJSON.samples.map((sample, index) => {
    var opt = document.createElement("option");
    opt.value = index;
    opt.innerHTML = sample.id;
    //added here
    select.appendChild(opt);
  })
  //populates panel data and fills in changed chart data
  fillChartData(sampleJSON.samples[0],sampleJSON.metadata[0].wfreq);
  fillInformation(sampleJSON.metadata[0]);
}).catch(err => {
  console.log(err);
});

//Change the selected individual and re-drawing the charts and information panel
function optionChanged(value){
  fillChartData(sampleJSON.samples[parseInt(value)],sampleJSON.metadata[parseInt(value)].wfreq);
  fillInformation(sampleJSON.metadata[parseInt(value)]);
}