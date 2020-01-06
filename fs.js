const path = require("path");
const fs = require("fs");
const readline = require("readline");

let browseDirectory = dirPath => {
  fs.readdir(dirPath, (err, files) => {
    if (err) console.error(err);
    files.forEach(file => {
      fs.statSync(path.join(dirPath, file)).isDirectory()
        ? browseDirectory(path.join(dirPath, file))
        : file == "test.js" || file == "anothertest.js"
        ? locateKeywords(path.join(dirPath, file))
        : false;
    });
  });
};

let locateKeywords = file => {
  let depInfos = [];
  let keywords = ["class", "import"];
  let data = {};

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false,
  });

  rl.on("line", line => {
    keywords.forEach(keyword => {
      if ((data = getDeps(line, keyword))) depInfos.push(data);
    });
  });

  rl.on("close", () => {
    console.log({
      fileName: path.basename(file),
      depInfos,
    });
  });
};

let getDeps = (line, keyword) => {
  let keyIndex = keyword;
  if (keyword === "import") keyIndex = "from";

  if (line.match(keyword)) {
    let columnIndex = line.indexOf(keyIndex);
    let name = line
      .slice(columnIndex)
      .trim()
      .split(" ")[1]
      .replace('("', "")
      .replace('")', "");

    name.substr("/") ? (name = path.basename(name)) : name;
    return {
      type: keyword,
      name,
    };
  }

  return false;
};

module.exports = { browseDirectory };
