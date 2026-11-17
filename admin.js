import { auth, db } from "./firebase-config.js";
import { UID_PROPRIETARIO } from "./admin-config.js";
import { catalogoDemonstrativo } from "./produtos.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const telaLogin = document.getElementById("telaLogin");
const painelAdmin = document.getElementById("painelAdmin");
const formLogin = document.getElementById("formLogin");
const erroLogin = document.getElementById("erroLogin");
const formProduto = document.getElementById("formProduto");
const boxFormulario = document.getElementById("boxFormulario");
const listaAdmin = document.getElementById("listaAdmin");
const statusLista = document.getElementById("statusLista");
const avisoPainel = document.getElementById("avisoPainel");
const botaoImportar = document.getElementById("btnImportarIniciais");
const buscaAdmin = document.getElementById("buscaAdmin");
const campoImagens = document.getElementById("prodImagens");
const campoArquivos = document.getElementById("prodFotosArquivos");
const campoId = document.getElementById("prodId");
const previewRemocao = document.getElementById("rotuloRemoverFotos");
const checkboxRemoverFotos = document.getElementById("removerFotosBase64");
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

let produtosCache = [];
let imagensBase64Existentes = [];
let cancelarEscuta = null;

function mostrarMensagem(elemento, texto, tipo = "erro") {
  elemento.textContent = texto;
  elemento.dataset.tipo = tipo;
}

function erroFirebase(erro) {
  const mensagens = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/user-not-found": "Conta do proprietário não encontrada no Firebase.",
    "auth/wrong-password": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde e tente novamente.",
    "auth/network-request-failed": "Sem conexão com a internet. Tente novamente.",
    "permission-denied": "O Firebase negou o acesso. Confira as regras e o UID do proprietário.",
  };
  return mensagens[erro?.code] || erro?.message || "Não foi possível concluir a operação.";
}

function uidConfigurado() {
  return UID_PROPRIETARIO && UID_PROPRIETARIO !== "COLE_AQUI_O_UID_DO_PROPRIETARIO";
}

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  erroLogin.textContent = "";
  const botao = document.getElementById("btnEntrar");
  if (!uidConfigurado()) {
    mostrarMensagem(erroLogin, "Antes do primeiro acesso, configure o UID do proprietário em admin-config.js e firestore.rules.");
    return;
  }
  botao.disabled = true;
  botao.textContent = "Entrando...";
  try {
    const email = document.getElementById("emailAdmin").value.trim();
    const senha = document.getElementById("senhaAdmin").value;
    const credencial = await signInWithEmailAndPassword(auth, email, senha);
    if (credencial.user.uid !== UID_PROPRIETARIO) {
      await signOut(auth);
      mostrarMensagem(erroLogin, "Esta conta não tem permissão de proprietário.");
    }
  } catch (erro) {
    mostrarMensagem(erroLogin, erroFirebase(erro));
  } finally {
    botao.disabled = false;
    botao.textContent = "Entrar";
  }
});

onAuthStateChanged(auth, async (usuario) => {
  if (!usuario) {
    telaLogin.hidden = false;
    painelAdmin.hidden = true;
    if (cancelarEscuta) cancelarEscuta();
    cancelarEscuta = null;
    return;
  }
  if (!uidConfigurado() || usuario.uid !== UID_PROPRIETARIO) {
    await signOut(auth);
    telaLogin.hidden = false;
    mostrarMensagem(erroLogin, "Esta conta não tem permissão de proprietário.");
    return;
  }
  telaLogin.hidden = true;
  painelAdmin.hidden = false;
  iniciarEscutaProdutos();
  await atualizarEstadoCatalogo();
});

document.getElementById("btnSair").addEventListener("click", () => signOut(auth));

