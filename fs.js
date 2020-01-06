const path = require("path");
const fs = require("fs");
const readline = require("readline");

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
  let keywordLocations = [];
  let index = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false,
  });

  rl.on("line", line => {
    index++;
    if (line.match("class"))
      keywordLocations.push([index, line.indexOf("class")]);
  });

  rl.on("close", () => {
    console.log({
      fileName: path.basename(file),
      keywordLocations,
    });
  });
};

module.exports = { browseDirectory };
