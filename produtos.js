"use strict";
// FONTE ÚNICA DOS PRODUTOS: dados demonstrativos, a substituir pelos reais.
// O estoque não é informado. disponivel indica apenas se o item aceita consultas.
const catalogoProdutos = [
  {
    id: "gel-classea",
    nome: "ClasseA - Gel Cera Hidratante ",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/gclassea.jpg",
    descricao:
      "Gel cera para modelar e finalizar os cabelos. Uma opção prática para compor diferentes penteados na rotina de cuidados.",
    disponivel: true,
  },
  {
    id: "gel-cola",
    nome: "Gel Cola - Fixação Extra Forte",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/gelcola.jpg",
    descricao:
      "Gel para modelar os cabelos e ajudar a manter o penteado. A proposta de fixação extra forte atende quem busca mais firmeza na finalização.",
    disponivel: true,
  },
  {
    id: "maquina-kemei",
    nome: "Kemei - Máquina de Aparar Pelos",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/kemei.jpg",
    descricao:
      "Máquina Kemei para aparar pelos e auxiliar nos cuidados pessoais. Confira o modelo e as instruções do fabricante antes de usar.",
    disponivel: true,
  },
  {
    id: "maquina-comum",
    nome: "LT-808 - Máquina para Aparar Pelos",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/mcabelo.jpg",
    descricao:
      "Máquina para aparar pelos, indicada para complementar a rotina de cuidados pessoais. Consulte as informações do fabricante para conhecer os detalhes do modelo.",
    disponivel: true,
  },
  {
    id: "pomada-black",
    nome: "Fox For Men - Pasta Black Premium",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/pblack.jpg",
    descricao:
      "Pasta capilar para modelar e finalizar os cabelos. Pode ser usada para compor o penteado do dia a dia.",
    disponivel: true,
  },
  {
    id: "pomada-caramelo",
    nome: "Fox For Men - Cera Hair Caramelo",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/pcaramelo.png",
    descricao:
      "Cera capilar para ajudar a modelar e finalizar os cabelos. Uma alternativa para criar e ajustar o penteado.",
    disponivel: true,
  },
  {
    id: "pomada-gromming",
    nome: "Zoteri - Pomada Capilar Gromming",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/pgromming.jpg",
    descricao:
      "Pomada capilar para modelar e finalizar os fios. Consulte a embalagem para verificar as orientações de uso.",
    disponivel: true,
  },
  {
    id: "pomada-po",
    nome: "Zoteri - Pomada Capilar em Pó",
    categoria: "Cabelo",
    preco: "1.00",
    imagem: "assets/produtos/cabelo/ppo.jpg",
    descricao:
      "Pomada em pó para compor a finalização dos cabelos. Confira as instruções da embalagem antes de aplicar.",
    disponivel: true,
  },
  ///////////////////////////////////////////////
  {
    id: "beard-oil",
    nome: "Beard Oil - Óleo para Barba",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/beardoil.jpg",
    descricao:
      "Óleo para incluir na rotina de cuidados com a barba. Consulte a embalagem para conferir a forma de aplicação indicada.",
    disponivel: true,
  },
  {
    id: "ffmen-oil",
    nome: "Fox For Men - Óleo Para Barba",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/fmen.jpg",
    descricao:
      "Óleo para cuidados da barba, ideal para complementar a rotina diária. Siga as orientações do fabricante.",
    disponivel: true,
  },
  {
    id: "locaob",
    nome: "Zoteri - Loção para Barba",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/locaob.png",
    descricao:
      "Loção para integrar os cuidados com a barba. Consulte a embalagem para verificar as indicações e o modo de uso.",
    disponivel: true,
  },
  {
    id: "perfume-bc",
    nome: "Zoteri - Freedom Colônia Barba e Corpo",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/pbc.png",
    descricao:
      "Colônia para usar na barba e no corpo, conforme as orientações da embalagem.",
    disponivel: true,
  },
  {
    id: "pgromming",
    nome: "Zoteri - Pomada Gromming",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/pgromming.jpg",
    descricao:
      "Pomada para auxiliar na modelagem e finalização. Confira as indicações do fabricante para saber como usar.",
    disponivel: true,
  },
  {
    id: "pomadapo",
    nome: "Zoteri - Pomada em Pó",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/ppo.jpg",
    descricao:
      "Pomada em pó para complementar os cuidados e a finalização. Consulte as instruções da embalagem.",
    disponivel: true,
  },
  {
    id: "thedodger",
    nome: "The Dodger - Óleo para Barba",
    categoria: "Barba",
    preco: "1.00",
    imagem: "assets/produtos/barba/tdodger.jpg",
    descricao:
      "Óleo para cuidados da barba, pensado para fazer parte da rotina diária. Use conforme as orientações do fabricante.",
    disponivel: true,
  },
  ////////////////////////////////////////////////////////
  {
    id: "asl-turbo",
    nome: "ASL TURBO - Carregador Tipo C Lightning",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/asl-turbo.jpg",
    descricao:
      "Carregador com conexões Tipo C e Lightning para dispositivos compatíveis. Confira o conector do seu aparelho antes de comprar.",
    disponivel: true,
  },
  {
    id: "asl-uni",
    nome: "ASL TURBO - Carregador Universal",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/asl-uni.jpg",
    descricao:
      "Carregador universal para recarregar dispositivos compatíveis. Verifique o tipo de conexão e as especificações do aparelho.",
    disponivel: true,
  },
  {
    id: "caboc",
    nome: "Peining - Cabo Tipo C",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/caboc.jpg",
    descricao:
      "Cabo Peining com conexão Tipo C para dispositivos compatíveis. Confira a entrada do seu aparelho antes de comprar.",
    disponivel: true,
  },
  {
    id: "caboios",
    nome: "Peining - Cabo Tipo C Lightning",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/caboios.jpg",
    descricao:
      "Cabo Peining com conexões Tipo C e Lightning para aparelhos compatíveis. Verifique se os conectores correspondem ao seu dispositivo.",
    disponivel: true,
  },
  {
    id: "caboioshm",
    nome: "H'Maston - Cabo Tipo C Lightning",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/caboioshm.jpg",
    descricao:
      "Cabo H'Maston com conexões Tipo C e Lightning para aparelhos compatíveis. Confira a entrada do seu dispositivo antes de comprar.",
    disponivel: true,
  },
  {
    id: "cabom",
    nome: "Peining - Cabo Tipo Micro USB",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/cabom.jpg",
    descricao:
      "Cabo Peining com conector Micro USB para dispositivos compatíveis. Verifique o tipo de entrada do seu aparelho.",
    disponivel: true,
  },
  {
    id: "cbasike",
    nome: "Basike - Carregador Inteligente Duas Portas",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/cbasike.jpg",
    descricao:
      "Carregador Basike com duas portas para carregar dispositivos compatíveis. Confira a conexão e as especificações do aparelho antes de usar.",
    disponivel: true,
  },
  {
    id: "cgold",
    nome: "A'Gold - Carregador Rápido",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/cgold.jpg",
    descricao:
      "Carregador A’Gold para recarga de dispositivos compatíveis. Consulte a embalagem para verificar as especificações e a conexão adequada.",
    disponivel: true,
  },
  {
    id: "clelong",
    nome: "Lelong - Carregador Rápido",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/clelong.jpg",
    descricao:
      "Carregador Lelong para recarga de dispositivos compatíveis. Verifique as especificações do produto e do aparelho antes de conectar.",
    disponivel: true,
  },
  {
    id: "fonegold",
    nome: "A'Gold Plus - Fone de Ouvido",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/fonegold.jpg",
    descricao:
      "Fone de ouvido A'Gold Plus para ouvir músicas, vídeos e outros áudios. Confira o tipo de conexão e a compatibilidade com seu aparelho.",
    disponivel: true,
  },
  {
    id: "fonelelong",
    nome: "Lelong - Fone de Ouvido Estéreo",
    categoria: "Eletronicos",
    preco: "1.00",
    imagem: "assets/produtos/eletronicos/fonelelong.jpg",
    descricao:
      "Fone de ouvido estéreo Lelong para ouvir músicas, vídeos e outros áudios. Verifique a conexão compatível com seu dispositivo.",
    disponivel: true,
  },
  ///////////////////////////////////////////////////////
  {
    id: "cjahfreedom",
    nome: "Camisas JahFreedom",
    categoria: "Vestuario",
    preco: "1.00",
    imagens: [
      "assets/produtos/vestuario/camisasjf/1.jpg",
      "assets/produtos/vestuario/camisasjf/2.jpg",
      "assets/produtos/vestuario/camisasjf/3.jpg",
      "assets/produtos/vestuario/camisasjf/4.jpg",
      "assets/produtos/vestuario/camisasjf/5.jpg",
      "assets/produtos/vestuario/camisasjf/6.jpg",
      "assets/produtos/vestuario/camisasjf/7.jpg",
      "assets/produtos/vestuario/camisasjf/8.jpg",
      "assets/produtos/vestuario/camisasjf/9.jpg",
      "assets/produtos/vestuario/camisasjf/10.jpg",
      "assets/produtos/vestuario/camisasjf/11.jpg",
      "assets/produtos/vestuario/camisasjf/12.jpg",
      "assets/produtos/vestuario/camisasjf/13.jpg",
      "assets/produtos/vestuario/camisasjf/14.jpg",
      "assets/produtos/vestuario/camisasjf/15.jpg",
      "assets/produtos/vestuario/camisasjf/16.jpg",
      "assets/produtos/vestuario/camisasjf/17.jpg",
      "assets/produtos/vestuario/camisasjf/18.jpg",
      "assets/produtos/vestuario/camisasjf/19.jpg",
      "assets/produtos/vestuario/camisasjf/20.jpg",
      "assets/produtos/vestuario/camisasjf/21.jpg",
      "assets/produtos/vestuario/camisasjf/22.jpg",
      "assets/produtos/vestuario/camisasjf/23.jpg",
      "assets/produtos/vestuario/camisasjf/24.jpg",
      "assets/produtos/vestuario/camisasjf/25.jpg",
      "assets/produtos/vestuario/camisasjf/26.jpg",
    ],
    descricao: "Camisas da linha JahFreedom para andar no estilo.",

    disponivel: true,
  },
  {
    id: "bones",
    nome: "Boné(s)",
    categoria: "Vestuario",
    preco: "1.00",
    imagens: [
      "assets/produtos/vestuario/bones/bazul.jpg",
      "assets/produtos/vestuario/bones/bjf.jpg",
      "assets/produtos/vestuario/bones/bml.jpg",
      "assets/produtos/vestuario/bones/bvermelho.jpg",
      "assets/produtos/vestuario/bones/bvqjd.jpg",
    ],
    descricao: "Bonés diversificados para andar no estilo.",
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
    const imagens = (Array.isArray(p.imagens) ? p.imagens : [p.imagem]).filter(
      Boolean,
    );
    const id = escaparHTML(p.id),
      nome = escaparHTML(p.nome);
    const preco = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(p.preco));
    return `<article class="produto" data-categoria="${escaparHTML(p.categoria)}" data-busca="${nome}" aria-labelledby="titulo-${id}">
  <div class="produto-foto"><div class="galeria-fotos">
  ${imagens
    .map(
      (foto, indice) =>
        `<img src="${escaparHTML(foto)}" alt="${nome} - foto ${indice + 1}" width="480" height="400">`,
    )
    .join("")}
</div><span class="numero-produto">0${i + 1}</span><span class="categoria">${escaparHTML(p.categoria)}</span></div>
  <div class="produto-corpo"><h3 id="titulo-${id}">${nome}</h3><p class="descricao">${escaparHTML(p.descricao)}<div class="produto-preco"><strong>${preco}</strong><span>por unidade</span></div><p class="disponibilidade" id="disponibilidade-${id}">Disponibilidade a confirmar</p>
  <input hidden type="checkbox" name="produtos" id="${id}" value="${escaparHTML(p.preco)}" data-nome="${nome}" data-disponivel="${p.disponivel}" data-quantidade="quantidade-${id}">
  <div class="quantidade-linha"><label for="quantidade-${id}">Quantidade</label><div class="controle-quantidade"><button type="button" data-alterar="-1" data-produto="${id}" aria-label="Diminuir quantidade de ${nome}" disabled>−</button><input type="number" id="quantidade-${id}" aria-label="Quantidade de ${nome}" data-produto="${id}" min="0" max="25" step="1" value="0" inputmode="numeric" aria-describedby="disponibilidade-${id} limiteQuantidade"><button type="button" data-alterar="1" data-produto="${id}" aria-label="Aumentar quantidade de ${nome}">+</button></div></div></div></article>`;
  })
  .join("");
