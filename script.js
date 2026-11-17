"use strict";

// CONFIGURAÇÃO DO PROJETO. Estes valores não representam estoque.
const numeroWhatsApp = "5599991059284"; // 55 + DDD + telefone, sem símbolos.
const limitePorPedido = 25; // Máximo de unidades de cada produto por pedido.

const formulario = document.getElementById("formPedido");
const aviso = document.getElementById("aviso");
const totalPedido = document.getElementById("totalPedido");
const listaPedido = document.getElementById("listaPedido");
const quantidadePedido = document.getElementById("quantidadePedido");
const totalMobile = document.getElementById("totalMobile");
const unidadesMobile = document.getElementById("unidadesMobile");
const contadorNav = document.getElementById("contadorNav");
const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// Mapeia e confere o contrato HTML/JS uma vez, ao iniciar.
const produtos = [];
let erroConfiguracao = "";
try {
  if (!Number.isSafeInteger(limitePorPedido) || limitePorPedido < 1) {
    throw new Error("O limite por pedido precisa ser um inteiro positivo.");
  }
  const camposUsados = new Set();
  for (const checkbox of formulario.querySelectorAll(
    'input[name="produtos"]',
  )) {
    const campo = document.getElementById(checkbox.dataset.quantidade);
    const nome = checkbox.dataset.nome?.trim();
    if (
      !checkbox.id ||
      !nome ||
      !campo ||
      !formulario.contains(campo) ||
      campo.type !== "number" ||
      camposUsados.has(campo.id)
    ) {
      throw new Error(
        "Confira os IDs, nomes e campos de quantidade do catálogo.",
      );
    }
    if (!/^\d+(\.\d{1,2})?$/.test(checkbox.value)) {
      throw new Error(
        `Preço inválido para ${nome}. Use ponto e até duas casas decimais.`,
      );
    }
    const [reais, decimal = ""] = checkbox.value.split(".");
    const precoCentavos = Number(reais) * 100 + Number(decimal.padEnd(2, "0"));
    if (
      !Number.isSafeInteger(precoCentavos) ||
      precoCentavos <= 0 ||
      !Number.isSafeInteger(precoCentavos * limitePorPedido)
    ) {
      throw new Error(`Preço inválido para ${nome}.`);
    }
    if (!["true", "false"].includes(checkbox.dataset.disponivel)) {
      throw new Error(
        `Informe data-disponivel="true" ou "false" para ${nome}.`,
      );
    }
    camposUsados.add(campo.id);
    const indisponivel = checkbox.dataset.disponivel === "false";
    checkbox.disabled = indisponivel;
    campo.disabled = indisponivel;
    campo.min = "0";
    campo.max = String(limitePorPedido);
    campo.step = "1";
    if (indisponivel) campo.value = "0";
    const status = document.getElementById(`disponibilidade-${checkbox.id}`);
    if (status)
      status.textContent = indisponivel
        ? "Indisponível no momento"
        : "Disponibilidade a confirmar";
    produtos.push({
      id: checkbox.id,
      nome,
      precoCentavos,
      checkbox,
      campo,
      indisponivel,
    });
  }
  if (!produtos.length)
    throw new Error("Nenhum produto foi configurado no catálogo.");
} catch (erro) {
  erroConfiguracao = erro.message;
  console.error("Configuração do catálogo:", erro.message);
}

// A mesma validação e o mesmo cálculo atendem ao resumo e à finalização.
function obterPedido() {
  if (erroConfiguracao)
    throw new Error(
      "O catálogo precisa de um ajuste. Consulte o barbeiro diretamente.",
    );
  const itens = [];
  let totalCentavos = 0;
  let totalUnidades = 0;
  for (const produto of produtos) {
    if (produto.indisponivel) continue;
    const { campo, nome, precoCentavos } = produto;
    const quantidade = Number(campo.value);
    if (
      !/^\d+$/.test(campo.value) ||
      !Number.isSafeInteger(quantidade) ||
      quantidade < 0
    ) {
      campo.setAttribute("aria-invalid", "true");
      throw new Error(
        `Informe uma quantidade inteira entre 0 e ${limitePorPedido} para ${nome}.`,
      );
    }
    if (quantidade > limitePorPedido) {
      campo.setAttribute("aria-invalid", "true");
      throw new Error(
        `O limite é de ${limitePorPedido} unidades de ${nome} por pedido.`,
      );
    }
    if (quantidade === 0) continue;
    const subtotalCentavos = quantidade * precoCentavos;
    totalCentavos += subtotalCentavos;
    totalUnidades += quantidade;
    if (
      !Number.isSafeInteger(totalCentavos) ||
      !Number.isSafeInteger(totalUnidades)
    ) {
      throw new Error("Não foi possível calcular este pedido.");
    }
    itens.push({
      id: produto.id,
      nome,
      quantidade,
      precoCentavos,
      subtotalCentavos,
    });
  }
  return { itens, totalCentavos, totalUnidades };
}

function atualizarBotoes() {
  for (const produto of produtos) {
    const quantidade = Number(produto.campo.value);
    produto.checkbox.checked =
      !produto.indisponivel && produto.campo.value !== "" && quantidade > 0;
    formulario.querySelectorAll("button[data-alterar]").forEach((botao) => {
      if (botao.dataset.produto !== produto.id) return;
      botao.disabled =
        produto.indisponivel ||
        (Number(botao.dataset.alterar) < 0
          ? quantidade <= 0
          : quantidade >= limitePorPedido);
    });
  }
}

