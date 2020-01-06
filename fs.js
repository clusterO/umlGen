const path = require("path");
const fs = require("fs");
const readline = require("readline");

let depGraph = [];

let browseDirectory = dirPath => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) reject(err);
      files.forEach(file => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
          resolve(browseDirectory(path.join(dirPath, file)));
        } else {
          locateKeywords(path.join(dirPath, file)).then(fileInfo => {
            depGraph.push(fileInfo);
            resolve(depGraph);
          });
        }
      });
    });
  });
};

let locateKeywords = file => {
  let depInfos = [];
  let keywords = ["class", "import"];

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false,
  });

  return new Promise(resolve => {
    rl.on("line", line => {
      keywords.forEach(keyword => {
        getDeps(line, keyword)
          .then(data => {
            depInfos.push(data);
          })
          .catch(err => console.error(err));
      });
    });

    rl.on("close", () => {
      resolve({
        fileName: path.basename(file),
        depInfos,
      });
    });
  });
};

let getDeps = (line, keyword) => {
  let keyIndex = keyword;
  if (keyword === "import") keyIndex = "from";

  return new Promise(resolve => {
    if (line.match(keyword)) {
      let columnIndex = line.indexOf(keyIndex);
      let name = line
        .slice(columnIndex)
        .trim()
        .split(" ")[1]
        .replace('("', "")
        .replace('")', "");

      name.substr("/") ? (name = path.basename(name)) : name;
      resolve({
        type: keyword,
        name,
      });
    }
  });
};

module.exports = { browseDirectory };
