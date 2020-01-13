let links = [{"source":"main","target":"react"},{"source":"react","target":"main"},{"source":"http","target":"main"},{"source":"http","target":"react"}]; 
let width = 960,
  height = 500;

let nodes = {};

links.forEach(link => {
  link.source =
    nodes[link.source] || (nodes[link.source] = { name: link.source });
  link.target =
    nodes[link.target] || (nodes[link.target] = { name: link.target });
});

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let force = d3.layout
  .force()
  .size([width, height])
  .nodes(d3.values(nodes))
  .links(links)
  .on("tick", tick)
  .linkDistance(300)
  .start();

let link = svg
  .selectAll(".link")
  .data(links)
  .enter()
  .append("line")
  .attr("class", "link");

var circle = svg
  .append("g")
  .selectAll("circle")
  .data(force.nodes())
  .enter()
  .append("circle")
  .attr("class", "node")
  .attr("r", width * 0.03);

var text = svg
  .append("g")
  .attr("class", "label")
  .selectAll("text")
  .data(force.nodes())
  .enter()
  .append("text");

function tick(e) {
  text
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    })
    .text(function (d) {
      return d.name;
    });

  circle
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .call(force.drag);

  link
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });
}
