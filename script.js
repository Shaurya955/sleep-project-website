const data = [
  { variable: "BMI", correlation: 0.62 },
  { variable: "Depression", correlation: 0.58 },
  { variable: "Hypertension", correlation: 0.51 },
  { variable: "Poor Physical Health", correlation: 0.47 },
  { variable: "Alcohol Use", correlation: 0.39 },
  { variable: "Blood Pressure", correlation: 0.36 },
  { variable: "Work Activity", correlation: 0.29 }
];

const container = d3.select("#chart");
const tooltip = d3.select("#tooltip");

const width = 860;
const height = 470;
const margin = { top: 30, right: 30, bottom: 110, left: 80 };

const svg = container
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3
  .scaleBand()
  .range([0, chartWidth])
  .padding(0.3);

const y = d3
  .scaleLinear()
  .range([chartHeight, 0]);

x.domain(data.map(d => d.variable));
y.domain([0, d3.max(data, d => d.correlation) + 0.1]);

const xAxisGroup = g
  .append("g")
  .attr("transform", `translate(0, ${chartHeight})`);

const yAxisGroup = g.append("g");

function drawAxes() {
  xAxisGroup
    .transition()
    .duration(800)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end");

  yAxisGroup
    .transition()
    .duration(800)
    .call(d3.axisLeft(y));
}

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 20)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .text("Top Variables Most Correlated with Sleep");

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height - 10)
  .attr("text-anchor", "middle")
  .text("Variables");

svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", 20)
  .attr("text-anchor", "middle")
  .text("Correlation");

function renderBars(currentData) {
  const bars = g.selectAll("rect").data(currentData, d => d.variable);

  bars
    .enter()
    .append("rect")
    .attr("x", d => x(d.variable))
    .attr("y", chartHeight)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("fill", "#4f86b8")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "#2f648f");

      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.variable}</strong><br>Correlation: ${d.correlation}`)
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "#4f86b8");
      tooltip.style("opacity", 0);
    })
    .merge(bars)
    .transition()
    .duration(800)
    .attr("x", d => x(d.variable))
    .attr("y", d => y(d.correlation))
    .attr("width", x.bandwidth())
    .attr("height", d => chartHeight - y(d.correlation));

  bars.exit().remove();
}

drawAxes();
renderBars(data);

let sorted = false;

d3.select("#sort-button").on("click", function() {
  sorted = !sorted;

  const sortedData = [...data].sort((a, b) =>
    sorted
      ? d3.descending(a.correlation, b.correlation)
      : d3.ascending(a.variable, b.variable)
  );

  x.domain(sortedData.map(d => d.variable));
  drawAxes();
  renderBars(sortedData);
});
