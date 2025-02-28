// diagramUPJs.js
import { carregarSupervisoes } from "./diagramSupervisoes.js";
import { nodeFillConverter, limparContainer } from "./utils.js";

let diagramaUPJs;

export function criarUPJs() {
  const $ = go.GraphObject.make;
  diagramaUPJs = $(go.Diagram, "upjsDiagram", {
    layout: $(go.TreeLayout, { angle: 0, layerSpacing: 35 }),
    contentAlignment: go.Spot.Center,
    initialAutoScale: go.Diagram.Uniform,
    "undoManager.isEnabled": true
  });

  diagramaUPJs.nodeTemplate =
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
        limparContainer("Supervisoes");
        limparContainer("Chefias");

        // Atualiza o container de UPJs
        document.getElementById("rotuloUPJs").textContent = obj.part.data.isRoot ?
          (obj.part.data.name === "Diretoria" ? "Diretoria de Direito Privado" : "Coordenadoria da " + obj.part.data.name) :
          "Coordenadoria da " + obj.part.data.name;
        document.getElementById("numeroUPJs").textContent = obj.part.data.numero || "";
        document.getElementById("descricaoUPJs").textContent = getDescricaoUPJ(obj.part.data.key);
        window.upjSelecionada = obj.part.data.name;

        // Prepara os containers à direita para a nova seleção
        document.getElementById("rotuloSupervisoes").textContent = "Supervisões";
        document.getElementById("descricaoSupervisoes").textContent = "";
        document.getElementById("chefiasHeader").textContent = "Chefias";
        limparContainer("Chefias");

        
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

        carregarSupervisoes(obj.part.data.key, obj.part.data.name);
        if (obj.part.data.isRoot) {
          if (obj.part.data.name === "Diretoria") {
            document.getElementById("rotuloUPJs").textContent = "Diretoria de Direito Privado";
          } else {
            document.getElementById("rotuloUPJs").textContent = "Coordenadoria da " + obj.part.data.name;
          }
        } else {
          document.getElementById("rotuloUPJs").textContent = "Coordenadoria da " + obj.part.data.name;
        }
        document.getElementById("numeroUPJs").textContent = obj.part.data.numero || "";
        document.getElementById("descricaoUPJs").textContent = getDescricaoUPJ(obj.part.data.key);
        window.upjSelecionada = obj.part.data.name;
        document.getElementById("chefiasHeader").textContent = "Chefias";
        document.getElementById("rotuloChefias").textContent = "Chefias";
        document.getElementById("descricaoChefias").textContent = "";
      }
    },
    $(go.Shape, "Rectangle",
      { desiredSize: new go.Size(150, 50) },
      // Substitua a binding de "fill" para usar o nodeFillConverter
      new go.Binding("fill", "", nodeFillConverter),
      new go.Binding("strokeWidth", "", function(data) {
        return data.hovered ? 4 : (data.isRoot ? 3 : 1);
      })
    ),
    $(go.TextBlock,
      { margin: 10, font: "bold 16px Arial", stroke: "black", textAlign: "center", alignment: go.Spot.Center },
      new go.Binding("text", "name"))
  );

  diagramaUPJs.linkTemplate =
    $(go.Link, $(go.Shape), $(go.Shape, { toArrow: "Standard" }));

  // Modelo para o diagrama UPJs
  diagramaUPJs.model = new go.TreeModel([
    { key: 0, name: "Diretoria", isRoot: true, numero: "SJ 3" },
    { key: 1, parent: 0, name: "UPJ de DP1", isRoot: false, numero: "SJ 3.1" },
    { key: 2, parent: 0, name: "UPJ de DP2", isRoot: false, numero: "SJ 3.2" },
    { key: 3, parent: 0, name: "UPJ de DP3", isRoot: false, numero: "SJ 3.3" }
  ]);
  
  diagramaUPJs.zoomToFit();
}

export function getDiagramaUPJs() {
  return diagramaUPJs;
}

// Função auxiliar para obter a descrição da UPJ
function getDescricaoUPJ(key) {
  const descricaoUPJDict = {
    1: "Família e Sucessões",
    2: "Bancos e Seguros",
    3: "Bancos e Seguros"
  };
  return descricaoUPJDict[key] || "";
}
