const fs = require("fs").promises;
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

let extractClassLinks = data => {
  let links = [];

  return new Promise(resolve => {
    data.forEach(element => {
      element.depInfos.forEach(dep => {
        if (dep.type === "class") {
          let className = dep.name;
          findClassInImports(data, className).then(link => {
            links.push(link);
          });
        }
      });
    });
    resolve(links);
  });
};

let findClassInImports = (data, className) => {
  return new Promise(resolve => {
    for (let i = 0; i < data.length; ++i)
      for (let j = 0; j < data[i].depInfos.length; ++j)
        if (
          (data[i].depInfos[j].type === "import" ||
            data[i].depInfos[j].type === "require") &&
          data[i].depInfos[j].name === className
        )
          resolve({
            source: className,
            target: data[i].fileName.split(".")[0],
          });
  });
};

let generateHtml = (links, type) => {
  return new Promise((resolve, reject) => {
    let page = `let links = ${JSON.stringify(links)}; \r\n`;
    let filePath = "";

    type === "class"
      ? (filePath = path.join(__dirname, "class.js"))
      : (filePath = path.join(__dirname, "dependency.js"));

    fs.writeFile(filePath, page, err => {});
    fs.readFile("./graph.js", null)
      .then(data => {
        fs.appendFile(filePath, data)
          .then(() => {
            resolve();
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  extractDepGraphLinks,
  extractClassLinks,
  generateHtml,
};
