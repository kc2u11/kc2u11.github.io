// Get the width and height of the container
const containerWidth = document.getElementById('chart-container1').clientWidth;
const containerHeight = document.getElementById('chart-container1').clientHeight;
const sideContainerWidth = document.getElementById('chart-info').clientWidth;

console.log(containerWidth, containerHeight, sideContainerWidth); 
// Create an SVG element within the container
const svg = d3.select("#chart-container1")
  .append("svg")
  .attr("width", containerWidth)
  .attr("height", containerHeight);

width = +svg.attr("width"),
height = +svg.attr("height"); 

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(150)
  .center([0,30])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
    data.set(d.code, +d.pop)
})]).then(function(loadData){
    let topo = loadData[0]

    let mouseOver = function(d) {
      console.log("On mouse over", d);
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
    }

    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
    }

    let handleClick = function (event, d) {
      // Access the GeoJSON feature (d) and its properties
      let countryName = d.properties.name; // Assuming the country name is stored in the 'name' property
      console.log("Clicked Country:", countryName);
      console.log("code:", d.id);
      console.log("code:", d.total);
      console.log(d); 
      console.log(d.geometry.coordinates[0][0][0][0], d.geometry.coordinates[0][0][0][1]); 
      console.log(event.clientX, event.clientY, event.clientWidth, event.clientHeight);

      // Remove previous annotations
      svg.selectAll('.annotation-group').remove();


      // Add the annotation on the clicked country
      const annotation = d3.annotation()
      .type(d3.annotationCallout)
      .annotations([
        {
          note: {
            label: 'Population: '+d.total.toLocaleString() + ', GDP per capita: '+getGdpPerCapita(countryName),
            bgPadding: 20,
            title: countryName, 
            wrap: 200
          },
          connector: {
            end: "dot" // 'arrow' also available
          },
          data: { population: d.total, code: d.id },
          className: "show-bg",
          x: event.clientX-sideContainerWidth,
          y: event.clientY,
          dx: 50, 
          dy: 50
        },
      ]);

      svg.append('g')
        .attr('class', 'annotation-group')
        .call(annotation);

      updateTable(countryName);
    }

    // Draw the map
    svg.append("g")
      .attr("id", "world-map")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        .attr("id", d => 'path-'+ d.properties.name)
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.id) || 0;
          return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
        .on("click", handleClick)
        //.on("click", function(d) { console.log(data.get(d) ); })
        ; // Add the onclick event handler

  }); 

  function getGdpPerCapita(countryName) {
    for (let entry of data4) {
        if (entry["Country"] === countryName) {
          if (entry["GDP per capita"] != null) {
            return entry["GDP per capita"].toLocaleString();
          }
        }
    }
    return null;  // Return null if the country is not found in the JSON array
  }

  // Sample input data for the function
  const metrics = ['Life Expectancy', 'Care System Score', 'Death Rate', 'Depression Rate', 'Health Score', 'Cardiovascular deaths'];

  const data4 = [
    {
      "Country": "Afghanistan",
      "Life Expectancy": 61.98,
      "Care System Score": 22.4,
      "Death Rate": 6.16,
      "Depression Rate": 3.96,
      "Health Score": 51,
      "GDP per capita": ""
    },
    {
      "Country": "Albania",
      "Life Expectancy": 76.46,
      "Care System Score": 52.4,
      "Death Rate": 8.26,
      "Depression Rate": 3.05,
      "Health Score": 73.8,
      "GDP per capita": 6494
    },
    {
      "Country": "Algeria",
      "Life Expectancy": 76.38,
      "Care System Score": 51.3,
      "Death Rate": 4.72,
      "Depression Rate": 4.42,
      "Health Score": 72.5,
      "GDP per capita": 3765
    },
    {
      "Country": "Angola",
      "Life Expectancy": 61.64,
      "Care System Score": 27.5,
      "Death Rate": 7.8,
      "Depression Rate": 4.27,
      "Health Score": 50.3,
      "GDP per capita": 2138
    },
    {
      "Country": "Antarctica",
      "Life Expectancy": 78.5,
      "Care System Score": 73.4,
      "Death Rate": 6.48,
      "Depression Rate": 3.57,
      "Health Score": "",
      "GDP per capita": 14901
    },
    {
      "Country": "Argentina",
      "Life Expectancy": 75.39,
      "Care System Score": 73.4,
      "Death Rate": 7.6,
      "Depression Rate": 2.72,
      "Health Score": 77.2,
      "GDP per capita": 10729
    },
    {
      "Country": "Armenia",
      "Life Expectancy": 72.04,
      "Care System Score": 64.5,
      "Death Rate": 9.8,
      "Depression Rate": 3.67,
      "Health Score": 74.5,
      "GDP per capita": 4670
    },
    {
      "Country": "Australia",
      "Life Expectancy": 83.3,
      "Care System Score": 75.2,
      "Death Rate": 6.3,
      "Depression Rate": 5.05,
      "Health Score": 80.2,
      "GDP per capita": 59934
    },
    {
      "Country": "Austria",
      "Life Expectancy": 81.24,
      "Care System Score": 77.1,
      "Death Rate": 10.3,
      "Depression Rate": 3.95,
      "Health Score": 79.6,
      "GDP per capita": 53268
    },
    {
      "Country": "Azerbaijan",
      "Life Expectancy": 69.37,
      "Care System Score": 56.4,
      "Death Rate": 7.5,
      "Depression Rate": 3.13,
      "Health Score": 73.4,
      "GDP per capita": 5384
    },
    {
      "Country": "Bangladesh",
      "Life Expectancy": 72.38,
      "Care System Score": 39.2,
      "Death Rate": 5.52,
      "Depression Rate": 4.67,
      "Health Score": 69,
      "GDP per capita": 2503
    },
    {
      "Country": "Belarus",
      "Life Expectancy": 72.37,
      "Care System Score": 73.6,
      "Death Rate": 13,
      "Depression Rate": 5.04,
      "Health Score": 75.3,
      "GDP per capita": 7304
    },
    {
      "Country": "Belgium",
      "Life Expectancy": 81.89,
      "Care System Score": 83.8,
      "Death Rate": 11,
      "Depression Rate": 4.36,
      "Health Score": 80.6,
      "GDP per capita": 51768
    },
    {
      "Country": "Belize",
      "Life Expectancy": 70.47,
      "Care System Score": 49.9,
      "Death Rate": 4.8,
      "Depression Rate": 3.32,
      "Health Score": 72.4,
      "GDP per capita": 4420
    },
    {
      "Country": "Benin",
      "Life Expectancy": 59.82,
      "Care System Score": 40.9,
      "Death Rate": 8.57,
      "Depression Rate": 3.15,
      "Health Score": 56.7,
      "GDP per capita": 1428
    },
    {
      "Country": "Bhutan",
      "Life Expectancy": 71.82,
      "Care System Score": "",
      "Death Rate": 6.26,
      "Depression Rate": 4.06,
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Bolivia",
      "Life Expectancy": 63.63,
      "Care System Score": 37.5,
      "Death Rate": 6.76,
      "Depression Rate": 3.26,
      "Health Score": 65.9,
      "GDP per capita": 3415
    },
    {
      "Country": "Bosnia and Herzegovina",
      "Life Expectancy": 75.3,
      "Care System Score": 51.7,
      "Death Rate": 11.05,
      "Depression Rate": 3.67,
      "Health Score": 70,
      "GDP per capita": 6916
    },
    {
      "Country": "Botswana",
      "Life Expectancy": 61.14,
      "Care System Score": 54.5,
      "Death Rate": 5.72,
      "Depression Rate": 4.16,
      "Health Score": 59.5,
      "GDP per capita": 7348
    },
    {
      "Country": "Brazil",
      "Life Expectancy": 72.75,
      "Care System Score": 59.9,
      "Death Rate": 6.61,
      "Depression Rate": 4.29,
      "Health Score": 72,
      "GDP per capita": 7519
    },
    {
      "Country": "Brunei",
      "Life Expectancy": 74.64,
      "Care System Score": "",
      "Death Rate": 4.66,
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": 31723
    },
    {
      "Country": "Bulgaria",
      "Life Expectancy": 71.51,
      "Care System Score": 65.2,
      "Death Rate": 18,
      "Depression Rate": 3.73,
      "Health Score": 74.7,
      "GDP per capita": 11635
    },
    {
      "Country": "Burkina Faso",
      "Life Expectancy": 59.27,
      "Care System Score": 36.9,
      "Death Rate": 7.71,
      "Depression Rate": 3.07,
      "Health Score": 59.1,
      "GDP per capita": 918
    },
    {
      "Country": "Burundi",
      "Life Expectancy": 61.66,
      "Care System Score": 45.2,
      "Death Rate": 7.61,
      "Depression Rate": 3.39,
      "Health Score": 57.8,
      "GDP per capita": 237
    },
    {
      "Country": "Cambodia",
      "Life Expectancy": 69.58,
      "Care System Score": 51.9,
      "Death Rate": 6,
      "Depression Rate": 2.89,
      "Health Score": 71.2,
      "GDP per capita": 1591
    },
    {
      "Country": "Cameroon",
      "Life Expectancy": 60.33,
      "Care System Score": 33.9,
      "Death Rate": 8.88,
      "Depression Rate": 3.54,
      "Health Score": 50.7,
      "GDP per capita": 1662
    },
    {
      "Country": "Canada",
      "Life Expectancy": 82.6,
      "Care System Score": 71.3,
      "Death Rate": 8.1,
      "Depression Rate": 3.74,
      "Health Score": 78.4,
      "GDP per capita": 52051
    },
    {
      "Country": "Central African Republic",
      "Life Expectancy": 53.9,
      "Care System Score": 21.4,
      "Death Rate": 11.72,
      "Depression Rate": 4.67,
      "Health Score": 32.8,
      "GDP per capita": 511
    },
    {
      "Country": "Chad",
      "Life Expectancy": 52.53,
      "Care System Score": 22.6,
      "Death Rate": 11.72,
      "Depression Rate": 3.29,
      "Health Score": 37.7,
      "GDP per capita": 696
    },
    {
      "Country": "Chile",
      "Life Expectancy": 78.94,
      "Care System Score": 64.9,
      "Death Rate": 6.35,
      "Depression Rate": 4.28,
      "Health Score": 75.7,
      "GDP per capita": 16503
    },
    {
      "Country": "China",
      "Life Expectancy": 70.26,
      "Care System Score": 64.8,
      "Death Rate": 7.07,
      "Depression Rate": 3.67,
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Colombia",
      "Life Expectancy": 72.83,
      "Care System Score": 62.2,
      "Death Rate": 5.71,
      "Depression Rate": 2.51,
      "Health Score": 78.7,
      "GDP per capita": 6131
    },
    {
      "Country": "Costa Rica",
      "Life Expectancy": 77.02,
      "Care System Score": 59.6,
      "Death Rate": 5.23,
      "Depression Rate": 3.69,
      "Health Score": 78.4,
      "GDP per capita": 12509
    },
    {
      "Country": "Croatia",
      "Life Expectancy": 76.42,
      "Care System Score": 71.8,
      "Death Rate": 14.1,
      "Depression Rate": 4.13,
      "Health Score": 76.1,
      "GDP per capita": 17399
    },
    {
      "Country": "Cuba",
      "Life Expectancy": 73.68,
      "Care System Score": 77.6,
      "Death Rate": 9.3,
      "Depression Rate": 4.95,
      "Health Score": 79,
      "GDP per capita": ""
    },
    {
      "Country": "Cyprus",
      "Life Expectancy": 81.2,
      "Care System Score": 64.5,
      "Death Rate": 7.18,
      "Depression Rate": 3.81,
      "Health Score": 79.1,
      "GDP per capita": 30798
    },
    {
      "Country": "Czech Republic",
      "Life Expectancy": 77.37,
      "Care System Score": 76.8,
      "Death Rate": 12.1,
      "Depression Rate": 3.84,
      "Health Score": 79,
      "GDP per capita": 26378
    },
    {
      "Country": "Democratic Republic of the Congo",
      "Life Expectancy": 59.19,
      "Care System Score": 34.9,
      "Death Rate": 9.12,
      "Depression Rate": 4.21,
      "Health Score": 48.6,
      "GDP per capita": 584
    },
    {
      "Country": "Denmark",
      "Life Expectancy": 81.4,
      "Care System Score": 79.1,
      "Death Rate": 9.4,
      "Depression Rate": 4.41,
      "Health Score": 80.6,
      "GDP per capita": 67803
    },
    {
      "Country": "Djibouti",
      "Life Expectancy": 62.31,
      "Care System Score": 40.5,
      "Death Rate": 6.92,
      "Depression Rate": 4.01,
      "Health Score": 62.4,
      "GDP per capita": 3364
    },
    {
      "Country": "Dominican Republic",
      "Life Expectancy": 72.62,
      "Care System Score": 49.5,
      "Death Rate": 6.23,
      "Depression Rate": 3.95,
      "Health Score": 72.1,
      "GDP per capita": 8604
    },
    {
      "Country": "East Timor",
      "Life Expectancy": 67.74,
      "Care System Score": "",
      "Death Rate": 5.89,
      "Depression Rate": 2.41,
      "Health Score": "",
      "GDP per capita": 1458
    },
    {
      "Country": "Ecuador",
      "Life Expectancy": 73.67,
      "Care System Score": 46.4,
      "Death Rate": 5.14,
      "Depression Rate": 3.46,
      "Health Score": 72.9,
      "GDP per capita": 5935
    },
    {
      "Country": "Egypt",
      "Life Expectancy": 70.22,
      "Care System Score": 39.6,
      "Death Rate": 5.75,
      "Depression Rate": 3.87,
      "Health Score": 67.2,
      "GDP per capita": 3876
    },
    {
      "Country": "El Salvador",
      "Life Expectancy": 70.75,
      "Care System Score": 49.3,
      "Death Rate": 7.1,
      "Depression Rate": 3.61,
      "Health Score": 69.7,
      "GDP per capita": 4409
    },
    {
      "Country": "England",
      "Life Expectancy": 80.7,
      "Care System Score": 77.7,
      "Death Rate": 10.4,
      "Depression Rate": 5.02,
      "Health Score": 78.8,
      "GDP per capita": 47334
    },
    {
      "Country": "Equatorial Guinea",
      "Life Expectancy": 60.59,
      "Care System Score": 40.6,
      "Death Rate": 8.91,
      "Depression Rate": 4.63,
      "Health Score": 50.5,
      "GDP per capita": 8462
    },
    {
      "Country": "Eritrea",
      "Life Expectancy": 66.54,
      "Care System Score": 26.5,
      "Death Rate": 6.87,
      "Depression Rate": 3.85,
      "Health Score": 57.5,
      "GDP per capita": ""
    },
    {
      "Country": "Estonia",
      "Life Expectancy": 76.74,
      "Care System Score": 72.2,
      "Death Rate": 11.9,
      "Depression Rate": 5.09,
      "Health Score": 77.3,
      "GDP per capita": 27281
    },
    {
      "Country": "Ethiopia",
      "Life Expectancy": 57.07,
      "Care System Score": 30.3,
      "Death Rate": 6.29,
      "Depression Rate": 3.41,
      "Health Score": 59.8,
      "GDP per capita": 944
    },
    {
      "Country": "Falkland Islands",
      "Life Expectancy": "",
      "Care System Score": "",
      "Death Rate": 7,
      "Depression Rate": 2.87,
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Fiji",
      "Life Expectancy": 70.71,
      "Care System Score": "",
      "Death Rate": 8.33,
      "Depression Rate": 3.01,
      "Health Score": "",
      "GDP per capita": 5086
    },
    {
      "Country": "Finland",
      "Life Expectancy": 67.11,
      "Care System Score": 80.9,
      "Death Rate": 10,
      "Depression Rate": 5,
      "Health Score": 81.4,
      "GDP per capita": 53983
    },
    {
      "Country": "France",
      "Life Expectancy": 81.93,
      "Care System Score": 80.4,
      "Death Rate": 9.9,
      "Depression Rate": 4.74,
      "Health Score": 80.5,
      "GDP per capita": 43519
    },
    {
      "Country": "French Southern and Antarctic Lands",
      "Life Expectancy": "",
      "Care System Score": "",
      "Death Rate": "",
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Gabon",
      "Life Expectancy": 82.32,
      "Care System Score": 45,
      "Death Rate": 6.6,
      "Depression Rate": 5.12,
      "Health Score": 56.8,
      "GDP per capita": 8017
    },
    {
      "Country": "Gambia",
      "Life Expectancy": "",
      "Care System Score": "",
      "Death Rate": "",
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Georgia",
      "Life Expectancy": 65.82,
      "Care System Score": 58,
      "Death Rate": 12.75,
      "Depression Rate": 4.26,
      "Health Score": 71.3,
      "GDP per capita": 5042
    },
    {
      "Country": "Germany",
      "Life Expectancy": 71.69,
      "Care System Score": 81.1,
      "Death Rate": 11.9,
      "Depression Rate": 4.32,
      "Health Score": 81.1,
      "GDP per capita": 50802
    },
    {
      "Country": "Ghana",
      "Life Expectancy": 80.9,
      "Care System Score": 43.4,
      "Death Rate": 7.15,
      "Depression Rate": 3.71,
      "Health Score": 64.2,
      "GDP per capita": 2445
    },
    {
      "Country": "Greece",
      "Life Expectancy": 63.8,
      "Care System Score": 64.9,
      "Death Rate": 12.2,
      "Depression Rate": 6.52,
      "Health Score": 76.8,
      "GDP per capita": 20277
    },
    {
      "Country": "Greenland",
      "Life Expectancy": "",
      "Care System Score": "",
      "Death Rate": 9.59,
      "Depression Rate": 3.68,
      "Health Score": "",
      "GDP per capita": 9929
    },
    {
      "Country": "Guatemala",
      "Life Expectancy": 76.66,
      "Care System Score": 40.2,
      "Death Rate": 4.71,
      "Depression Rate": 3.41,
      "Health Score": 68.2,
      "GDP per capita": 5026
    },
    {
      "Country": "Guinea",
      "Life Expectancy": 69.24,
      "Care System Score": 30.6,
      "Death Rate": 8.03,
      "Depression Rate": 3.16,
      "Health Score": 50.4,
      "GDP per capita": 1174
    },
    {
      "Country": "Guinea Bissau",
      "Life Expectancy": 58.89,
      "Care System Score": 28.8,
      "Death Rate": 9.27,
      "Depression Rate": 3.38,
      "Health Score": 51.2,
      "GDP per capita": 813
    },
    {
      "Country": "Guyana",
      "Life Expectancy": 59.65,
      "Care System Score": 54.6,
      "Death Rate": 7.65,
      "Depression Rate": 5.15,
      "Health Score": 62.9,
      "GDP per capita": 9375
    },
    {
      "Country": "Haiti",
      "Life Expectancy": 65.67,
      "Care System Score": 27,
      "Death Rate": 8.38,
      "Depression Rate": 3.33,
      "Health Score": 52.7,
      "GDP per capita": 1815
    },
    {
      "Country": "Honduras",
      "Life Expectancy": 63.19,
      "Care System Score": 36.6,
      "Death Rate": 4.47,
      "Depression Rate": 2.86,
      "Health Score": 68.7,
      "GDP per capita": 2831
    },
    {
      "Country": "Hong Kong",
      "Life Expectancy": 70.12,
      "Care System Score": 76.7,
      "Death Rate": 6.8,
      "Depression Rate": "",
      "Health Score": 81.3,
      "GDP per capita": 49661
    },
    {
      "Country": "Hungary",
      "Life Expectancy": 85.49,
      "Care System Score": 69.4,
      "Death Rate": 14.5,
      "Depression Rate": 3.89,
      "Health Score": 76.3,
      "GDP per capita": 18773
    },
    {
      "Country": "Iceland",
      "Life Expectancy": 74.47,
      "Care System Score": 81.1,
      "Death Rate": 6.3,
      "Depression Rate": 3.52,
      "Health Score": 82.3,
      "GDP per capita": 68384
    },
    {
      "Country": "India",
      "Life Expectancy": 83.12,
      "Care System Score": 43.6,
      "Death Rate": 7.3,
      "Depression Rate": 3.69,
      "Health Score": 67.1,
      "GDP per capita": 2277
    },
    {
      "Country": "Indonesia",
      "Life Expectancy": 67.24,
      "Care System Score": 53.1,
      "Death Rate": 6.57,
      "Depression Rate": 2.63,
      "Health Score": 72.7,
      "GDP per capita": 4292
    },
    {
      "Country": "Iran",
      "Life Expectancy": 67.57,
      "Care System Score": 51.2,
      "Death Rate": 4.84,
      "Depression Rate": 5.48,
      "Health Score": 74.8,
      "GDP per capita": ""
    },
    {
      "Country": "Iraq",
      "Life Expectancy": 73.88,
      "Care System Score": 42.2,
      "Death Rate": 4.71,
      "Depression Rate": 3.89,
      "Health Score": 65.5,
      "GDP per capita": 5048
    },
    {
      "Country": "Ireland",
      "Life Expectancy": 70.38,
      "Care System Score": 77.1,
      "Death Rate": 6.4,
      "Depression Rate": 4.99,
      "Health Score": 79.5,
      "GDP per capita": 99152
    },
    {
      "Country": "Israel",
      "Life Expectancy": 80.53,
      "Care System Score": 73.8,
      "Death Rate": 5.3,
      "Depression Rate": 4.55,
      "Health Score": 82.8,
      "GDP per capita": 51430
    },
    {
      "Country": "Italy",
      "Life Expectancy": 82.5,
      "Care System Score": 74.5,
      "Death Rate": 12.6,
      "Depression Rate": 4.62,
      "Health Score": 81.1,
      "GDP per capita": 35551
    },
    {
      "Country": "Ivory Coast",
      "Life Expectancy": 82.8,
      "Care System Score": 37.2,
      "Death Rate": 9.71,
      "Depression Rate": 3.05,
      "Health Score": 53.5,
      "GDP per capita": 2579
    },
    {
      "Country": "Jamaica",
      "Life Expectancy": 58.6,
      "Care System Score": 48.4,
      "Death Rate": 7.61,
      "Depression Rate": 3.44,
      "Health Score": 74.9,
      "GDP per capita": 4587
    },
    {
      "Country": "Japan",
      "Life Expectancy": 70.5,
      "Care System Score": 83.2,
      "Death Rate": 11.1,
      "Depression Rate": 2.66,
      "Health Score": 86.6,
      "GDP per capita": 39285
    },
    {
      "Country": "Jordan",
      "Life Expectancy": 84.45,
      "Care System Score": 58.1,
      "Death Rate": 3.92,
      "Depression Rate": 4.19,
      "Health Score": 72.9,
      "GDP per capita": 4406
    },
    {
      "Country": "Kazakhstan",
      "Life Expectancy": 74.26,
      "Care System Score": 64.6,
      "Death Rate": 8.6,
      "Depression Rate": 3.72,
      "Health Score": 73.8,
      "GDP per capita": 10041
    },
    {
      "Country": "Kenya",
      "Life Expectancy": 70.23,
      "Care System Score": 40.5,
      "Death Rate": 5.35,
      "Depression Rate": 3.82,
      "Health Score": 64.6,
      "GDP per capita": 2007
    },
    {
      "Country": "Kosovo",
      "Life Expectancy": 67.42,
      "Care System Score": "",
      "Death Rate": "",
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Kuwait",
      "Life Expectancy": 76.81,
      "Care System Score": 63.6,
      "Death Rate": 2.92,
      "Depression Rate": 4.9,
      "Health Score": 76.9,
      "GDP per capita": ""
    },
    {
      "Country": "Kyrgyzstan",
      "Life Expectancy": 78.67,
      "Care System Score": 59.6,
      "Death Rate": 6.1,
      "Depression Rate": 3.31,
      "Health Score": 73.4,
      "GDP per capita": 1276
    },
    {
      "Country": "Laos",
      "Life Expectancy": 71.9,
      "Care System Score": 42.2,
      "Death Rate": 6.32,
      "Depression Rate": 2.67,
      "Health Score": 64.6,
      "GDP per capita": 2551
    },
    {
      "Country": "Latvia",
      "Life Expectancy": 68.06,
      "Care System Score": 68.5,
      "Death Rate": 15.2,
      "Depression Rate": 5.16,
      "Health Score": 73.8,
      "GDP per capita": 20642
    },
    {
      "Country": "Lebanon",
      "Life Expectancy": 73.28,
      "Care System Score": 56,
      "Death Rate": 4.57,
      "Depression Rate": 5.06,
      "Health Score": 69.7,
      "GDP per capita": 2670
    },
    {
      "Country": "Lesotho",
      "Life Expectancy": 75.05,
      "Care System Score": 40,
      "Death Rate": 13.69,
      "Depression Rate": 5.17,
      "Health Score": 40.7,
      "GDP per capita": 1166
    },
    {
      "Country": "Liberia",
      "Life Expectancy": 53.06,
      "Care System Score": 24.2,
      "Death Rate": 7.26,
      "Depression Rate": 3.62,
      "Health Score": 49.1,
      "GDP per capita": 673
    },
    {
      "Country": "Libya",
      "Life Expectancy": 60.75,
      "Care System Score": 54.3,
      "Death Rate": 5.12,
      "Depression Rate": 5.01,
      "Health Score": 67.5,
      "GDP per capita": 6018
    },
    {
      "Country": "Lithuania",
      "Life Expectancy": 84.4,
      "Care System Score": 68.2,
      "Death Rate": 15.6,
      "Depression Rate": 5.42,
      "Health Score": 74.1,
      "GDP per capita": 23433
    },
    {
      "Country": "Luxembourg",
      "Life Expectancy": 74.34,
      "Care System Score": 77.6,
      "Death Rate": 7.3,
      "Depression Rate": 4.02,
      "Health Score": 81.5,
      "GDP per capita": 135683
    },
    {
      "Country": "Macedonia",
      "Life Expectancy": 82.75,
      "Care System Score": "",
      "Death Rate": "",
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": 45422
    },
    {
      "Country": "Madagascar",
      "Life Expectancy": 85.4,
      "Care System Score": 19.7,
      "Death Rate": 5.82,
      "Depression Rate": 3.7,
      "Health Score": 55.5,
      "GDP per capita": 515
    },
    {
      "Country": "Malawi",
      "Life Expectancy": 64.49,
      "Care System Score": 44,
      "Death Rate": 6.26,
      "Depression Rate": 3.1,
      "Health Score": 60.5,
      "GDP per capita": 643
    },
    {
      "Country": "Malaysia",
      "Life Expectancy": 62.9,
      "Care System Score": 61.2,
      "Death Rate": 5.25,
      "Depression Rate": 3.99,
      "Health Score": 77,
      "GDP per capita": 11371
    },
    {
      "Country": "Mali",
      "Life Expectancy": 79.92,
      "Care System Score": 28.6,
      "Death Rate": 9.16,
      "Depression Rate": 2.46,
      "Health Score": 54.4,
      "GDP per capita": 918
    },
    {
      "Country": "Mauritania",
      "Life Expectancy": 65.27,
      "Care System Score": 31.1,
      "Death Rate": 7.03,
      "Depression Rate": 2.94,
      "Health Score": 58,
      "GDP per capita": 1723
    },
    {
      "Country": "Mexico",
      "Life Expectancy": 73.68,
      "Care System Score": 56.5,
      "Death Rate": 6.15,
      "Depression Rate": 3.87,
      "Health Score": 72.7,
      "GDP per capita": 9926
    },
    {
      "Country": "Moldova",
      "Life Expectancy": 70.21,
      "Care System Score": 57.2,
      "Death Rate": 11.78,
      "Depression Rate": 4.25,
      "Health Score": 72.3,
      "GDP per capita": 5315
    },
    {
      "Country": "Mongolia",
      "Life Expectancy": 68.85,
      "Care System Score": 49.5,
      "Death Rate": 6.35,
      "Depression Rate": 4.07,
      "Health Score": 67.7,
      "GDP per capita": 4535
    },
    {
      "Country": "Montenegro",
      "Life Expectancy": 70.98,
      "Care System Score": 61.7,
      "Death Rate": 11.7,
      "Depression Rate": 3.59,
      "Health Score": 70.6,
      "GDP per capita": 9367
    },
    {
      "Country": "Morocco",
      "Life Expectancy": 73.82,
      "Care System Score": 44.5,
      "Death Rate": 5.06,
      "Depression Rate": 5.49,
      "Health Score": 71.7,
      "GDP per capita": 3497
    },
    {
      "Country": "Mozambique",
      "Life Expectancy": 74.04,
      "Care System Score": 45.7,
      "Death Rate": 7.95,
      "Depression Rate": 3.47,
      "Health Score": 53.1,
      "GDP per capita": 500
    },
    {
      "Country": "Myanmar",
      "Life Expectancy": 59.33,
      "Care System Score": 45.3,
      "Death Rate": 8.25,
      "Depression Rate": 2.28,
      "Health Score": 67.7,
      "GDP per capita": 1187
    },
    {
      "Country": "Namibia",
      "Life Expectancy": 65.67,
      "Care System Score": 49.2,
      "Death Rate": 7.73,
      "Depression Rate": 3.26,
      "Health Score": 59.9,
      "GDP per capita": 4729
    },
    {
      "Country": "Nepal",
      "Life Expectancy": 63.62,
      "Care System Score": 34.8,
      "Death Rate": 6.29,
      "Depression Rate": 4.64,
      "Health Score": 64.1,
      "GDP per capita": 1223
    },
    {
      "Country": "Netherlands",
      "Life Expectancy": 68.45,
      "Care System Score": 77.3,
      "Death Rate": 9.7,
      "Depression Rate": 4.41,
      "Health Score": 82.2,
      "GDP per capita": 58061
    },
    {
      "Country": "New Caledonia",
      "Life Expectancy": 81.46,
      "Care System Score": "",
      "Death Rate": 5.92,
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "New Zealand",
      "Life Expectancy": 79.13,
      "Care System Score": 73.4,
      "Death Rate": 6.41,
      "Depression Rate": 4.08,
      "Health Score": 79.7,
      "GDP per capita": 48802
    },
    {
      "Country": "Nicaragua",
      "Life Expectancy": 82.21,
      "Care System Score": 47.3,
      "Death Rate": 5.09,
      "Depression Rate": 3.27,
      "Health Score": 73,
      "GDP per capita": 2091
    },
    {
      "Country": "Niger",
      "Life Expectancy": 73.84,
      "Care System Score": 29.3,
      "Death Rate": 7.82,
      "Depression Rate": 2.65,
      "Health Score": 54.1,
      "GDP per capita": 595
    },
    {
      "Country": "Nigeria",
      "Life Expectancy": 61.58,
      "Care System Score": 28.9,
      "Death Rate": 11.42,
      "Depression Rate": 2.76,
      "Health Score": 49.1,
      "GDP per capita": 2085
    },
    {
      "Country": "North Korea",
      "Life Expectancy": 52.68,
      "Care System Score": "",
      "Death Rate": 9.32,
      "Depression Rate": 3.3,
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Northern Cyprus",
      "Life Expectancy": "",
      "Care System Score": "",
      "Death Rate": "",
      "Depression Rate": 3.45,
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Norway",
      "Life Expectancy": 73.28,
      "Care System Score": 82.2,
      "Death Rate": 7.5,
      "Depression Rate": 3.85,
      "Health Score": 84,
      "GDP per capita": 89203
    },
    {
      "Country": "Oman",
      "Life Expectancy": 83.16,
      "Care System Score": 62.1,
      "Death Rate": 2.42,
      "Depression Rate": 4.33,
      "Health Score": 75.2,
      "GDP per capita": 16439
    },
    {
      "Country": "Pakistan",
      "Life Expectancy": 72.54,
      "Care System Score": 29.7,
      "Death Rate": 6.84,
      "Depression Rate": 3.23,
      "Health Score": 59.5,
      "GDP per capita": 1538
    },
    {
      "Country": "Panama",
      "Life Expectancy": 66.1,
      "Care System Score": 51,
      "Death Rate": 5.14,
      "Depression Rate": 3.15,
      "Health Score": 76.5,
      "GDP per capita": 14516
    },
    {
      "Country": "Papua New Guinea",
      "Life Expectancy": 76.22,
      "Care System Score": 38.4,
      "Death Rate": 7.3,
      "Depression Rate": 2.7,
      "Health Score": 54.2,
      "GDP per capita": 2916
    },
    {
      "Country": "Paraguay",
      "Life Expectancy": 65.35,
      "Care System Score": 45,
      "Death Rate": 5.59,
      "Depression Rate": 3.88,
      "Health Score": 71.4,
      "GDP per capita": 5400
    },
    {
      "Country": "Peru",
      "Life Expectancy": 78.21,
      "Care System Score": 48.6,
      "Death Rate": 5.66,
      "Depression Rate": 2.36,
      "Health Score": 76.4,
      "GDP per capita": 6692
    },
    {
      "Country": "Philippines",
      "Life Expectancy": 72.38,
      "Care System Score": 52.6,
      "Death Rate": 5.98,
      "Depression Rate": 2.69,
      "Health Score": 69.7,
      "GDP per capita": 3549
    },
    {
      "Country": "Poland",
      "Life Expectancy": 69.27,
      "Care System Score": 58.4,
      "Death Rate": 12.6,
      "Depression Rate": 2.98,
      "Health Score": 75.2,
      "GDP per capita": 17841
    },
    {
      "Country": "Portugal",
      "Life Expectancy": 75.6,
      "Care System Score": 67.8,
      "Death Rate": 12,
      "Depression Rate": 5.88,
      "Health Score": 77.6,
      "GDP per capita": 24262
    },
    {
      "Country": "Puerto Rico",
      "Life Expectancy": 81.07,
      "Care System Score": "",
      "Death Rate": 9.6,
      "Depression Rate": 3.67,
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Qatar",
      "Life Expectancy": 80.16,
      "Care System Score": 66,
      "Death Rate": 1.29,
      "Depression Rate": 4.92,
      "Health Score": 77.6,
      "GDP per capita": 61276
    },
    {
      "Country": "Republic of Serbia",
      "Life Expectancy": "",
      "Care System Score": "",
      "Death Rate": 12.4,
      "Depression Rate": 3.3,
      "Health Score": 73.9,
      "GDP per capita": 6721
    },
    {
      "Country": "Republic of the Congo",
      "Life Expectancy": 79.27,
      "Care System Score": 36.6,
      "Death Rate": 6.55,
      "Depression Rate": 4.81,
      "Health Score": 54.8,
      "GDP per capita": 2214
    },
    {
      "Country": "Romania",
      "Life Expectancy": 63.52,
      "Care System Score": 67.4,
      "Death Rate": 15.4,
      "Depression Rate": 3.51,
      "Health Score": 74.7,
      "GDP per capita": 14862
    },
    {
      "Country": "Russia",
      "Life Expectancy": 72.96,
      "Care System Score": 65.5,
      "Death Rate": 14.6,
      "Depression Rate": 3.91,
      "Health Score": 71.6,
      "GDP per capita": 12173
    },
    {
      "Country": "Rwanda",
      "Life Expectancy": 69.36,
      "Care System Score": 58.2,
      "Death Rate": 5.05,
      "Depression Rate": 4.2,
      "Health Score": 65.2,
      "GDP per capita": 834
    },
    {
      "Country": "Saudi Arabia",
      "Life Expectancy": 72.77,
      "Care System Score": 57.7,
      "Death Rate": 3.55,
      "Depression Rate": 4.9,
      "Health Score": 74.5,
      "GDP per capita": 23586
    },
    {
      "Country": "Senegal",
      "Life Expectancy": 76.94,
      "Care System Score": 37.1,
      "Death Rate": 5.48,
      "Depression Rate": 3.15,
      "Health Score": 63.4,
      "GDP per capita": 1606
    },
    {
      "Country": "Sierra Leone",
      "Life Expectancy": 73.4,
      "Care System Score": 39.1,
      "Death Rate": 11.3,
      "Depression Rate": 3.39,
      "Health Score": 48.4,
      "GDP per capita": 516
    },
    {
      "Country": "Slovakia",
      "Life Expectancy": 83.44,
      "Care System Score": 65.8,
      "Death Rate": 10.8,
      "Depression Rate": 3.56,
      "Health Score": 77,
      "GDP per capita": 21088
    },
    {
      "Country": "Slovenia",
      "Life Expectancy": 74.71,
      "Care System Score": 74.4,
      "Death Rate": 11.4,
      "Depression Rate": 4.28,
      "Health Score": 80.2,
      "GDP per capita": 29201
    },
    {
      "Country": "Solomon Islands",
      "Life Expectancy": 80.88,
      "Care System Score": "",
      "Death Rate": 4.22,
      "Depression Rate": 2.55,
      "Health Score": "",
      "GDP per capita": 2337
    },
    {
      "Country": "Somalia",
      "Life Expectancy": 70.35,
      "Care System Score": 18.5,
      "Death Rate": 10.5,
      "Depression Rate": 3.31,
      "Health Score": 43.3,
      "GDP per capita": 446
    },
    {
      "Country": "Somaliland",
      "Life Expectancy": "",
      "Care System Score": "",
      "Death Rate": "",
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "South Africa",
      "Life Expectancy": 55.28,
      "Care System Score": 54.9,
      "Death Rate": 9.38,
      "Depression Rate": 4.45,
      "Health Score": 56.6,
      "GDP per capita": 6994
    },
    {
      "Country": "South Korea",
      "Life Expectancy": 62.34,
      "Care System Score": 75.1,
      "Death Rate": 5.9,
      "Depression Rate": 2.64,
      "Health Score": 84.1,
      "GDP per capita": 34758
    },
    {
      "Country": "South Sudan",
      "Life Expectancy": 83.53,
      "Care System Score": 13.1,
      "Death Rate": 10.22,
      "Depression Rate": 3.48,
      "Health Score": 35.5,
      "GDP per capita": ""
    },
    {
      "Country": "Spain",
      "Life Expectancy": 54.98,
      "Care System Score": 72.6,
      "Death Rate": 10.4,
      "Depression Rate": 6.04,
      "Health Score": 80.5,
      "GDP per capita": 30116
    },
    {
      "Country": "Sri Lanka",
      "Life Expectancy": 83.18,
      "Care System Score": 56.2,
      "Death Rate": 6.85,
      "Depression Rate": 3.26,
      "Health Score": 77.3,
      "GDP per capita": 3815
    },
    {
      "Country": "Sudan",
      "Life Expectancy": 76.4,
      "Care System Score": 30.5,
      "Death Rate": 7.05,
      "Depression Rate": 4,
      "Health Score": 60.9,
      "GDP per capita": 764
    },
    {
      "Country": "Suriname",
      "Life Expectancy": 65.27,
      "Care System Score": 55.6,
      "Death Rate": 7.45,
      "Depression Rate": 5.1,
      "Health Score": 63.9,
      "GDP per capita": 4836
    },
    {
      "Country": "Swaziland",
      "Life Expectancy": "",
      "Care System Score": "",
      "Death Rate": "",
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Sweden",
      "Life Expectancy": 70.27,
      "Care System Score": 83.1,
      "Death Rate": 9.5,
      "Depression Rate": 4.98,
      "Health Score": 82.1,
      "GDP per capita": 60239
    },
    {
      "Country": "Switzerland",
      "Life Expectancy": 83.16,
      "Care System Score": 82.4,
      "Death Rate": 8.8,
      "Depression Rate": 4.72,
      "Health Score": 81.5,
      "GDP per capita": 93457
    },
    {
      "Country": "Syria",
      "Life Expectancy": "",
      "Care System Score": 50.1,
      "Death Rate": 4.83,
      "Depression Rate": 4.39,
      "Health Score": 67.1,
      "GDP per capita": ""
    },
    {
      "Country": "Taiwan",
      "Life Expectancy": "",
      "Care System Score": 76.3,
      "Death Rate": "",
      "Depression Rate": 3.59,
      "Health Score": 83.4,
      "GDP per capita": ""
    },
    {
      "Country": "Tajikistan",
      "Life Expectancy": 83.85,
      "Care System Score": 57,
      "Death Rate": 4.69,
      "Depression Rate": 2.6,
      "Health Score": 71.5,
      "GDP per capita": 897
    },
    {
      "Country": "Thailand",
      "Life Expectancy": 66.2,
      "Care System Score": 65.6,
      "Death Rate": 7.92,
      "Depression Rate": 3.7,
      "Health Score": 79.4,
      "GDP per capita": 7233
    },
    {
      "Country": "The Bahamas",
      "Life Expectancy": 78.72,
      "Care System Score": 40.3,
      "Death Rate": 6.93,
      "Depression Rate": 3.52,
      "Health Score": 56.1,
      "GDP per capita": 28239
    },
    {
      "Country": "Togo",
      "Life Expectancy": 62.08,
      "Care System Score": 33.9,
      "Death Rate": 8.2,
      "Depression Rate": 3.56,
      "Health Score": 54.9,
      "GDP per capita": 992
    },
    {
      "Country": "Trinidad and Tobago",
      "Life Expectancy": 70.99,
      "Care System Score": 61.6,
      "Death Rate": 8.64,
      "Depression Rate": 4.52,
      "Health Score": 74.1,
      "GDP per capita": 15243
    },
    {
      "Country": "Tunisia",
      "Life Expectancy": 72.97,
      "Care System Score": 47,
      "Death Rate": 6.26,
      "Depression Rate": 5.75,
      "Health Score": 71.4,
      "GDP per capita": 3924
    },
    {
      "Country": "Turkey",
      "Life Expectancy": "",
      "Care System Score": 53.8,
      "Death Rate": 5.48,
      "Depression Rate": 4.6,
      "Health Score": 75.1,
      "GDP per capita": 9587
    },
    {
      "Country": "Turkmenistan",
      "Life Expectancy": 73.77,
      "Care System Score": 62.1,
      "Death Rate": 7.04,
      "Depression Rate": 3.11,
      "Health Score": 74.9,
      "GDP per capita": 24047
    },
    {
      "Country": "Uganda",
      "Life Expectancy": 64.55,
      "Care System Score": 39.2,
      "Death Rate": 6.24,
      "Depression Rate": 4.48,
      "Health Score": 58.2,
      "GDP per capita": 858
    },
    {
      "Country": "Ukraine",
      "Life Expectancy": 62.71,
      "Care System Score": 59.2,
      "Death Rate": 15.9,
      "Depression Rate": 5.25,
      "Health Score": 68.7,
      "GDP per capita": 4836
    },
    {
      "Country": "United Arab Emirates",
      "Life Expectancy": 69.65,
      "Care System Score": 65.6,
      "Death Rate": 1.58,
      "Depression Rate": 4.63,
      "Health Score": 77.8,
      "GDP per capita": ""
    },
    {
      "Country": "United Republic of Tanzania",
      "Life Expectancy": 71.59,
      "Care System Score": "",
      "Death Rate": "",
      "Depression Rate": "",
      "Health Score": "",
      "GDP per capita": ""
    },
    {
      "Country": "Uruguay",
      "Life Expectancy": "",
      "Care System Score": 74.8,
      "Death Rate": "",
      "Depression Rate": "",
      "Health Score": 78.1,
      "GDP per capita": 17021
    },
    {
      "Country": "USA",
      "Life Expectancy": 76.33,
      "Care System Score": 72.7,
      "Death Rate": 10.3,
      "Depression Rate": 4.92,
      "Health Score": 73.9,
      "GDP per capita": 69288
    },
    {
      "Country": "Uzbekistan",
      "Life Expectancy": 70.86,
      "Care System Score": 65.2,
      "Death Rate": 5.1,
      "Depression Rate": 3.12,
      "Health Score": 76.3,
      "GDP per capita": ""
    },
    {
      "Country": "Vanuatu",
      "Life Expectancy": 70.45,
      "Care System Score": "",
      "Death Rate": 5.13,
      "Depression Rate": 2.63,
      "Health Score": "",
      "GDP per capita": 3127
    },
    {
      "Country": "Venezuela",
      "Life Expectancy": 70.55,
      "Care System Score": 46.6,
      "Death Rate": 7.22,
      "Depression Rate": 3.53,
      "Health Score": 70.5,
      "GDP per capita": ""
    },
    {
      "Country": "Vietnam",
      "Life Expectancy": 73.62,
      "Care System Score": 53.6,
      "Death Rate": 6.44,
      "Depression Rate": 2.83,
      "Health Score": 76.5,
      "GDP per capita": 3694
    },
    {
      "Country": "Yemen",
      "Life Expectancy": 63.75,
      "Care System Score": 28.8,
      "Death Rate": 5.98,
      "Depression Rate": 4.2,
      "Health Score": 57,
      "GDP per capita": 691
    },
    {
      "Country": "Zambia",
      "Life Expectancy": 61.22,
      "Care System Score": 41.7,
      "Death Rate": 6.22,
      "Depression Rate": 3.16,
      "Health Score": 59.8,
      "GDP per capita": 1121
    },
    {
      "Country": "Zimbabwe",
      "Life Expectancy": 59.25,
      "Care System Score": 43.1,
      "Death Rate": 7.69,
      "Depression Rate": 2.76,
      "Health Score": 54.8,
      "GDP per capita": 1737
    }
  ];
    
    

  //d3.json("path/to/your/data.json").then(data => {
    // Assuming your JSON data is an array of objects, similar to jsonData above

    // Create the dropdown menu using D3
    const dropdown = d3.select("#country-dropdown");

    // Populate the dropdown with options from the JSON data
    dropdown
      .selectAll("option")
      .data(data4)
      .enter()
      .append("option")
      .attr("value", d => d['Country'])
      .text(d => d['Country'])
      ;
  
  const tableBody = d3.select("#data-table tbody");    
  console.log("tableBOdy", tableBody);
  // Function to update the table based on the selected country
  function updateTable(selectedCountry) {
    // Filter the JSON data to get the data for the selected country
    const countryData = data4.find(d => d.Country === selectedCountry);
    //console.log(countryData, selectedCountry, Object.entries(countryData));
    // Update the table with the selected country data
    
    tableBody.selectAll("tr").remove();
    const rows = tableBody.selectAll("tr")
      .data(Object.entries(countryData).filter(d => d[0] != 'GDP per capita'))
      ;

    rows.exit().remove();

    const newRows = rows.enter().append("tr");

    // Append table cells for each property-value pair
    newRows.append("td").text(d => d[0]);
    newRows.append("td").text(d => d[1]);


    
  }

  // Initial update with the first country in the dropdown
  updateTable(data4[168].Country);

  // Add the annotation on the clicked country
  const annotationUSA = d3.annotation()
  .type(d3.annotationCallout)
  .annotations([
    {
      note: {
        label: 'Population: 299,846,449, GDP per capita: '+getGdpPerCapita(data4[168].Country),
        bgPadding: 20,
        title: data4[168].Country, 
        wrap: 200
      },
      connector: {
        end: "dot" // 'arrow' also available
      },
      className: "show-bg",
      x: sideContainerWidth+50,
      y: 350,
      dx: -50, 
      dy: 50
    },
  ]);

  svg.append('g')
    .attr('class', 'annotation-group')
    .call(annotationUSA);
  