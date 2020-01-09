const path = require("path");
const myfs = require("./fs");
const draw = require("./draw");

myfs.browseDirectory(path.join(__dirname, "project")).then(data => {
  console.log(data[0]);
  console.log(data[1]);
  return;
  let graph = draw.extractData(data);
  draw
    .generateHtml(graph)
    .then(() => {
      console.log("Saved");
    })
    .catch(err => console.error(err));
});
