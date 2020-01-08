const path = require("path");
const http = require("http");
const fs = require("fs");
const myfs = require("./fs");
const draw = require("./draw");

myfs.browseDirectory(path.join(__dirname, "testDir")).then(data => {
  let graph = draw.extractData(data);
  draw
    .generateHtml(graph)
    .then(() => {
      console.log("Saved");
    })
    .catch(err => console.error(err));
});
