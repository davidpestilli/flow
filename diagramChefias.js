// diagramChefias.js
import { nodeFillConverter, limparContainer } from "./utils.js";

let diagramaChefias;

export function criarChefias() {
  const $ = go.GraphObject.make;
  diagramaChefias = $(go.Diagram, "chefiasDiagram", {
    layout: $(go.TreeLayout, { angle: 0, layerSpacing: 35 }),
    contentAlignment: go.Spot.Center,
    initialAutoScale: go.Diagram.Uniform,
    "undoManager.isEnabled": true
  });

  diagramaChefias.nodeTemplate =
    $(go.Node, "Auto",
      {
        selectionAdorned: false,
        // Utiliza minSize para garantir um tamanho mínimo, mas permitindo expansão conforme o conteúdo
        minSize: new go.Size(150, 50),
        mouseEnter: function(e, obj) {
          // Atualiza a propriedade de dados "hovered" para true
          obj.part.diagram.model.setDataProperty(obj.part.data, "hovered", true);
        },
        mouseLeave: function(e, obj) {
          // Restaura para false ao sair com o mouse
          obj.part.diagram.model.setDataProperty(obj.part.data, "hovered", false);
        },
        click: function(e, obj) {

          console.log("Clique no nó:", obj.part.data);
          const diagram = obj.part.diagram;
          // Desmarca todos os nós
          diagram.nodes.each(function(n) {
            diagram.model.setDataProperty(n.data, "selected", false);
          });
          diagram.model.setDataProperty(obj.part.data, "selected", true);
          
          // Atualiza as bindings dos nós
          diagram.nodes.each(function(n) {
            n.updateTargetBindings();
          });
          
          if (obj.part.data.isRoot) {
            document.getElementById("rotuloChefias").textContent = "Supervisão de " + obj.part.data.name;
            document.getElementById("numeroChefias").textContent = obj.part.data.numero || "";
            document.getElementById("descricaoChefias").textContent = "";
            document.getElementById("btnConteudo").style.display = "none";
            fecharPainelConteudo();
          } else if (obj.part.data.name === "Nenhuma chefia encontrada") {
            document.getElementById("rotuloChefias").textContent = "Nenhuma chefia encontrada";
            document.getElementById("numeroChefias").textContent = "";
            document.getElementById("descricaoChefias").textContent = "";
            document.getElementById("btnConteudo").style.display = "none";
            fecharPainelConteudo();
          } else {
            document.getElementById("rotuloChefias").textContent = "Chefia de " + obj.part.data.name;
            document.getElementById("numeroChefias").textContent = obj.part.data.numero || "";
            document.getElementById("descricaoChefias").textContent = obj.part.data.desc || "";
            // Se um nó diferente já estava selecionado, faz o botão desaparecer e reaparecer
            if (window.chefiaDataSelecionada && window.chefiaDataSelecionada.key !== obj.part.data.key) {
              document.getElementById("btnConteudo").style.display = "none";
              fecharPainelConteudo();
              window.chefiaDataSelecionada = obj.part.data;
              setTimeout(function(){
                atualizarPainelConteudo(obj.part.data);
                document.getElementById("btnConteudo").style.display = "block";
              }, 200);
            } else {
              window.chefiaDataSelecionada = obj.part.data;
              atualizarPainelConteudo(obj.part.data);
              document.getElementById("btnConteudo").style.display = "block";
            }
          }
        }
      },
      $(go.Shape, "RoundedRectangle",
        { name: "SHAPE", minSize: new go.Size(150, 50) },
        new go.Binding("fill", "", nodeFillConverter),
        new go.Binding("strokeWidth", "", function(data) {
          return data.hovered ? 4 : (data.isRoot ? 1 : 1);
        })
      ),   
      $(go.TextBlock,
        {
          margin: 10,
          font: "bold 16px Arial",
          stroke: "black",
          textAlign: "center",
          verticalAlignment: go.Spot.Center,
          alignment: go.Spot.Center,
          // Permite quebra de texto para evitar cortes
          wrap: go.TextBlock.WrapFit,
          maxSize: new go.Size(180, Infinity) // limita a largura e permite expansão vertical
        },
        new go.Binding("text", "name"))
    );

  diagramaChefias.linkTemplate =
    $(go.Link, $(go.Shape), $(go.Shape, { toArrow: "Standard" }));

  // Liga o clique do botão "Conteúdo" para abrir/fechar o painel lateral
  document.getElementById("btnConteudo").onclick = function(e) {
    e.stopPropagation();
    const panel = document.getElementById("contentPanel");
    if (panel.style.width === "300px") {
      fecharPainelConteudo();
    } else {
      abrirPainelConteudo();
    }
  };

  // Código abaixo para fechar o painel ao clicar nele
  document.getElementById("contentPanel").addEventListener("click", function(e) {
    // Verifica se o clique ocorreu diretamente no painel, não em algum elemento filho
    if (e.target === this) {
      fecharPainelConteudo();
    }
  });
}

