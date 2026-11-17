// Configuração do Firebase usada pelo catálogo e pelo painel.
// A chave web é pública por natureza; a proteção real fica nas regras do Firestore.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0y7wROSqNCvdtX-VdKJXbR_hzt_0VMvU",
  authDomain: "barbearia-denilson.firebaseapp.com",
  projectId: "barbearia-denilson",
  storageBucket: "barbearia-denilson.firebasestorage.app",
  messagingSenderId: "648428190694",
  appId: "1:648428190694:web:af640d0bde69338e94f427"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
