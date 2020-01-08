const path = require("path");
const http = require("http");
const fs = require("fs");
const myFs = require("./fs");
const draw = require("./draw");

myFs.browseDirectory(path.join(__dirname, "testDir")).then(data => {
  let graph = draw.extractData(data);
  //draw.generateHtml(graph);
  http
    .createServer((req, res) => {
      fs.readFile("./index.html", null, (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    })
    .listen(8000);
});
