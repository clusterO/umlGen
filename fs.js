const path = require("path");
const fs = require("fs");

let browseDirectory = dirPath => {
  fs.readdir(dirPath, (err, files) => {
    files.forEach(file => {
      fs.statSync(path.join(dirPath, file)).isDirectory()
        ? browseDirectory(path.join(dirPath, file))
        : console.log(file);
    });
  });
};

module.exports = { browseDirectory };
