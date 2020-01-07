let extractData = depGraph => {
  let links = [];
  let nodes = [];

  depGraph.forEach(element => {
    let fileName = element.fileName.split(".")[0];
    nodes.push({ id: fileName });
    element.depInfos.forEach(dep => {
      if (dep.type === "import")
        links.push({
          source: fileName,
          target: dep.name,
        });
    });
  });

  return { links, nodes };
};

module.exports = {
  extractData,
};
