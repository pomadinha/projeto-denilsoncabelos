const formulario = document.getElementById("formPedido");
const aviso = document.getElementById("aviso");
const numeroWhatsApp = "5599991059284";

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

  // Confere se o número foi configurado no formato esperado.
  if (!/^55[1-9]\d{9,10}$/.test(numeroWhatsApp)) {
    aviso.textContent =
      "Configure o número do WhatsApp no início do script.js.";
    return;
  }

  // Monta a mensagem com quebras de linha.
  const mensagem = [
    "Olá! Gostaria de pedir os seguintes produtos:",
    "",
    ...linhasPedido,
    "",
    `*Total: ${moeda.format(totalCentavos / 100)}*`,
    "",
    "Retirada e pagamento na barbearia.",
    "Pode confirmar a disponibilidade?",
  ].join("\n");

  // Prepara o texto para ser utilizado dentro de um link.
  const mensagemCodificada = encodeURIComponent(mensagem);

  const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

  // Abre o WhatsApp na mesma aba.
  window.location.href = linkWhatsApp;
});
