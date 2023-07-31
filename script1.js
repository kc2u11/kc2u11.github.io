// Get the width and height of the container
const containerWidth = 1500;
const containerHeight = 768;

console.log(containerWidth + ' ' + containerHeight); 
// Create an SVG element within the container
const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", containerWidth)
  .attr("height", containerHeight);


const text = svg.append("text")
  .attr("class", "centered-text")
  .attr("x", containerWidth / 2)
  .attr("y", containerHeight / 15);

// Array of lines for the text
const lines = [
  "Although the United States spends more on healthcare than other developed countries,",
  "its’s health outcomes are not any better. The United States actually performs worse ", 
  "in some common health metrics like life expectancy, infant mortality, and unmanaged diabetes."
];

// Add each line of text using <tspan> elements
text.selectAll("tspan")
  .data(lines)
  .enter()
  .append("tspan")
  .attr("x", containerWidth / 2)
  .attr("dy", "2em") // Line height spacing (adjust as needed)
  .text((d) => d)
  .transition()
  .style("font-size", "30px").delay(100).duration(1000);

const data = [
  {
      "Country": "USA", 
      "Life Expectancy": 76.33,
      "Care System Score": 72.7,
      "Death Rate": 10.30,
      "Depression Rate": 4.92,
      "Health Score": 73.9,
      "Cardiovascular disease death": 157.01
  },
  {
      "Country": "Japan", 
      "Life Expectancy": 84.45,
      "Care System Score": 83.2,
      "Death Rate": 11.10,
      "Depression Rate": 2.66,
      "Health Score": 86.6,
      "Cardiovascular disease death": 77.01
  },
  {
      "Country": "Kenya", 
      "Life Expectancy": 61.43,
      "Care System Score": 40.5,
      "Death Rate": 5.35,
      "Depression Rate": 3.82,
      "Health Score": 64.6,
      "Cardiovascular disease death": 239.75
  },
  {
      "Country": "Peru",
      "Life Expectancy": 72.38,
      "Care System Score": 48.6,
      "Death Rate": 5.66,
      "Depression Rate": 2.36,
      "Health Score": 76.4,
      "Cardiovascular disease death": 88.61
  },
  {
      "Country": "Italy",  
      "Life Expectancy": 82.8,
      "Care System Score": 74.5,
      "Death Rate": 12.60,
      "Depression Rate": 4.62,
      "Health Score": 81.1,
      "Cardiovascular disease death": 126.09
  },
  {
      "Country": "Australia", 
      "Life Expectancy": 83.3,
      "Care System Score": 75.2,
      "Death Rate": 6.30, 
      "Depression Rate": 5.05,
      "Health Score": 80.2,
      "Cardiovascular disease death": 108.13
  }
  ]


/*var pc = d3.parcoords()("#chart-container");


svg.append(f)
  .data(data)
  .color("#FF0000")
  .alpha(0.5)
  .margin({ top: 24, left: 0, bottom: 12, right: 0 })
  .render()
  .createAxes()  // enable brushing
  //.color(function(d) { return blue_to_brown(d["Care System Score"]); })
  ;
*/


const buttonWidth = 300;
const buttonHeight = 30;


// Add the button rectangle
const buttonRect = svg.append("rect")
  .attr("class", "button-rect")
  .attr("x", (containerWidth-buttonWidth) / 2)
  .attr("y", containerHeight-buttonHeight-50)
  .attr("width", buttonWidth)
  .attr("height", buttonHeight);

// Add the button text
const buttonText = svg.append("text")
  .attr("class", "button-text")
  .attr("x", containerWidth / 2)
  .attr("y", containerHeight-60)
  .text("Explore the statistics yourself");

// Add a click event handler to the button
buttonRect.on("click", () => {
    window.location.href = "page3.html";
});