document.getElementById("btnNovoProduto").addEventListener("click", () => {
  limparFormulario();
  document.getElementById("tituloForm").textContent = "Cadastrar produto";
  boxFormulario.hidden = false;
  boxFormulario.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("btnFecharForm").addEventListener("click", () => {
  boxFormulario.hidden = true;
  limparFormulario();
});

function limparFormulario() {
  formProduto.reset();
  campoId.value = "";
  imagensBase64Existentes = [];
  previewRemocao.hidden = true;
  checkboxRemoverFotos.checked = false;
  document.getElementById("prodDisponivel").checked = true;
  document.getElementById("statusSalvar").textContent = "";
}

function obterImagens(produto) {
  const origem = produto.imagens ?? produto.imagem ?? [];
  return (Array.isArray(origem) ? origem : [origem]).filter(Boolean).map(String);
}

function slug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function imagemSegura(valor) {
  const imagem = String(valor || "").trim();
  if (
    imagem.startsWith("assets/") ||
    imagem.startsWith("data:image/jpeg;base64,") ||
    imagem.startsWith("data:image/png;base64,") ||
    imagem.startsWith("data:image/webp;base64,") ||
    /^https?:\/\//i.test(imagem)
  ) return imagem;
  return "assets/logo.png";
}

function editarProduto(produto) {
  limparFormulario();
  campoId.value = produto.id;
  document.getElementById("prodNome").value = produto.nome || "";
  document.getElementById("prodCategoria").value = produto.categoria || "Cabelo";
  document.getElementById("prodPreco").value = Number(produto.preco || 0).toFixed(2);
  document.getElementById("prodDescricao").value = produto.descricao || "";
  document.getElementById("prodDisponivel").checked = produto.disponivel !== false;
  const imagens = obterImagens(produto);
  imagensBase64Existentes = imagens.filter((imagem) => imagem.startsWith("data:image/"));
  campoImagens.value = imagens.filter((imagem) => !imagem.startsWith("data:image/")).join("\n");
  previewRemocao.hidden = imagensBase64Existentes.length === 0;
  document.getElementById("tituloForm").textContent = `Editar: ${produto.nome}`;
  boxFormulario.hidden = false;
  boxFormulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function comprimirImagem(arquivo) {
  if (!arquivo.type.startsWith("image/")) throw new Error("Selecione apenas arquivos de imagem.");
  const bitmap = await createImageBitmap(arquivo);
  const limite = 800;
  const escala = Math.min(1, limite / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * escala));
  canvas.height = Math.max(1, Math.round(bitmap.height * escala));
  const contexto = canvas.getContext("2d", { alpha: false });
  contexto.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.68);
}

formProduto.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const botao = document.getElementById("btnSalvarProduto");
  const status = document.getElementById("statusSalvar");
  botao.disabled = true;
  status.textContent = "Salvando...";
  try {
    const nome = document.getElementById("prodNome").value.trim();
    const categoria = document.getElementById("prodCategoria").value;
    const preco = Number(document.getElementById("prodPreco").value);
    const descricao = document.getElementById("prodDescricao").value.trim();
    const disponivel = document.getElementById("prodDisponivel").checked;
    const idExistente = campoId.value;
    const id = idExistente || slug(nome);
    if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error("Não foi possível criar um identificador válido para o produto.");
    }
    if (!Number.isFinite(preco) || preco <= 0) throw new Error("Informe um preço maior que zero.");
    if (!idExistente && produtosCache.some((produto) => produto.id === id)) {
      throw new Error("Já existe um produto com esse nome/identificador. Edite o existente ou escolha outro nome.");
    }

    const caminhos = campoImagens.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    for (const imagem of caminhos) {
      if (!imagem.startsWith("assets/") && !/^https?:\/\//i.test(imagem)) {
        throw new Error("Cada linha de imagem deve começar com assets/ ou ser um link http(s).");
      }
    }
    const imagensEnviadas = [];
    for (const arquivo of Array.from(campoArquivos.files || [])) {
      imagensEnviadas.push(await comprimirImagem(arquivo));
    }
    const preservadas = checkboxRemoverFotos.checked ? [] : imagensBase64Existentes;
    let imagens = [...preservadas, ...caminhos, ...imagensEnviadas];
    imagens = [...new Set(imagens)];
    const tamanhoCodificado = imagens.reduce((soma, imagem) => soma + imagem.length, 0);
    if (tamanhoCodificado > 700_000) {
      throw new Error("As fotos ficaram grandes para um único registro. Envie menos imagens ou use imagens menores.");
    }
    if (!imagens.length) imagens = ["assets/logo.png"];

    const dados = {
      id,
      nome,
      categoria,
      preco: preco.toFixed(2),
      descricao,
      imagens,
      imagem: imagens[0],
      disponivel,
      atualizadoEm: new Date().toISOString(),
    };
    await setDoc(doc(db, "produtos", id), dados);
    await setDoc(doc(db, "config", "catalogo"), { ativo: true }, { merge: true });
    boxFormulario.hidden = true;
    limparFormulario();
    mostrarMensagem(avisoPainel, "Produto salvo. O catálogo público usará os dados atualizados do banco.", "sucesso");
    status.textContent = "";
  } catch (erro) {
    console.error("Falha ao salvar produto:", erro);
    status.textContent = "";
    mostrarMensagem(avisoPainel, erroFirebase(erro));
  } finally {
    botao.disabled = false;
  }
});

