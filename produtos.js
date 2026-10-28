"use strict";
// FONTE ÚNICA DOS PRODUTOS: dados demonstrativos, a substituir pelos reais.
// O estoque não é informado. disponivel indica apenas se o item aceita consultas.
const catalogoProdutos = [
  {
    id: "pomada",
    nome: "Pomada Modeladora",
    categoria: "Cabelo",
    preco: "35.00",
    imagem: "assets/pomada.svg",
    descricao: "Modele o penteado e leve seu estilo para a rotina.",
    uso: "Exemplo de uso: aplique uma pequena quantidade e modele. Confira as instruções do fabricante do produto real.",
    disponivel: true,
  },
  {
    id: "oleo",
    nome: "Óleo para Barba",
    categoria: "Barba",
    preco: "28.00",
    imagem: "assets/oleo.svg",
    descricao: "Um cuidado simples para acompanhar o seu visual.",
    uso: "Exemplo de uso: espalhe algumas gotas pelas mãos e distribua pela barba. Confira as instruções do fabricante do produto real.",
    disponivel: true,
  },
  {
    id: "balm",
    nome: "Balm para Barba",
    categoria: "Barba",
    preco: "32.00",
    imagem: "assets/balm.svg",
    descricao: "Complete seu ritual de cuidado e finalização.",
    uso: "Exemplo de uso: distribua uma pequena quantidade pela barba e modele. Confira as instruções do fabricante do produto real.",
    disponivel: true,
  },
];
// Escapa o conteúdo antes de compor os cards. Os dados permanecem editáveis aqui.
function escaparHTML(valor) {
  return String(valor).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
const gradeProdutos = document.getElementById("gradeProdutos");
gradeProdutos.innerHTML = catalogoProdutos
  .map((p, i) => {
    const id = escaparHTML(p.id),
      nome = escaparHTML(p.nome);
    const preco = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(p.preco));
    return `<article class="produto" data-categoria="${escaparHTML(p.categoria)}" data-busca="${nome}" aria-labelledby="titulo-${id}">
  <div class="produto-foto"><img src="${escaparHTML(p.imagem)}" alt="Embalagem ilustrativa de ${nome}" width="480" height="400" ${i ? 'loading="lazy"' : ""}><span class="numero-produto">0${i + 1}</span><span class="categoria">${escaparHTML(p.categoria)}</span></div>
  <div class="produto-corpo"><h3 id="titulo-${id}">${nome}</h3><p class="descricao">${escaparHTML(p.descricao)}</p><details><summary>Como usar</summary><p>${escaparHTML(p.uso)}</p></details>
  <div class="produto-preco"><strong>${preco}</strong><span>por unidade</span></div><p class="disponibilidade" id="disponibilidade-${id}">Disponibilidade a confirmar</p>
  <input hidden type="checkbox" name="produtos" id="${id}" value="${escaparHTML(p.preco)}" data-nome="${nome}" data-disponivel="${p.disponivel}" data-quantidade="quantidade-${id}">
  <div class="quantidade-linha"><label for="quantidade-${id}">Quantidade</label><div class="controle-quantidade"><button type="button" data-alterar="-1" data-produto="${id}" aria-label="Diminuir quantidade de ${nome}" disabled>−</button><input type="number" id="quantidade-${id}" aria-label="Quantidade de ${nome}" data-produto="${id}" min="0" max="25" step="1" value="0" inputmode="numeric" aria-describedby="disponibilidade-${id} limiteQuantidade"><button type="button" data-alterar="1" data-produto="${id}" aria-label="Aumentar quantidade de ${nome}">+</button></div></div></div></article>`;
  })
  .join("");
