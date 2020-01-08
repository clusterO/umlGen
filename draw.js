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
  return new Promise(resolve => {
    let page = `let links = ${JSON.stringify(graphData.links)}; \r\n`;
    fs.writeFile("./index.js", page, err => {});
    fs.readFile("./graph.js", null, (err, data) => {
      fs.appendFile("./index.js", data, err => {
        if (err) throw err;
        resolve();
      });
    });
  });
};

module.exports = {
  extractData,
  generateHtml,
};