async function atualizarEstadoCatalogo() {
  try {
    const [marcador, registros] = await Promise.all([
      getDoc(doc(db, "config", "catalogo")),
      getDocs(collection(db, "produtos")),
    ]);
    const ativo = marcador.exists() && marcador.data().ativo === true;
    botaoImportar.hidden = ativo;
    if (!ativo) {
      mostrarMensagem(
        avisoPainel,
        registros.empty
          ? "O catálogo ainda está usando os dados locais. Clique em “Publicar catálogo atual no banco” para ativar a edição online."
          : "Há produtos antigos no banco. Ao publicar, os produtos locais com o mesmo ID serão atualizados; itens extras continuarão na lista.",
        "aviso",
      );
      botaoImportar.textContent = registros.empty
        ? "Publicar catálogo atual no banco"
        : "Atualizar banco com catálogo recuperado";
    } else {
      avisoPainel.hidden = true;
    }
  } catch (erro) {
    botaoImportar.hidden = true;
    mostrarMensagem(avisoPainel, `Não consegui verificar o catálogo no Firebase: ${erroFirebase(erro)}`);
  }
}

botaoImportar.addEventListener("click", async () => {
  const quantidade = produtosCache.length;
  const confirmar = quantidade
    ? `Publicar os ${catalogoDemonstrativo.length} produtos recuperados? Os itens com IDs iguais serão atualizados; os outros produtos do banco serão mantidos.`
    : `Publicar os ${catalogoDemonstrativo.length} produtos do catálogo recuperado no banco?`;
  if (!window.confirm(confirmar)) return;
  botaoImportar.disabled = true;
  const textoOriginal = botaoImportar.textContent;
  botaoImportar.textContent = "Publicando catálogo...";
  try {
    const lote = writeBatch(db);
    for (const produto of catalogoDemonstrativo) {
      const imagens = obterImagens(produto);
      lote.set(
        doc(db, "produtos", produto.id),
        {
          ...produto,
          imagem: imagens[0] || "assets/logo.png",
          imagens,
          preco: Number(produto.preco).toFixed(2),
        },
        { merge: true },
      );
    }
    lote.set(doc(db, "config", "catalogo"), { ativo: true, atualizadoEm: new Date().toISOString() }, { merge: true });
    await lote.commit();
    await atualizarEstadoCatalogo();
    mostrarMensagem(avisoPainel, "Catálogo publicado. A página pública passará a carregar os produtos do Firebase.", "sucesso");
  } catch (erro) {
    mostrarMensagem(avisoPainel, `Não foi possível publicar o catálogo: ${erroFirebase(erro)}`);
  } finally {
    botaoImportar.disabled = false;
    if (!botaoImportar.hidden) botaoImportar.textContent = textoOriginal;
  }
});

function iniciarEscutaProdutos() {
  if (cancelarEscuta) cancelarEscuta();
  statusLista.textContent = "Carregando produtos...";
  const consulta = query(collection(db, "produtos"));
  cancelarEscuta = onSnapshot(
    consulta,
    (snapshot) => {
      produtosCache = snapshot.docs
        .map((registro) => ({ id: registro.id, ...registro.data() }))
        .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"));
      document.getElementById("contadorProdutos").textContent = String(produtosCache.length);
      statusLista.textContent = produtosCache.length
        ? "As alterações são salvas no banco e ficam disponíveis no catálogo público."
        : "Nenhum produto no banco. Publique o catálogo atual ou cadastre o primeiro produto.";
      renderizarListaAdmin();
    },
    (erro) => {
      statusLista.textContent = `Erro ao carregar os produtos: ${erroFirebase(erro)}`;
    },
  );
}

