// Configuração do Firebase usada pelo catálogo e pelo painel.
// A chave web é pública por natureza; a proteção real fica nas regras do Firestore.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjPxlES97Ko8JpUrDWeuE_Z_hI_tqECKU",
  authDomain: "db-denilsoncabelos.firebaseapp.com",
  projectId: "db-denilsoncabelos",
  storageBucket: "db-denilsoncabelos.firebasestorage.app",
  messagingSenderId: "134741865136",
  appId: "1:134741865136:web:df034f2a4ced8dccf60175",
  measurementId: "G-FS8M4BDDZJ",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
