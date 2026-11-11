"use strict";
// FONTE ÚNICA DOS PRODUTOS: dados demonstrativos, a substituir pelos reais.
// O estoque não é informado. disponivel indica apenas se o item aceita consultas.
const catalogoProdutos = [
  {
    id: "gel-classea",
    nome: "Gel Cera Hidratante Classe A",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/gclassea.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "gel-cola",
    nome: "Gel Cola",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/gelcola.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "maquina-kemei",
    nome: "Máquina Kemei",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/kemei.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "maquina-comum",
    nome: "Máquina LT-808",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/mcabelo.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "pomada-black",
    nome: "Pasta Black Premium",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/pblack.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "pomada-caramelo",
    nome: "Cera Hair Caramelo",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/pcaramelo.png",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "pomada-gromming",
    nome: "Pomada Gromming",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/pgromming.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "pomada-po",
    nome: "Pomada em Pó",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/ppo.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  /////////////////////////////////////////////////
  {
    id: "beard-oil",
    nome: "Beard Oil - Óleo para Barba",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/beardoil.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "ffmen-oil",
    nome: "Fox For Men - Óleo para Barba",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/locaob.png",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "locaob",
    nome: "Zoteri - Loção para Barba",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/fmen.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "perfume-bc",
    nome: "Zoteri - Freedom Colônia Barba e Corpo",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/pbc.png",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "pgromming",
    nome: "Zoteri - Pomada Gromming",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/pgromming.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "pomadapo",
    nome: "Zoteri - Pomada em Pó",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/ppo.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  {
    id: "thedodger",
    nome: "The Dodger - Óleo para Barba",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/thedodger.jpg",
    descricao: "...",
    uso: "...",
    disponivel: true,
  },
  ////////////////////////////////////////////////////////
  {
    id: "testeproduto",
    nome: "teste de produto",
    categoria: "Camisas",
    preco: "1.00",
    imagem: "assets/",
    descricao: "Complete seu teste de teste e teste.",
    uso: "Exemplo de uso: distribua um pequeno teste pelo teste e modele. Confira as instruções do fabricante do produto real.",
    disponivel: true,
  },
  /////////////////////////////////////////////////////////
  {
    id: "testeproduto",
    nome: "teste de produto",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/",
    descricao: "Complete seu teste de teste e teste.",
    uso: "Exemplo de uso: distribua um pequeno teste pelo teste e modele. Confira as instruções do fabricante do produto real.",
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
