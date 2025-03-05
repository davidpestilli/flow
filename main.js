import { criarUPJs, getDiagramaUPJs } from "./diagramUPJs.js";
import { criarSupervisoes, carregarSupervisoes, getDiagramaSupervisoes } from "./diagramSupervisoes.js";
import { criarChefias, carregarChefias, getDiagramaChefias } from "./diagramChefias.js";

export let upjSelecionada = "";

window.onload = function() {
  criarUPJs();
  criarSupervisoes();
  criarChefias();

  const diagramaUPJs = getDiagramaUPJs();
  const diagramaSupervisoes = getDiagramaSupervisoes();
  const diagramaChefias = getDiagramaChefias();

  // Inicialmente, defina modelos vazios para os diagramas de supervisões e chefias
  diagramaSupervisoes.model = new go.TreeModel([]);
  diagramaChefias.model = new go.TreeModel([]);

  // Listener para cliques (em nós ou fundo) no diagrama de UPJs:
  if(diagramaUPJs) {
    diagramaUPJs.addDiagramListener("ObjectSingleClicked", function(e) {
      document.getElementById("btnConteudo").style.display = "none";
      document.getElementById("contentPanel").style.width = "0";
    });
    diagramaUPJs.addDiagramListener("BackgroundSingleClicked", function(e) {
      document.getElementById("btnConteudo").style.display = "none";
      document.getElementById("contentPanel").style.width = "0";
    });
  }
  
  // Listener para cliques (em nós ou fundo) no diagrama de Supervisões:
  diagramaSupervisoes.addDiagramListener("ObjectSingleClicked", function(e) {
    document.getElementById("btnConteudo").style.display = "none";
    document.getElementById("contentPanel").style.width = "0";
  });
  diagramaSupervisoes.addDiagramListener("BackgroundSingleClicked", function(e) {
    document.getElementById("btnConteudo").style.display = "none";
    document.getElementById("contentPanel").style.width = "0";
  });

  // Para o diagrama de Chefias, o comportamento de exibição do botão "Conteúdo"
  // já está tratado no clique dos nós (em diagramChefias.js)

  // Funcionalidade de reset
  document.getElementById("btnReset").addEventListener("click", function() {
    location.reload();
  });
};

window.addEventListener("resize", function() {
  const diagramaUPJs = getDiagramaUPJs();
  const diagramaSupervisoes = getDiagramaSupervisoes();
  const diagramaChefias = getDiagramaChefias();

  if (diagramaUPJs) diagramaUPJs.zoomToFit();
  if (diagramaSupervisoes) diagramaSupervisoes.zoomToFit();
  if (diagramaChefias) diagramaChefias.zoomToFit();
});
S
