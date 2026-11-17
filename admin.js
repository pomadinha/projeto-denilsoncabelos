import { db } from "./firebase-config.js";
import { catalogoDemonstrativo } from "./produtos.js";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const SENHA_ADMIN = "123456"; // Altere aqui quando quiser trocar a senha

const telaLogin = document.getElementById("telaLogin");
const painelAdmin = document.getElementById("painelAdmin");
const formLogin = document.getElementById("formLogin");
const erroLogin = document.getElementById("erroLogin");

const boxFormulario = document.getElementById("boxFormulario");
const formProduto = document.getElementById("formProduto");
const listaAdmin = document.getElementById("listaAdmin");
const btnImportarIniciais = document.getElementById("btnImportarIniciais");

let imagemAtualBase64 = "";
let produtosCache = [];

// Autenticação simples via sessionStorage
if (sessionStorage.getItem("denilson_admin") === "ok") {
  liberarPainel();
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const senha = document.getElementById("senhaAdmin").value;
  if (senha === SENHA_ADMIN) {
    sessionStorage.setItem("denilson_admin", "ok");
    liberarPainel();
  } else {
    erroLogin.textContent = "Senha incorreta. Tente novamente.";
  }
});

function liberarPainel() {
  telaLogin.hidden = true;
  painelAdmin.hidden = false;
  iniciarEscutaProdutos();
}

// Compressão de Imagem via HTML5 Canvas (máx 600px, JPEG 70%)
function comprimirImagem(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxLargura = 600;
        let largura = img.width;
        let altura = img.height;
        if (largura > maxLargura) {
          altura = Math.round((altura * maxLargura) / largura);
          largura = maxLargura;
        }
        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, largura, altura);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    leitor.onerror = reject;
    leitor.readAsDataURL(arquivo);
  });
}

document.getElementById("prodFoto").addEventListener("change", async (e) => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  try {
    imagemAtualBase64 = await comprimirImagem(arquivo);
    document.getElementById("previewFoto").src = imagemAtualBase64;
  } catch (err) {
    alert("Não foi possível processar esta imagem.");
  }
});

// Controles do Formulário
document.getElementById("btnNovoProduto").addEventListener("click", () => {
  formProduto.reset();
  document.getElementById("prodId").value = "";
  document.getElementById("tituloForm").textContent = "Cadastrar Novo Produto";
  document.getElementById("previewFoto").src = "assets/logo.png";
  imagemAtualBase64 = "";
  boxFormulario.hidden = false;
  boxFormulario.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("btnFecharForm").addEventListener("click", () => {
  boxFormulario.hidden = true;
});

// Salvar (Criar ou Editar) no Firestore
formProduto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btnSalvar = document.getElementById("btnSalvarProduto");
  const status = document.getElementById("statusSalvar");
  btnSalvar.disabled = true;
  status.textContent = "Salvando na nuvem...";

  const id = document.getElementById("prodId").value;
  const dados = {
    nome: document.getElementById("prodNome").value.trim(),
    categoria: document.getElementById("prodCategoria").value,
    preco: Number(document.getElementById("prodPreco").value).toFixed(2),
    descricao: document.getElementById("prodDescricao").value.trim(),
    uso: document.getElementById("prodUso").value.trim(),
    disponivel: document.getElementById("prodDisponivel").checked,
  };

  if (imagemAtualBase64) {
    dados.imagem = imagemAtualBase64;
  }

  try {
    if (id) {
      await updateDoc(doc(db, "produtos", id), dados);
    } else {
      if (!dados.imagem) dados.imagem = "assets/logo.png";
      await addDoc(collection(db, "produtos"), dados);
    }
    boxFormulario.hidden = true;
    formProduto.reset();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar no Firebase: " + erro.message);
  } finally {
    btnSalvar.disabled = false;
    status.textContent = "";
  }
});