export function carregarChefias(supKey) {
  let chefiasDict;
  if (window.upjSelecionada === "UPJ de DP1") {
    // Estrutura para UPJ de DP1 (conforme alterações anteriores)
    chefiasDict = {
      "Sup1": [
        { key: "Sup1", name: "Atendimento e Processamento", isRoot: true, numero: "SJ 3.1.1" },
        { key: "CA1", parent: "Sup1", name: "Entrada e Análise", desc: "Equipe de Entrada e Análise", isRoot: false, numero: "SJ 3.1.1.1" },
        { key: "CA2", parent: "Sup1", name: "Atendimento e Interação", desc: "Equipe de Atendimento e Interação", isRoot: false, numero: "SJ 3.1.1.2" },
        { key: "CA3", parent: "Sup1", name: "Publicações", desc: "Equipe de Publicações", isRoot: false, numero: "SJ 3.1.1.3" },
        { key: "CA4", parent: "Sup1", name: "Expedientes", desc: "Equipe de Expedientes", isRoot: false, numero: "SJ 3.1.1.4" }
     ],
     "Sup2": [
        { key: "Sup2", name: "Decurso e Finalização", isRoot: true, numero: "SJ 3.1.2" },
        { key: "CD1", parent: "Sup2", name: "Acompanhamento e Decurso", desc: "Equipe de acompanhamento de manifestações e de decurso de prazo de Despachos e Decisões Monocráticas", isRoot: false, numero: "SJ 3.1.2.1" },
        { key: "CD2", parent: "Sup2", name: "Finalização e Baixa (acórdão)", desc: "Equipe de Finalização (Acórdão)- VO e Arquivo", isRoot: false, numero: "SJ 3.1.2.2" },
        { key: "CD3", parent: "Sup2", name: "Recursos e Incidentes", desc: "Equipe de análise de Recursos e Incidentes", isRoot: false, numero: "SJ 3.1.2.3" },
        { key: "CD4", parent: "Sup2", name: "Finalização e Baixa (DM)", desc: "Equipe de Finalização (DM) - VO e Arquivo", isRoot: false, numero: "SJ 3.1.2.4" }
     ],
     "Sup3": [
        { key: "Sup3", name: "Julgamento I", isRoot: true, numero: "SJ 3.1.3" },
        { key: "CJ1", parent: "Sup3", name: "Apoio", desc: "Equipe de Apoio", isRoot: false, numero: "SJ 3.1.3.1" },
        { key: "CJ2", parent: "Sup3", name: "Triagem", desc: "Equipe de Triagem", isRoot: false, numero: "SJ 3.1.3.2" },
        { key: "CJ3", parent: "Sup3", name: "Cumprimento", desc: "Equipe de Cumprimento", isRoot: false, numero: "SJ 3.1.3.3" }
     ],
     "Sup4": [
        { key: "Sup4", name: "Julgamento II", isRoot: true, numero: "SJ 3.1.4" },
        { key: "CJ4", parent: "Sup4", name: "Apoio", desc: "Equipe de Apoio", isRoot: false, numero: "SJ 3.1.4.1" },
        { key: "CJ5", parent: "Sup4", name: "Triagem", desc: "Equipe de Triagem", isRoot: false, numero: "SJ 3.1.4.2" },
        { key: "CJ6", parent: "Sup4", name: "Cumprimento", desc: "Equipe de Cumprimento", isRoot: false, numero: "SJ 3.1.4.3" }
     ],
     "Sup5": [
        { key: "Sup5", name: "Transição entre instâncias", isRoot: true, numero: "SJ 3.1.5" },
        { key: "CT1", parent: "Sup5", name: "Processamento de Admissibilidade", desc: "Equipe de Processamento de Admissibilidade", isRoot: false, numero: "SJ 3.1.5.1" },
        { key: "CT2", parent: "Sup5", name: "Processamento de pós Admissibilidade", desc: "Equipe de Processamento de pós Admissibilidade", isRoot: false, numero: "SJ 3.1.5.2" },
        { key: "CT3", parent: "Sup5", name: "Processamento Pós STJ/STF", desc: "Equipe de Processamento Pós STJ/STF", isRoot: false, numero: "SJ 3.1.5.3" }
     ]
    };
  } else if (window.upjSelecionada === "UPJ de DP3") {
    // Estrutura atualizada para UPJ de DP3 conforme novas instruções
    chefiasDict = {
      "Sup1": [
        { key: "Sup1", name: "Atendimento e Processamento", isRoot: true, numero: "SJ 3.3.1" },
        { key: "CA5", parent: "Sup1", name: "Entrada e Análise", desc: "Equipe de análise dos processo de entrada para processamento", isRoot: false, numero: "SJ 3.3.1.1" },
        { key: "CA6", parent: "Sup1", name: "Atendimento e Interação", desc: "[Equipe de atendimento e interação com demais equipes da UPJ", isRoot: false, numero: "SJ 3.3.1.2" },
        { key: "CA7", parent: "Sup1", name: "Publicações", desc: "Equipe de publicação de despachos e decisões monocráticas", isRoot: false, numero: "SJ 3.3.1.3" }
     ],
     "Sup2": [
        { key: "Sup2", name: "Decurso e Finalização", isRoot: true, numero: "SJ 3.3.2" },
        { key: "CD5", parent: "Sup2", name: "Acompanhamento e Decurso", desc: "Equipe de acompanhamento de manifestações e de decurso de prazo de Despachos e Decisões Monocráticas", isRoot: false, numero: "SJ 3.3.2.1" },
        { key: "CD6", parent: "Sup2", name: "Finalização e Baixa (acórdão)", desc: "Equipe de Finalização - Baixa VO e Arquivo", isRoot: false, numero: "SJ 3.3.2.2" },
        { key: "CD7", parent: "Sup2", name: "Recursos e Incidentes", desc: "Equipe de análise de Recursos e Incidentes", isRoot: false, numero: "SJ 3.3.2.3" }
     ],
     "Sup3": [
        { key: "Sup3", name: "Julgamento I", isRoot: true, numero: "SJ 3.3.3" },
        { key: "CJ7", parent: "Sup3", name: "Apoio", desc: "Equipe de Apoio", isRoot: false, numero: "SJ 3.3.3.1" },
        { key: "CJ8", parent: "Sup3", name: "Triagem", desc: "Equipe de Triagem", isRoot: false, numero: "SJ 3.3.3.2" },
        { key: "CJ9", parent: "Sup3", name: "Cumprimento", desc: "Equipe de Cumprimento", isRoot: false, numero: "SJ 3.3.3.3" }
     ],
     "Sup4": [
        { key: "Sup4", name: "Julgamento II", isRoot: true, numero: "SJ 3.3.4" },
        { key: "CJ10", parent: "Sup4", name: "Apoio", desc: "Equipe de Apoio", isRoot: false, numero: "SJ 3.3.4.1" },
        { key: "CJ11", parent: "Sup4", name: "Triagem", desc: "Equipe de Triagem", isRoot: false, numero: "SJ 3.3.4.2" },
        { key: "CJ12", parent: "Sup4", name: "Cumprimento", desc: "Equipe de Cumprimento", isRoot: false, numero: "SJ 3.3.4.3" }
     ],
     "Sup5": [
        { key: "Sup5", name: "Transição entre instâncias", isRoot: true, numero: "SJ 3.3.5" },
        { key: "CT4", parent: "Sup5", name: "Processamento Pré e Pós Admissibilidade", desc: "Equipe de Processamento Pré e Pós Admissibilidade", isRoot: false, numero: "SJ 3.3.5.1" },
        { key: "CT5", parent: "Sup5", name: "Processamento pré e pós envio STF/STJ", desc: "Equipe de Processamento pré e pós envio STF/STJ", isRoot: false, numero: "SJ 3.3.5.2" }
     ]
    };
  } else {
    // Estrutura original para as demais UPJs (ex: UPJ de DP2)
    chefiasDict = {
      "Sup1": [
        { key: "Sup1", name: "Atendimento e Processamento", isRoot: true, numero: "SJ 3.2.1" },
        { key: "CA8", parent: "Sup1", name: "Atendimento ao Público", desc: "Equipe de Atendimento ao Público", isRoot: false, numero: "SJ 3.2.1.1" },
        { key: "CA9", parent: "Sup1", name: "Processamento", desc: "Equipe de Processamento de Grupos e Câmaras", isRoot: false, numero: "SJ 3.2.1.2" },
        { key: "CA10", parent: "Sup1", name: "Triagem", desc: "Equipe de Triagem e Movimentação de Recursos", isRoot: false, numero: "SJ 3.2.1.3" }
      ],
      "Sup2": [
        { key: "Sup2", name: "Decurso e Finalização", isRoot: true, numero: "SJ 3.2.2" },
        { key: "CD8", parent: "Sup2", name: "Movimentação", desc: "Equipe de Movimentação de Recursos", isRoot: false, numero: "SJ 3.2.2.1" },
        { key: "CD9", parent: "Sup2", name: "Cumprimento", desc: "Equipe de Cumprimento", isRoot: false, numero: "SJ 3.2.2.2" },
        { key: "CD10", parent: "Sup2", name: "Arquivamento", desc: "Equipe de Arquivamento e Apoio", isRoot: false, numero: "SJ 3.2.2.3" }
      ],
      "Sup3": [
        { key: "Sup3", name: "Julgamento I", isRoot: true, numero: "SJ 3.2.3" },
        { key: "CJ12", parent: "Sup3", name: "Apoio", desc: "Equipe de apoio às Sessões de Julgamento I", isRoot: false, numero: "SJ 3.2.3.1" },
        { key: "CJ13", parent: "Sup3", name: "Triagem", desc: "Equipe de Triagem e Agendamento I", isRoot: false, numero: "SJ 3.2.3.2" },
        { key: "CJ14", parent: "Sup3", name: "Cumprimento", desc: "Equipe de Cumprimento I", isRoot: false, numero: "SJ 3.2.3.3" }
      ],
      "Sup4": [
        { key: "Sup4", name: "Julgamento II", isRoot: true, numero: "SJ 3.2.4" },
        { key: "CJ15", parent: "Sup4", name: "Apoio", desc: "Equipe de apoio às Sessões de Julgamento II", isRoot: false, numero: "SJ 3.2.4.1" },
        { key: "CJ16", parent: "Sup4", name: "Triagem", desc: "Equipe de Triagem e Agendamento II", isRoot: false, numero: "SJ 3.2.4.2" },
        { key: "CJ17", parent: "Sup4", name: "Cumprimento", desc: "Equipe de Cumprimento II", isRoot: false, numero: "SJ 3.2.4.3" }
      ],
      "Sup5": [
        { key: "Sup5", name: "Transição", isRoot: true, numero: "SJ 3.2.5" },
        { key: "CT6", parent: "Sup5", name: "Triagem", desc: "Equipe de Triagem", isRoot: false, numero: "SJ 3.2.5.1" },
        { key: "CT7", parent: "Sup5", name: "Intimação", desc: "Equipe de Intimação e Publicação", isRoot: false, numero: "SJ 3.2.5.2" },
        { key: "CT8", parent: "Sup5", name: "Cumprimento", desc: "Equipe de Cumprimento", isRoot: false, numero: "SJ 3.2.5.3" },
        { key: "CT9", parent: "Sup5", name: "Arquivamento", desc: "Equipe de Arquivamento e Apoio", isRoot: false, numero: "SJ 3.2.5.4" }
      ]
    };
  }
  let dados = chefiasDict[supKey];
  if (!dados) {
    dados = [{ key: "Vazio", name: "Nenhuma chefia encontrada", desc: "", isRoot: false }];
  }
  diagramaChefias.model = new go.TreeModel(dados);
  diagramaChefias.zoomToFit();
  document.getElementById("descricaoChefias").textContent = "";
}

