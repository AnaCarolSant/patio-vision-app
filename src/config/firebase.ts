import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
// IMPORTANTE: Substitua essas configurações pelas suas próprias do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD9P0FGQGjVvRXkOUG6VYlWm2tCAhMIBXY",
  authDomain: "patio-vision.firebaseapp.com",
  projectId: "patio-vision",
  storageBucket: "patio-vision.firebasestorage.app",
  messagingSenderId: "73005739351",
  appId: "1:73005739351:web:0f8653516927500e78e212",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
const auth = getAuth(app);

export { auth };
export default app;