function atualizarResumo() {
  aviso.textContent = "";
  produtos.forEach((produto) => produto.campo.removeAttribute("aria-invalid"));
  atualizarBotoes();
  listaPedido.replaceChildren();
  try {
    const pedido = obterPedido();
    const total = moeda.format(pedido.totalCentavos / 100);
    totalPedido.textContent = total;
    if (totalMobile) totalMobile.textContent = total;
    if (contadorNav) contadorNav.textContent = String(pedido.totalUnidades);
    if (unidadesMobile)
      unidadesMobile.textContent = `${pedido.totalUnidades} unidade${pedido.totalUnidades === 1 ? "" : "s"}`;
    if (quantidadePedido)
      quantidadePedido.textContent =
        pedido.totalUnidades === 0
          ? "Nenhum produto selecionado"
          : `${pedido.totalUnidades} unidade${pedido.totalUnidades === 1 ? "" : "s"} · ${pedido.itens.length} produto${pedido.itens.length === 1 ? "" : "s"}`;

    if (!pedido.itens.length) {
      const li = document.createElement("li");
      li.className = "pedido-vazio";
      const simbolo = document.createElement("span");
      simbolo.textContent = "＋";
      simbolo.setAttribute("aria-hidden", "true");
      const detalhe = document.createElement("small");
      detalhe.textContent = "Adicione produtos para montar o pedido.";
      li.append(simbolo, "Seu cuidado começa por aqui.", detalhe);
      listaPedido.appendChild(li);
      return;
    }
    for (const item of pedido.itens) {
      // Nomes e valores são inseridos como texto, sem interpretar HTML.
      const li = document.createElement("li");
      li.className = "pedido-item";
      const titulo = document.createElement("div");
      titulo.className = "item-titulo";
      const nome = document.createElement("strong");
      nome.textContent = `${item.quantidade} × ${item.nome}`;
      const subtotal = document.createElement("span");
      subtotal.textContent = moeda.format(item.subtotalCentavos / 100);
      titulo.append(nome, subtotal);
      const detalhe = document.createElement("p");
      detalhe.className = "item-detalhe";
      detalhe.textContent = `${moeda.format(item.precoCentavos / 100)} por unidade`;
      const remover = document.createElement("button");
      remover.type = "button";
      remover.className = "remover";
      remover.dataset.remover = item.id;
      remover.textContent = "Remover";
      remover.setAttribute("aria-label", `Remover ${item.nome} do pedido`);
      li.append(titulo, detalhe, remover);
      listaPedido.appendChild(li);
    }
  } catch (erro) {
    totalPedido.textContent = "—";
    if (totalMobile) totalMobile.textContent = "—";
    if (contadorNav) contadorNav.textContent = "!";
    if (unidadesMobile) unidadesMobile.textContent = "Confira as quantidades";
    if (quantidadePedido)
      quantidadePedido.textContent = "Confira os dados do pedido";
    aviso.textContent = erro.message;
  }
}

// Digitação, setas do input e botões compartilham a atualização do resumo.
formulario.addEventListener("input", function (evento) {
  if (produtos.some((produto) => produto.campo === evento.target))
    atualizarResumo();
});
formulario.addEventListener("change", function (evento) {
  if (produtos.some((produto) => produto.campo === evento.target))
    atualizarResumo();
});
formulario.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button");
  if (!botao || !formulario.contains(botao)) return;
  const id = botao.dataset.produto || botao.dataset.remover;
  if (!id) return;
  const produto = produtos.find((item) => item.id === id);
  if (!produto || produto.indisponivel) return;
  if (botao.dataset.remover) {
    produto.campo.value = "0";
    atualizarResumo();
    produto.campo.focus();
    return;
  }
  const passo = Number(botao.dataset.alterar);
  if (passo !== 1 && passo !== -1) return;
  const atual = Number(produto.campo.value);
  const base = Number.isSafeInteger(atual) ? atual : 0;
  produto.campo.value = String(
    Math.min(limitePorPedido, Math.max(0, base + passo)),
  );
  atualizarResumo();
});
formulario.addEventListener("reset", function () {
  setTimeout(function () {
    produtos.forEach((produto) => {
      produto.campo.value = "0";
    });
    atualizarResumo();
  }, 0);
});

// Finalização mantida em um único fluxo, como definido no projeto.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  atualizarResumo();
  try {
    const pedido = obterPedido();
    if (!pedido.itens.length) {
      aviso.textContent =
        "Escolha a quantidade de pelo menos um produto para continuar.";
      produtos.find((produto) => !produto.indisponivel)?.campo.focus();
      return;
    }
    // Confere formato, não a existência de uma conta no WhatsApp.
    if (!/^55[1-9]\d{9,10}$/.test(numeroWhatsApp)) {
      throw new Error(
        "O contato da barbearia precisa ser corrigido. Consulte o barbeiro diretamente.",
      );
    }
    const linhasPedido = pedido.itens.map(
      (item) =>
        `• ${item.quantidade} × ${item.nome} — ${moeda.format(item.subtotalCentavos / 100)} (${moeda.format(item.precoCentavos / 100)} cada)`,
    );
    const mensagem = [
      "Olá, Denilson! Consultei o catálogo e gostaria destes produtos:",
      "",
      ...linhasPedido,
      "",
      `*Total estimado: ${moeda.format(pedido.totalCentavos / 100)}*`,
      "",
      "Retirada e pagamento na barbearia. Pode confirmar a disponibilidade?",
    ].join("\n");
    aviso.textContent =
      "Abrindo o WhatsApp. Confira a mensagem e toque em enviar.";
    // Não envia automaticamente, não reserva e não desconta estoque.
    window.location.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  } catch (erro) {
    aviso.textContent = erro.message;
    formulario.querySelector('input[aria-invalid="true"]')?.focus();
  }
});

atualizarResumo();
// Sincroniza os valores que o navegador restaurar ao voltar do WhatsApp.
window.addEventListener("pageshow", atualizarResumo);