function renderizarListaAdmin() {
  const termo = buscaAdmin.value.trim().toLocaleLowerCase("pt-BR");
  const filtrados = produtosCache.filter((produto) =>
    `${produto.nome || ""} ${produto.categoria || ""}`.toLocaleLowerCase("pt-BR").includes(termo),
  );
  listaAdmin.replaceChildren();
  if (!filtrados.length) {
    const vazio = document.createElement("p");
    vazio.className = "sem-itens";
    vazio.textContent = termo ? "Nenhum produto corresponde à busca." : "Nenhum produto cadastrado.";
    listaAdmin.appendChild(vazio);
    return;
  }

  for (const produto of filtrados) {
    const imagens = obterImagens(produto);
    const card = document.createElement("article");
    card.className = "produto-admin";
    const imagem = document.createElement("img");
    imagem.src = imagemSegura(imagens[0] || "assets/logo.png");
    imagem.alt = produto.nome ? `Foto de ${produto.nome}` : "Foto do produto";
    imagem.loading = "lazy";
    const corpo = document.createElement("div");
    corpo.className = "produto-admin-corpo";
    const nome = document.createElement("h3");
    nome.textContent = produto.nome || "Produto sem nome";
    const categoria = document.createElement("span");
    categoria.className = "produto-admin-categoria";
    categoria.textContent = produto.categoria || "Sem categoria";
    const preco = document.createElement("strong");
    preco.className = "produto-admin-preco";
    preco.textContent = moeda.format(Number(produto.preco) || 0);
    const selo = document.createElement("span");
    const disponivel = produto.disponivel !== false;
    selo.className = `selo${disponivel ? "" : " indisponivel"}`;
    selo.textContent = disponivel ? "Disponível" : "Indisponível";
    const acoes = document.createElement("div");
    acoes.className = "acoes-produto";
    const editar = document.createElement("button");
    editar.type = "button";
    editar.dataset.acao = "editar";
    editar.dataset.id = produto.id;
    editar.textContent = "Editar";
    const status = document.createElement("button");
    status.type = "button";
    status.dataset.acao = "status";
    status.dataset.id = produto.id;
    status.textContent = disponivel ? "Marcar indisponível" : "Reativar";
    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.dataset.acao = "excluir";
    excluir.dataset.id = produto.id;
    excluir.textContent = "Excluir";
    excluir.setAttribute("aria-label", `Excluir ${produto.nome || "produto"}`);
    acoes.append(editar, status, excluir);
    corpo.append(nome, categoria, preco, selo, acoes);
    card.append(imagem, corpo);
    listaAdmin.appendChild(card);
  }
}

buscaAdmin.addEventListener("input", renderizarListaAdmin);

listaAdmin.addEventListener("click", async (evento) => {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) return;
  const produto = produtosCache.find((item) => item.id === botao.dataset.id);
  if (!produto) return;
  botao.disabled = true;
  try {
    if (botao.dataset.acao === "editar") {
      editarProduto(produto);
    } else if (botao.dataset.acao === "status") {
      await setDoc(doc(db, "produtos", produto.id), { ...produto, disponivel: produto.disponivel === false }, { merge: true });
    } else if (botao.dataset.acao === "excluir") {
      if (window.confirm(`Excluir “${produto.nome}” do catálogo?`)) {
        await deleteDoc(doc(db, "produtos", produto.id));
      }
    }
  } catch (erro) {
    mostrarMensagem(avisoPainel, `Não foi possível alterar o produto: ${erroFirebase(erro)}`);
  } finally {
    botao.disabled = false;
  }
});

campoArquivos.addEventListener("change", () => {
  const arquivo = campoArquivos.files?.[0];
  if (arquivo) mostrarMensagem(avisoPainel, `${campoArquivos.files.length} foto(s) selecionada(s). Serão comprimidas ao salvar.`, "aviso");
});
