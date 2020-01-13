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
  let keywords = [
    "class",
    "import",
    "require",
    "function",
    "extends",
    "implements",
  ];

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
  return new Promise(resolve => {
    switch (keyword) {
      case "class":
        if (line.match(keyword)) {
          let columnIndex = line.indexOf(keyword);
          let name = line.slice(columnIndex).trim().split(" ")[1];
          resolve({
            type: keyword,
            name,
          });
        }
        break;
      case "import":
        if (line.match(keyword)) {
          let columnIndex = line.indexOf("from");
          let name = line
            .slice(columnIndex)
            .trim()
            .split(" ")[1]
            .replace(/\(?"\)?;?/g, "");
          name.substr("/") ? (name = path.basename(name)) : name;
          resolve({
            type: keyword,
            name,
          });
        }
        break;
      case "require":
        if (line.match(keyword)) {
          let columnIndex = line.indexOf(keyword);
          let name = line.slice(columnIndex).trim().split('"')[1];
          name.slice(0, name.indexOf('"'));
          name.substr("/") ? (name = path.basename(name)) : name;
          resolve({
            type: keyword,
            name,
          });
        }
        break;
      case "function":
        if (line.match(/\(*\) {/) || line.match(/\(*\) => {/)) {
          let name = line.trim().split(" ")[0];
          if (name !== "function")
            resolve({
              type: keyword,
              name,
            });
        }
        break;
      case "extends":
        if (line.match(keyword)) {
          let columnIndex = line.indexOf(keyword);
          let name = line.slice(columnIndex).trim().split(" ")[1];
          resolve({
            type: keyword,
            name,
          });
        }
        break;
      case "implements":
        if (line.match(keyword)) {
          let columnIndex = line.indexOf(keyword);
          let name = line.slice(columnIndex).trim().split(" ")[1];
          resolve({
            type: keyword,
            name,
          });
        }
        break;
      default:
        break;
    }
  });
};

module.exports = { browseDirectory };
