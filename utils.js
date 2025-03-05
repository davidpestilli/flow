// utils.js – Função corrigida para definir cores corretamente
export function nodeFillConverter(data, obj) {
  var diagram = obj.part.diagram;
  var diagramId = diagram.div.id;
  var selectedNode = null;
  
  // Identifica o nó selecionado
  diagram.nodes.each(function(n) {
    if (n.data.selected) {
      selectedNode = n;
    }
  });

  // Define as cores padrão conforme o diagrama
  var defaultFill;
  if (diagramId === "upjsDiagram") {
    defaultFill = data.isRoot ? "#1E40AF" : "#60A5FA";  // tons de azul
  } else if (diagramId === "supervisoesDiagram") {
    defaultFill = data.isRoot ? "#047857" : "#10B981";  // tons de verde
  } else if (diagramId === "chefiasDiagram") {
    defaultFill = data.isRoot ? "#B45309" : "#F59E0B";  // tons de âmbar
  } else {
    defaultFill = "white";
  }

  // Se houver um nó selecionado e ele não for raiz, torna os outros cinza
  if (selectedNode && !selectedNode.data.isRoot) {
    return data.selected ? defaultFill : "grey";
  } else {
    return defaultFill; // Mantém a cor original caso o nó raiz seja clicado
  }
}

// Função para limpar os detalhes dos containers (mantida do código original)
export function limparContainer(idPrefixo) {
  document.getElementById("rotulo" + idPrefixo).textContent = "";
  document.getElementById("numero" + idPrefixo).textContent = "";
  document.getElementById("descricao" + idPrefixo).textContent = "";
}
