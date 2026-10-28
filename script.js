const numeroWhatsApp = "5599991059284"; //numero de denilson

const formulario = document.getElementById("formPedido");
const aviso = document.getElementById("aviso");
const totalPedido = document.getElementById("totalPedido");
const listaPedido = document.getElementById("listaPedido");

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// Lê a seleção e calcula o total.
// Fica fora do submit para ser usada também no evento change.
function obterPedido() {
  const selecionados = formulario.querySelectorAll(
    'input[name="produtos"]:checked',
  );

  const itens = [];
  let totalCentavos = 0;

  for (const produto of selecionados) {
    const nome = produto.dataset.nome?.trim();
    const preco = Number(produto.value);

    if (!nome || !Number.isFinite(preco) || preco <= 0) {
      throw new Error("Um produto está com nome ou preço inválido.");
    }

    const precoCentavos = Math.round(preco * 100);

    itens.push({ nome, precoCentavos });
    totalCentavos += precoCentavos;
  }

  return { itens, totalCentavos };
}

// Mostra o total na página.
function atualizarResumo() {
  aviso.textContent = "";

  // Remove os itens exibidos anteriormente.
  listaPedido.replaceChildren();

  try {
    const pedido = obterPedido();

    totalPedido.textContent = moeda.format(pedido.totalCentavos / 100);

    if (pedido.itens.length === 0) {
      const itemLista = document.createElement("li");

      itemLista.textContent = "Nenhum produto selecionado.";
      listaPedido.appendChild(itemLista);
      return;
    }

    for (const item of pedido.itens) {
      const itemLista = document.createElement("li");

      itemLista.textContent = `${item.nome} — ${moeda.format(
        item.precoCentavos / 100,
      )}`;

      listaPedido.appendChild(itemLista);
    }
  } catch (erro) {
    totalPedido.textContent = "—";
    aviso.textContent = erro.message;
  }
}

// Atualiza quando o cliente marca ou desmarca um produto.
formulario.addEventListener("change", atualizarResumo);
formulario.addEventListener("reset", function () {
  // Aguarda o navegador desmarcar os checkboxes.
  setTimeout(atualizarResumo, 0);
});

// Monta o pedido e abre o WhatsApp.
// Recebe o pedido e devolve a mensagem pronta.
function montarMensagem(pedido) {
  const linhasPedido = pedido.itens.map(function (item) {
    const precoFormatado = moeda.format(item.precoCentavos / 100);

    return `• ${item.nome} — ${precoFormatado}`;
  });

  const totalFormatado = moeda.format(pedido.totalCentavos / 100);

  return [
    "Olá! Gostaria de pedir os seguintes produtos:",
    "",
    ...linhasPedido,
    "",
    `*Total: ${totalFormatado}*`,
    "",
    "Retirada e pagamento na barbearia. Pode confirmar a disponibilidade?",
  ].join("\n");
}

// Valida o pedido e abre o WhatsApp.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  aviso.textContent = "";

  try {
    const pedido = obterPedido();

    if (pedido.itens.length === 0) {
      aviso.textContent = "Selecione pelo menos um produto.";
      return;
    }

    if (!/^55[1-9]\d{9,10}$/.test(numeroWhatsApp)) {
      aviso.textContent =
        "Configure o número do WhatsApp no início do script.js.";
      return;
    }

    const mensagem = montarMensagem(pedido);

    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensagem,
    )}`;

    window.location.href = linkWhatsApp;
  } catch (erro) {
    aviso.textContent = erro.message;
  }
});

// Atualiza o resumo ao carregar a página.
atualizarResumo();

const mensagem = montarMensagem(pedido);