// Importar os 26 produtos iniciais do projeto para o Firebase
btnImportarIniciais.addEventListener("click", async () => {
  btnImportarIniciais.disabled = true;
  btnImportarIniciais.textContent = "Importando produtos...";
  try {
    for (const item of catalogoDemonstrativo) {
      const { id, ...dados } = item;
      await setDoc(doc(db, "produtos", id), dados);
    }
    alert("Todos os produtos iniciais foram enviados para o Firebase!");
  } catch (erro) {
    alert("Erro na importação: " + erro.message);
  } finally {
    btnImportarIniciais.disabled = false;
    btnImportarIniciais.textContent = "Importar Produtos Iniciais para Nuvem";
  }
});

// Listagem e Ações Rápidas (Alternar Estoque, Editar, Excluir)
function iniciarEscutaProdutos() {
  const q = query(collection(db, "produtos"), orderBy("nome"));
  onSnapshot(q, (snapshot) => {
    btnImportarIniciais.hidden = !snapshot.empty;
    produtosCache = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderizarListaAdmin();
  });
}

function renderizarListaAdmin() {
  if (!produtosCache.length) {
    listaAdmin.innerHTML = `<p class="text-muted">Nenhum produto salvo no banco ainda. Clique em <strong>Importar Produtos Iniciais</strong> ou em <strong>+ Novo Produto</strong>.</p>`;
    return;
  }

  listaAdmin.innerHTML = produtosCache
    .map((p) => {
      const precoFmt = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(p.preco));
      const disponivel = p.disponivel !== false;

      return `
      <article class="produto" style="opacity: ${disponivel ? 1 : 0.65}">
        <div class="produto-foto">
          <img src="${p.imagem || "assets/logo.png"}" alt="${p.nome}">
          <span class="categoria">${p.categoria}</span>
        </div>
        <div class="produto-corpo">
          <h3>${p.nome}</h3>
          <div class="produto-preco mb-2">
            <strong>${precoFmt}</strong>
            <span class="badge ${disponivel ? "bg-success" : "bg-danger"}">
              ${disponivel ? "Disponível" : "Indisponível"}
            </span>
          </div>
          <div class="d-flex flex-wrap gap-2 mt-auto pt-2 border-top">
            <button type="button" class="btn btn-sm btn-outline-dark flex-fill" data-acao="editar" data-id="${p.id}">Editar</button>
            <button type="button" class="btn btn-sm ${disponivel ? "btn-outline-warning" : "btn-outline-success"} flex-fill" data-acao="status" data-id="${p.id}">
              ${disponivel ? "Marcar Esgotado" : "Reativar"}
            </button>
            <button type="button" class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${p.id}">✕</button>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

listaAdmin.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-acao]");
  if (!btn) return;
  const id = btn.dataset.id;
  const acao = btn.dataset.acao;
  const prod = produtosCache.find((item) => item.id === id);
  if (!prod) return;

  if (acao === "editar") {
    document.getElementById("prodId").value = prod.id;
    document.getElementById("prodNome").value = prod.nome;
    document.getElementById("prodCategoria").value = prod.categoria;
    document.getElementById("prodPreco").value = prod.preco;
    document.getElementById("prodDescricao").value = prod.descricao || "";
    document.getElementById("prodUso").value = prod.uso || "";
    document.getElementById("prodDisponivel").checked = prod.disponivel !== false;
    document.getElementById("previewFoto").src = prod.imagem || "assets/logo.png";
    imagemAtualBase64 = "";
    document.getElementById("tituloForm").textContent = `Editando: ${prod.nome}`;
    boxFormulario.hidden = false;
    boxFormulario.scrollIntoView({ behavior: "smooth" });
  } else if (acao === "status") {
    await updateDoc(doc(db, "produtos", id), {
      disponivel: !(prod.disponivel !== false),
    });
  } else if (acao === "excluir") {
    if (confirm(`Tem certeza que deseja excluir "${prod.nome}"?`)) {
      await deleteDoc(doc(db, "produtos", id));
    }
  }
});