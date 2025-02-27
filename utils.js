// utils.js – Versão modificada da função nodeFillConverter
export function nodeFillConverter(data, obj) {
  var diagram = obj.part.diagram;
  var selectedNode = null;
  diagram.nodes.each(function(n) {
    if (n.data.selected) {
      selectedNode = n;
    }
  });
  
  var defaultFill;
  var diagramId = diagram.div.id;
  if (diagramId === "upjsDiagram") {
    defaultFill = data.isRoot ? "darkorange" : "lightblue";
  } else if (diagramId === "supervisoesDiagram") {
    defaultFill = data.isRoot ? "lightblue" : "lightgreen";
  } else if (diagramId === "chefiasDiagram") {
    defaultFill = data.isRoot ? "lightgreen" : "lightcoral";
  } else {
    defaultFill = "white";
  }
  
  // Se o nó selecionado não for raiz, aplica a lógica de pintar de cinza os não selecionados.
  // Caso contrário (se não houver nó selecionado ou o selecionado for raiz), usa a cor padrão.
  if (selectedNode && !selectedNode.data.isRoot) {
    return data.selected ? defaultFill : "grey";
  } else {
    return defaultFill;
  }
}


export function limparContainer(idPrefixo) {
  document.getElementById("rotulo" + idPrefixo).textContent = "";
  document.getElementById("numero" + idPrefixo).textContent = "";
  document.getElementById("descricao" + idPrefixo).textContent = "";
}
