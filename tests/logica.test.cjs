// Testes da lógica sem instalar dependências. Execute: node tests/logica.test.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");

function iniciar({ indisponivel = false, preco = "35.00", codigo = source } = {}) {
  const elementos = {};
  const botoes = [];
  let destino = "";
  let foco = null;
  function elemento(dados = {}) {
    return {
      textContent: "", value: "0", checked: false, disabled: false,
      dataset: {}, children: [], eventos: {}, atributos: {},
      addEventListener(nome, fn) { this.eventos[nome] = fn; },
      setAttribute(nome, valor) { this.atributos[nome] = valor; },
      removeAttribute(nome) { delete this.atributos[nome]; },
      replaceChildren() { this.children = []; },
      append(...filhos) { this.children.push(...filhos); },
      appendChild(filho) { this.children.push(filho); },
      focus() { foco = this; },
      closest() { return this; },
      ...dados
    };
  }
  const produtos = ["pomada", "oleo", "balm"].map((id, i) => {
    elementos[`quantidade-${id}`] = elemento({ id: `quantidade-${id}`, type: "number", value: "0" });
    elementos[`disponibilidade-${id}`] = elemento();
    const checkbox = elemento({
      id, value: [preco, "28.00", "32.00"][i],
      dataset: { nome: ["Pomada Modeladora", "Óleo para Barba", "Balm para Barba"][i], disponivel: indisponivel && i === 2 ? "false" : "true", quantidade: `quantidade-${id}` }
    });
    elementos[id] = checkbox;
    for (const passo of [-1, 1]) botoes.push(elemento({ dataset: { produto: id, alterar: String(passo) } }));
    return checkbox;
  });
  for (const id of ["aviso", "totalPedido", "listaPedido", "quantidadePedido", "totalMobile", "unidadesMobile", "contadorNav"]) elementos[id] = elemento();
  const formulario = elementos.formPedido = elemento({
    contains() { return true; },
    querySelectorAll(seletor) {
      if (seletor === 'input[name="produtos"]') return produtos;
      if (seletor === 'button[data-alterar]') return botoes;
      throw new Error(`Seletor inesperado: ${seletor}`);
    },
    querySelector() { return Object.values(elementos).find(el => el.atributos["aria-invalid"] === "true"); }
  });
  const contexto = {
    Intl, console: { error() {} }, setTimeout: fn => fn(),
    document: { getElementById: id => elementos[id], createElement: () => elemento() },
    window: { location: { set href(valor) { destino = valor; } }, addEventListener() {} }
  };
  vm.createContext(contexto);
  vm.runInContext(codigo, contexto);
  return {
    elementos, produtos, botoes, contexto,
    get destino() { return destino; }, get foco() { return foco; },
    quantidade(id, valor) {
      const campo = elementos[`quantidade-${id}`];
      campo.value = valor;
      formulario.eventos.input({ target: campo });
    },
    clicar(id, passo) {
      const botao = botoes.find(b => b.dataset.produto === id && Number(b.dataset.alterar) === passo);
      if (!botao.disabled) formulario.eventos.click({ target: botao });
    },
    remover(id) { formulario.eventos.click({ target: elemento({ dataset: { remover: id } }) }); },
    enviar() { formulario.eventos.submit({ preventDefault() {} }); },
    limpar() { formulario.eventos.reset(); },
    total() { return elementos.totalPedido.textContent; }
  };
}

let app = iniciar();
assert.match(app.total(), /0,00/);
app.enviar();
assert.equal(app.destino, "");
assert.match(app.elementos.aviso.textContent, /pelo menos um/);
app.clicar("pomada", 1);
app.clicar("pomada", 1);
app.clicar("oleo", 1);
assert.match(app.total(), /98,00/);
assert.equal(app.elementos.contadorNav.textContent, "3");
assert.match(app.elementos.totalMobile.textContent, /98,00/);
assert.equal(app.elementos.listaPedido.children.length, 2);
app.enviar();
const url = new URL(app.destino);
assert.equal(url.hostname, "wa.me");
assert.equal(url.pathname, "/5599991059284");
const mensagem = url.searchParams.get("text");
assert.match(mensagem, /2 × Pomada Modeladora/);
assert.match(mensagem, /1 × Óleo para Barba/);
assert.match(mensagem, /98,00/);
assert.match(mensagem, /confirmar a disponibilidade/);
app.remover("oleo");
assert.match(app.total(), /70,00/);
assert.equal(app.elementos["quantidade-oleo"].value, "0");
app.limpar();
assert.match(app.total(), /0,00/);
assert.ok(app.produtos.every(p => !p.checked));

app = iniciar();
for (let i = 0; i < 30; i++) app.clicar("pomada", 1);
assert.equal(app.elementos["quantidade-pomada"].value, "25");
assert.match(app.total(), /875,00/);
for (const invalido of ["26", "-1", "1.5", "", "abc", "Infinity"]) {
  app = iniciar(); app.quantidade("pomada", invalido); app.enviar();
  assert.equal(app.total(), "—", invalido);
  assert.equal(app.destino, "", invalido);
  assert.equal(app.elementos["quantidade-pomada"].atributos["aria-invalid"], "true");
}
app = iniciar({ indisponivel: true });
assert.equal(app.elementos["quantidade-balm"].disabled, true);
app.clicar("balm", 1);
assert.match(app.total(), /0,00/);
assert.match(app.elementos["disponibilidade-balm"].textContent, /Indisponível/);
app = iniciar({ preco: "0.10" }); app.quantidade("pomada", "3");
assert.match(app.total(), /0,30/);
for (const preco of ["0", "-5", "35,00", "0.001", "999999999999999999999"]) {
  app = iniciar({ preco }); app.enviar(); assert.equal(app.destino, "");
  assert.match(app.elementos.aviso.textContent, /ajuste/);
}
app = iniciar({ codigo: source.replace('const numeroWhatsApp = "5599991059284"', 'const numeroWhatsApp = "invalido"') });
app.quantidade("pomada", "1"); app.enviar();
assert.equal(app.destino, ""); assert.match(app.elementos.aviso.textContent, /contato/);
app = iniciar(); app.quantidade("pomada", "0"); assert.equal(app.produtos[0].checked, false);
console.log("OK: seleção, totais, remoção, limpeza, limites, erros, disponibilidade manual e link WhatsApp.");
