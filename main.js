const path = require("path");
const myFs = require("./fs");
const draw = require("./draw");

myFs.browseDirectory(path.join(__dirname, "testDir")).then(data => {
  let graph = draw.extractData(data);
  console.log(graph);
});
