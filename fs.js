const path = require("path");
const fs = require("fs");

let browseDirectory = dirPath => {
  fs.readdir(dirPath, (err, files) => {
    if (err) console.error(err);
    files.forEach(file => {
      fs.statSync(path.join(dirPath, file)).isDirectory()
        ? browseDirectory(path.join(dirPath, file))
        : readFile(path.join(dirPath, file));
    });
  });
};

let readFile = file => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) console.error(err);
    if (path.basename(file) === "test.js") locateKeyword("class", data);
  });
};

let locateKeyword = (keyword, data) => {
  console.log(data.charAt(35));
  console.log(data.match(/\r\n/g).length);
  console.log(data.slice(35).indexOf("\r\n"));
};

module.exports = { browseDirectory };
