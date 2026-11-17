const busca = document.getElementById("busca");
const limparBusca = document.getElementById("limparBusca");
const filtros = document.getElementById("filtros");
const semResultados = document.getElementById("semResultados");
const resultadoBusca = document.getElementById("resultadoBusca");
let categoriaAtiva = "todos";

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function filtrarProdutos() {
  const cards = Array.from(document.querySelectorAll(".produto"));
  const termo = normalizar(busca.value);
  let quantidade = 0;

  for (const card of cards) {
    const corresponde =
      (categoriaAtiva === "todos" ||
        card.dataset.categoria === categoriaAtiva) &&
      normalizar(card.dataset.busca).includes(termo);
    card.hidden = !corresponde;
    if (corresponde) quantidade++;
  }

  filtros
    .querySelectorAll("button[data-categoria]")
    .forEach((botao) =>
      botao.setAttribute(
        "aria-pressed",
        String(botao.dataset.categoria === categoriaAtiva),
      ),
    );
  limparBusca.hidden = !busca.value;
  semResultados.hidden = cards.length === 0 || quantidade !== 0;
  resultadoBusca.textContent = `${quantidade} produto${quantidade === 1 ? "" : "s"} encontrado${quantidade === 1 ? "" : "s"}.`;
}

busca.addEventListener("input", filtrarProdutos);
limparBusca.addEventListener("click", function () {
  busca.value = "";
  filtrarProdutos();
  busca.focus();
});
filtros.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button[data-categoria]");
  if (!botao || !filtros.contains(botao)) return;
  categoriaAtiva = botao.dataset.categoria;
  filtrarProdutos();
});
document.getElementById("mostrarTodos").addEventListener("click", function () {
  categoriaAtiva = "todos";
  busca.value = "";
  filtrarProdutos();
  busca.focus();
});
document.getElementById("formPedido").addEventListener("reset", function () {
  setTimeout(function () {
    categoriaAtiva = "todos";
    busca.value = "";
    filtrarProdutos();
  }, 0);
});

document.addEventListener("catalogo:atualizado", filtrarProdutos);