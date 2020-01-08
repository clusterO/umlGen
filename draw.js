const fs = require("fs");

let extractData = depGraph => {
  let links = [];
  let nodes = [];

  depGraph.forEach(element => {
    let fileName = element.fileName.split(".")[0];
    nodes.push({ name: fileName });
    element.depInfos.forEach(dep => {
      if (dep.type === "import")
        links.push({
          source: fileName,
          target: dep.name,
        });
    });
  });

  return { links, nodes };
};

let generateHtml = graphData => {
  let page = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dependency Graph</title>
    <style>
      .node {
        fill: #ccc;
        stroke: #fff;
        stroke-width: 2px;
      }

      .link {
        stroke-width: 2px;
        stroke: #777;
      }
    </style>
  </head>
  <body>
    <script src="https://d3js.org/d3.v3.min.js"></script>
    <script>
      let links = ${JSON.stringify(graphData.links)};
      
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
        .attr("width", 640)
        .attr("height", 480);

      let force = d3.layout
        .force()
        .size([640, 480])
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

      let node = svg
        .selectAll(".node")
        .data(force.nodes())
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 640 * 0.03);

      function tick(e) {
        node
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
    </script>
  </body>
</html>
`;

  fs.writeFile("./index.html", page, err => console.error(err));
};

module.exports = {
  extractData,
  generateHtml,
};
