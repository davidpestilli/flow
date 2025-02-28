// diagramSupervisoes.js
import { carregarChefias, getDiagramaChefias } from "./diagramChefias.js";  // Importa a função de Chefias
import { nodeFillConverter, limparContainer } from "./utils.js";

let diagramaSupervisoes;

export function criarSupervisoes() {
  const $ = go.GraphObject.make;
  diagramaSupervisoes = $(go.Diagram, "supervisoesDiagram", {
    layout: $(go.TreeLayout, { angle: 0, layerSpacing: 35 }),
    contentAlignment: go.Spot.Center,
    initialAutoScale: go.Diagram.Uniform,
    "undoManager.isEnabled": true
  });

  diagramaSupervisoes.nodeTemplate =
  $(go.Node, "Auto",
    { 
      desiredSize: new go.Size(150, 50),
      mouseEnter: function(e, obj) {
        // Atualiza a propriedade de dados "hovered" para true
        obj.part.diagram.model.setDataProperty(obj.part.data, "hovered", true);
      },
      mouseLeave: function(e, obj) {
        // Restaura para false ao sair com o mouse
        obj.part.diagram.model.setDataProperty(obj.part.data, "hovered", false);
      },
      click: function(e, obj) {
        limparContainer("Chefias");

        // Atualiza o container de Supervisões
        document.getElementById("rotuloSupervisoes").textContent = obj.part.data.isRoot ?
          "Coordenadoria da " + obj.part.data.name :
          "Supervisão de " + obj.part.data.name;
        document.getElementById("numeroSupervisoes").textContent = obj.part.data.numero || "";
        document.getElementById("descricaoSupervisoes").textContent = getDescricaoSupervisao(obj.part.data.key);
        document.getElementById("chefiasHeader").textContent = "Chefias da Supervisão de " + obj.part.data.name + " da " + window.upjSelecionada;
        carregarChefias(obj.part.data.key);

        console.log("Clique no nó:", obj.part.data);

        // Atualiza a seleção: marca o nó clicado e desmarca os demais
        var diagram = obj.part.diagram;
        diagram.nodes.each(function(n) {
          diagram.model.setDataProperty(n.data, "selected", false);
        });
        diagram.model.setDataProperty(obj.part.data, "selected", true);

        // Força a reavaliação de todas as bindings:
        diagram.nodes.each(function(n) {
          n.updateTargetBindings();
        });
        
        document.getElementById("rotuloSupervisoes").textContent = obj.part.data.isRoot ?
          "Coordenadoria da " + obj.part.data.name :
          "Supervisão de " + obj.part.data.name;
        document.getElementById("numeroSupervisoes").textContent = obj.part.data.numero || "";
        document.getElementById("descricaoSupervisoes").textContent = getDescricaoSupervisao(obj.part.data.key);
        document.getElementById("chefiasHeader").textContent = "Chefias da Supervisão de " + obj.part.data.name + " da " + window.upjSelecionada;
        carregarChefias(obj.part.data.key);
      }
    },
    $(go.Shape, "RoundedRectangle",
      { desiredSize: new go.Size(150, 50) },
      new go.Binding("fill", "", nodeFillConverter),
      new go.Binding("strokeWidth", "", function(data) {
        return data.hovered ? 4 : (data.isRoot ? 3 : 1);
      })
    ),
    $(go.TextBlock,
      { margin: 0, font: "bold 16px Arial", stroke: "black", textAlign: "center", verticalAlignment: go.Spot.Center, alignment: go.Spot.Center },
      new go.Binding("text", "name"),
      new go.Binding("desiredSize", "name", function(n){
        return (n && n.indexOf("Nenhuma supervisão") >= 0) ? new go.Size(250, 50) : new go.Size(150, 50);
      }),
      new go.Binding("stroke", "name", function(n){
        return (n && n.indexOf("Nenhuma supervisão") >= 0) ? "white" : "black";
      }))
  );

  diagramaSupervisoes.linkTemplate =
    $(go.Link, $(go.Shape), $(go.Shape, { toArrow: "Standard" }));
}

