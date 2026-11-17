import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0y7wROSqNCvdtX-VdKJXbR_hzt_0VMvU",
  authDomain: "barbearia-denilson.firebaseapp.com",
  projectId: "barbearia-denilson",
  storageBucket: "barbearia-denilson.firebasestorage.app",
  messagingSenderId: "648428190694",
  appId: "1:648428190694:web:af640d0bde69338e94f427"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);