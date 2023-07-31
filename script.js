// Get the width and height of the container
const containerWidth = document.getElementById('chart-container').clientWidth;
const containerHeight = document.getElementById('chart-container').clientHeight;


window.onload = function() {
  // Check if the window has a resizeTo function (some browsers might block it)
  if (typeof window.resizeTo === 'function') {
      // Set the window size to the screen size
      window.resizeTo(screen.width, screen.height);
  }
  if (screen.width < 1500 || screen.height < 600 || containerWidth < 1500 || containerHeight< 600) { 
    document.getElementById('myModal').style.display = 'block';
  }
};

// Function to close the modal
function closeModal() {
  document.getElementById('myModal').style.display = 'none';
}


console.log(containerWidth + ' ' + containerHeight); 
// Create an SVG element within the container
const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", containerWidth)
  .attr("height", containerHeight);


// Add text to the center of the SVG
const text = svg.append("text")
  .attr("class", "centered-text")
  .attr("x", containerWidth/2)
  .attr("y", 50)
  .text("The cost of Healthcare in the United States of Ameria is the highest in the world. ")
  .transition()
  .style("font-size", "30px").delay(100).duration(1000);


const countries = ["United States", "Switzerland", "Germany", "Netherlands", "Belgium", "Australia", "France", "Sweden", "Average", "Canada", "Ireland", "United Kingdom", "Japan", "Italy"];
const costs = [12555, 8049, 8011, 7358, 6600, 6596, 6517, 6438, 6416, 6319, 6047, 5493, 5251, 4291];
    
// Dimensions for the chart
const margin = { top: 200, right: 20, bottom: 40, left: 500 };
const chartWidth = 800;
const chartHeight = 300 ;

const bar_chart = d3.select("#chart-container").append("svg")
  //.attr("x", 600)
  //.attr("y", 200)
  .attr("width", chartWidth )
  .attr("height", chartHeight )
  .append("g").attr("transform", "translate(200, 100)")
  ;

// Create the x-axis scale
const xScale = d3.scaleLinear()
  .domain([0, 13000])
  .range([0, chartWidth]);

// Create the y-axis scale
const yScale = d3.scaleBand()
  .domain(countries)
  .range([0, chartHeight])
  .padding(0.2);

// Add the x-axis
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(200, 450)`)
  .call(d3.axisBottom(xScale));

// Add the y-axis
svg.append("g")
  .attr("class", "y-axis")
  .attr("transform", `translate(200, 150)`)
  .call(d3.axisLeft(yScale));

// Add the bars
svg.selectAll(".bar")
  .data(costs)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", 200)
  .attr("y", (d, i) => 150+yScale(countries[i]))
  //.attr("width", (d) => xScale(d))
  .attr("height", yScale.bandwidth())
  .transition().delay(100) // Add transition for the animation
  .duration(1000) // Set the duration of the animation in milliseconds
  .attr("width", (d) => xScale(d));

// Add the title
svg.append("text")
  .attr("class", "title-text")
  .attr("x", 600)
  .attr("y", 130)
  .text("Per-capita Healthcare spending");

// Add the footnote
svg.append("text")
  .attr("class", "footnote")
  .attr("x", 200)
  .attr("y", chartHeight + 200)
  .text("Source: Organization for Economic Cooperation and Development OECD Health Statistics 2003, July 2003.");  

  svg.append("text")
  .attr("class", "footnote")
  .attr("x", 200)
  .attr("y", 550)
  .text("Generally wealthier countries, such as the United States, will spend more on healthcare than countries that are less affluent. ")
  ;
  
  svg.append("text")
  .attr("class", "footnote")
  .attr("x", 200)
  .attr("y", 570)
  .text("In 2022, the United States spent an estimated $12,555 per person on healthcare — over twice the average of other wealthy countries.")
  ;

  const annotation = d3.annotation()
  .type(d3.annotationCallout)
  .annotations([
    {
      note: {
        label: 'Five largest economy countries with above median GDP were included.',
        bgPadding: 20,
        title: 'Average per-capita healthcare spending, excluding US', 
        wrap: 400
      },
      connector: {
        end: "dot" // 'arrow' also available
      },
      data: { countries: 'Average', costs: 6416 },
      className: "show-bg",
      x: 580,
      y: 330,
      dx: 50, 
      dy: 10
    },

  ]);

  svg.append('g')
    .attr('class', 'annotation-group')
    .call(annotation)
    .transition()
    .delay(1000);  
  

svg.append("text")
  .attr("class", "centered-text")
  .attr("x", containerWidth/2)
  .attr("y", 650)
  .text("But does this higher cost translate to a better outcome in terms of life expectancy or quality of life?")
  .transition()
  .style("font-size", "33px").delay(1000).duration(1000);  

const buttonWidth = 150;
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
  .text("Click to find out");

// Add a click event handler to the button
buttonRect.on("click", () => {
    window.location.href = "page2.html";
});
