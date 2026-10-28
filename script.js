// CONFIGURAÇÃO: informe 55 + DDD + número, somente dígitos.
// Deixe vazio para testar a prévia sem abrir o WhatsApp.
const NUMERO_WHATSAPP = "";

const formulario = document.getElementById("formPedido");
const totalElemento = document.getElementById("totalPedido");
const lista = document.getElementById("listaPedido");
const aviso = document.getElementById("aviso");
const previa = document.getElementById("previa");
const mensagemElemento = document.getElementById("mensagemPedido");
const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatarMoeda(centavos) {
  return moeda.format(centavos / 100);
}

function obterPedido() {
  const marcados = formulario.querySelectorAll(
    'input[name="produtos"]:checked',
  );
  return Array.from(marcados).map((checkbox) => {
    // O HTML usa ponto decimal; a conta usa centavos inteiros.
    if (!/^\d+(\.\d{1,2})?$/.test(checkbox.value)) {
      throw new Error(
        "Um produto está com preço inválido. Avise o responsável pelo catálogo.",
      );
    }
    const centavos = Math.round(Number(checkbox.value) * 100);
    const nome = checkbox.dataset.nome?.trim();
    if (!nome || !Number.isSafeInteger(centavos) || centavos <= 0) {
      throw new Error("Confira o nome e o preço dos produtos no HTML.");
    }
    return { nome, centavos };
  });
}

function calcularTotal(itens) {
  const total = itens.reduce((soma, item) => soma + item.centavos, 0);
  if (!Number.isSafeInteger(total))
    throw new Error("O total do pedido é inválido.");
  return total;
}

function atualizarResumo() {
  aviso.textContent = "";
  previa.hidden = true;
  mensagemElemento.textContent = "";
  try {
    const itens = obterPedido();
    const total = calcularTotal(itens);
    lista.replaceChildren();
    const linhas = itens.length
      ? itens.map(
          (item) => `1 × ${item.nome} — ${formatarMoeda(item.centavos)}`,
        )
      : ["Nenhum produto selecionado."];
    linhas.forEach((texto) => {
      const li = document.createElement("li");
      li.textContent = texto;
      lista.appendChild(li);
    });
    totalElemento.textContent = formatarMoeda(total);
  } catch (erro) {
    aviso.textContent = erro.message;
    totalElemento.textContent = "—";
  }
}

formulario.addEventListener("change", atualizarResumo);
// O navegador restaura os checkboxes depois do evento reset.
formulario.addEventListener("reset", () => setTimeout(atualizarResumo, 0));

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault(); // Impede o recarregamento da página.
  try {
    const itens = obterPedido();
    if (itens.length === 0) {
      aviso.textContent = "Selecione pelo menos um produto para continuar.";
      formulario.querySelector('input[name="produtos"]').focus();
      return;
    }
    const total = calcularTotal(itens);
    const mensagem = [
      "Olá! Gostaria de pedir os seguintes produtos:",
      "",
      ...itens.map(
        (item) => `• 1 × ${item.nome} — ${formatarMoeda(item.centavos)}`,
      ),
      "",
      `*Total: ${formatarMoeda(total)}*`,
      "",
      "Retirada e pagamento na barbearia.",
      "Pode confirmar a disponibilidade, por favor?",
    ].join("\n");
    mensagemElemento.textContent = mensagem;
    previa.hidden = false;
    if (!NUMERO_WHATSAPP) {
      aviso.textContent =
        "Modo de demonstração: confira a mensagem abaixo. Para abrir o WhatsApp, configure NUMERO_WHATSAPP no script.js.";
      return;
    }
    if (!/^55[1-9]\d{9,10}$/.test(NUMERO_WHATSAPP)) {
      aviso.textContent =
        "Configure o número com 55 + DDD + telefone, sem espaços ou símbolos.";
      return;
    }
    // A mensagem é preenchida; o cliente ainda precisa tocar em Enviar.
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    window.location.assign(url);
  } catch (erro) {
    aviso.textContent = erro.message;
  }
});
atualizarResumo();
