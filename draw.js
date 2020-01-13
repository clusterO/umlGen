const fs = require("fs");
const path = require("path");

let extractDepGraphLinks = data => {
  let links = [];

  data.forEach(element => {
    let fileName = element.fileName.split(".")[0];
    element.depInfos.forEach(dep => {
      if (dep.type === "import" || dep.type === "require")
        links.push({
          source: fileName,
          target: dep.name,
        });
    });
  });

  return links;
};

extractClassLinks = data => {
  let links = [];

  return new Promise(resolve => {
    data.forEach(element => {
      element.depInfos.forEach(dep => {
        if (dep.type === "class") {
          let className = dep.name;
          for (let i = 0; i < data.length; ++i)
            for (let j = 0; j < data[i].depInfos.length; ++j)
              if (
                (data[i].depInfos[j].type === "import" ||
                  data[i].depInfos[j].type === "require") &&
                data[i].depInfos[j].name === className
              )
                links.push({
                  source: className,
                  target: data[i].fileName.split(".")[0],
                });
        }
      });
    });
    resolve(links);
  });
};

let generateHtml = (links, type) => {
  return new Promise(resolve => {
    let page = `let links = ${JSON.stringify(links)}; \r\n`;
    let filePath = "";

    if (type === "class") {
      fs.writeFile("./class.js", page, err => {});
      filePath = path.join(__dirname, "class.js");
    } else {
      fs.writeFile("./dependency.js", page, err => {});
      filePath = path.join(__dirname, "dependency.js");
    }

    fs.readFile("./graph.js", null, (err, data) => {
      fs.appendFile(filePath, data, err => {
        if (err) throw err;
        resolve();
      });
    });
  });
};

module.exports = {
  extractDepGraphLinks,
  extractClassLinks,
  generateHtml,
};
