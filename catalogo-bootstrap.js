import { catalogoCarregado } from "./produtos.js";

// O pedido e os filtros só iniciam depois de os cards reais serem renderizados.
await catalogoCarregado;
await import("./script.js");
await import("./filtros.js");
