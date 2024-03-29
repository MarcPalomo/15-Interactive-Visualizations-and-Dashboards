function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {
    console.log(response);

    var returnedData = response;
    
    // Use `.html("") to clear any existing metadata
    var panel = d3.select("#sample-metadata");

    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(returnedData).forEach(([key, value]) => {
          var newDiv = panel.append("div");
          newDiv.text(`${key}: ${value}`);
        });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(responses) {
    console.log(responses);

    var data = responses;
    // @TODO: Build a Bubble Chart using the sample data
    var bubble = [{
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
      },
    }];

    var layoutB = {
      title: "Belly Button Biodiversity Bubble Chart"
    };

    Plotly.newPlot("bubble", bubble, layoutB, {responsive: true});
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace = [{
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      type: "pie"
    }];
    
    var layout = {
      title: "Belly Button Biodiversity Pie Chart: Top 10"
    };

    Plotly.newPlot("pie", trace, layout, {responsive: true});
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
