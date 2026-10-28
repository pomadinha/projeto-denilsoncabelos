const formulario = document.getElementById("formPedido");
const aviso = document.getElementById("aviso");

// Formata os valores como moeda brasileira.
const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const selecionados = formulario.querySelectorAll(
    'input[name="produtos"]:checked',
  );

  if (selecionados.length === 0) {
    aviso.textContent = "Selecione pelo menos um produto.";
    return;
  }

  let totalCentavos = 0;
  const linhasPedido = [];

  for (const produto of selecionados) {
    const nome = produto.dataset.nome;
    const preco = Number(produto.value);

    // Confere os dados recebidos do HTML.
    if (!nome || !Number.isFinite(preco) || preco <= 0) {
      aviso.textContent = "Um produto está com nome ou preço inválido.";
      return;
    }

    const precoCentavos = Math.round(preco * 100);

    totalCentavos += precoCentavos;

    linhasPedido.push(`${nome} — ${moeda.format(precoCentavos / 100)}`);
  }

  aviso.textContent =
    linhasPedido.join(" | ") + ` | Total: ${moeda.format(totalCentavos / 100)}`;
});
