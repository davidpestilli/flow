// modal.js
export function openModal(chefiaData, chefiaTexts) {
    // Seleciona os elementos do modal
    const modal = document.getElementById("modalWindow");
    const modalBody = document.getElementById("modalBody");
    const modalButton = document.getElementById("modalButton");
  
    // Busca o texto específico da chefia, se disponível
    const texto = chefiaTexts[chefiaData.key] || "Sem descrição disponível para esta chefia.";
    modalBody.innerHTML = `<p>${texto}</p>`;
  
    // Configura o botão para abrir o link respectivo, se houver
    if (chefiaData.link) {
      modalButton.style.display = "block";
      modalButton.onclick = () => window.open(chefiaData.link, "_blank");
    } else {
      modalButton.style.display = "none";
    }
    
    modal.style.display = "block";
  }
  
  export function closeModal() {
    console.log("Fechando modal e ocultando botão");

    const modal = document.getElementById("modalWindow");
    modal.style.display = "none";

    // Oculta o botão "Conteúdo"
    const btnConteudo = document.getElementById("btnConteudo");
    if (btnConteudo) {
        btnConteudo.style.display = "none";
    }
}

// Torna a função globalmente acessível (caso seja chamada dinamicamente)
window.closeModal = closeModal;
