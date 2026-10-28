const formulario = document.getElementById("formPedido");
const aviso = document.getElementById("aviso");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const selecionados = formulario.querySelectorAll(
    'input[name="produtos"]:checked'
  );

  if (selecionados.length === 0) {
    aviso.textContent = "Selecione pelo menos um produto.";
    return;
  }

  aviso.textContent =
    `${selecionados.length} produto(s) selecionado(s).`;
});