export function getDiagramaChefias() {
  return diagramaChefias;
}

function abrirPainelConteudo() {
  document.getElementById("contentPanel").style.width = "300px";
}

function fecharPainelConteudo() {
  document.getElementById("contentPanel").style.width = "0";
}
window.fecharPainelConteudo = fecharPainelConteudo;

function atualizarPainelConteudo(chefiaData) {
  const panel = document.getElementById("contentPanel");
  panel.innerHTML = "";
  
  // Cria o array de botões; observe que para o botão de descrição não usaremos uma URL,
  // mas um identificador para disparar a abertura do modal.
  const links = [
    { texto: "Descrição Sumária do Serviço", action: "modal" },
    { texto: "Documento 2", url: "https://example.com/doc2?chefia=" + chefiaData.key }
  ];
  
  links.forEach(link => {
    const btn = document.createElement("button");
    btn.textContent = link.texto;
    btn.style.display = "block";
    btn.style.margin = "5px 0";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.style.backgroundColor = "#28a745";  // cor dos botões de documento
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    
    if (link.action === "modal") {
      // Ao clicar, abre a janela modal com a descrição da chefia
      btn.onclick = function(e) {
        e.stopPropagation();
        import('./modal.js').then(modal => {
          import('./chefiaTexts.js').then(texts => {
            modal.openModal(chefiaData, texts.chefiaTexts);
          });
        });
      }
    } else {
      btn.onclick = () => window.open(link.url, "_blank");
    }
    
    panel.appendChild(btn);
  });
}
