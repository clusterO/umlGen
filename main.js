const path = require("path");
const myfs = require("./fs");
const draw = require("./draw");

myfs.browseDirectory(path.join(__dirname, "project")).then(data => {
  draw.extractClassLinks(data).then(links => {
    draw
      .generateHtml(links, "class")
      .then(() => {
        console.log("Saved");
      })
      .catch(err => console.error(err));
  });

  let depGraphlinks = draw.extractDepGraphLinks(data);
  draw
    .generateHtml(depGraphlinks, "dependency")
    .then(() => {
      console.log("Saved");
    })
    .catch(err => console.error(err));
});