export function carregarSupervisoes(coordKey, upjName) {
  const supervisoesDict = {
    1: [
      { key: "UPJ de DP1", name: "UPJ de DP1", isRoot: true, numero: "SJ 3.1" },
      { key: "Sup1", parent: "UPJ de DP1", name: "Atendimento e Processamento", isRoot: false, numero: "SJ 3.1.1" },
      { key: "Sup2", parent: "UPJ de DP1", name: " Decurso e Finalização", isRoot: false, numero: "SJ 3.1.2" },
      { key: "Sup3", parent: "UPJ de DP1", name: "Julgamento I", isRoot: false, numero: "SJ 3.1.3" },
      { key: "Sup4", parent: "UPJ de DP1", name: "Julgamento II", isRoot: false, numero: "SJ 3.1.4" },
      { key: "Sup5", parent: "UPJ de DP1", name: "Transição", isRoot: false, numero: "SJ 3.1.5" }
    ],
    2: [
      { key: "UPJ de DP2", name: "UPJ de DP2", isRoot: true, numero: "SJ 3.2" },
      { key: "Sup1", parent: "UPJ de DP2", name: "Atendimento e Processamento", isRoot: false, numero: "SJ 3.2.1"},
      { key: "Sup2", parent: "UPJ de DP2", name: "Decurso e Finalização", isRoot: false, numero: "SJ 3.2.2"},
      { key: "Sup3", parent: "UPJ de DP2", name: "Julgamento I", isRoot: false, numero: "SJ 3.2.3"},
      { key: "Sup4", parent: "UPJ de DP2", name: "Julgamento II", isRoot: false, numero: "SJ 3.2.4"},
      { key: "Sup5", parent: "UPJ de DP2", name: "Transição", isRoot: false, numero: "SJ 3.2.5"}
    ],
    3: [
      { key: "UPJ de DP3", name: "UPJ de DP3", isRoot: true, numero: "SJ 3.3" },
      { key: "Sup1", parent: "UPJ de DP3", name: "Atendimento e Processamento", isRoot: false, numero: "SJ 3.3.1" },
      { key: "Sup2", parent: "UPJ de DP3", name: "Decurso e Finalização", isRoot: false, numero: "SJ 3.3.2" },
      { key: "Sup3", parent: "UPJ de DP3", name: "Julgamento I", isRoot: false, numero: "SJ 3.3.3" },
      { key: "Sup4", parent: "UPJ de DP3", name: "Julgamento II", isRoot: false, numero: "SJ 3.3.4" },
      { key: "Sup5", parent: "UPJ de DP3", name: "Transição", isRoot: false, numero: "SJ 3.3.5" }
    ]  
  };

  let dados = supervisoesDict[coordKey];
  if (!dados) {
    dados = [{ key: "Vazio", name: "Nenhuma supervisão encontrada" }];
  }
  diagramaSupervisoes.model = new go.TreeModel(dados);
  diagramaSupervisoes.zoomToFit();
  if (dados.length === 1 && dados[0].key === "Vazio") {
    document.getElementById("supervisoesHeader").textContent = "Supervisões";
  } else {
    document.getElementById("supervisoesHeader").textContent = "Supervisões da " + upjName;
  }
  document.getElementById("rotuloSupervisoes").textContent = "Supervisões";
  document.getElementById("descricaoSupervisoes").textContent = "";
  // Reseta o diagrama de chefias
  const diagramaChefias = getDiagramaChefias();
  if (diagramaChefias) {
    diagramaChefias.model = new go.TreeModel([]);
  }
  document.getElementById("rotuloChefias").textContent = "Chefias";
  document.getElementById("descricaoChefias").textContent = "";
  document.getElementById("chefiasHeader").textContent = "Chefias";
}

export function getDiagramaSupervisoes() {
  return diagramaSupervisoes;
}

function getDescricaoSupervisao(key) {
  const descricaoSupervisoesDict = {
    "Sup1": "Serviço de Atendimento ao Público e Processamento de Grupos e Câmaras",
    "Sup2": "Serviço de Decurso de Prazos e Finalização do Processamento de Grupos e Câmara",
    "Sup3": "Serviço de Julgamento de Grupos e Câmaras I",
    "Sup4": "Serviço de Julgamento de Grupos e Câmaras II",
    "Sup5": "Serviço de Transição entre Instâncias"
  };
  return descricaoSupervisoesDict[key] || "";
}
