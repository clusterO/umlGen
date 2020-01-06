const path = require("path");
const myFs = require("./fs");

myFs.browseDirectory(path.join(__dirname, "testDir")).then(msg => {
  console.log(msg);
});
