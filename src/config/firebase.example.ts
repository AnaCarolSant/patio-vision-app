// Este é um arquivo de exemplo. 
// Copie este arquivo para firebase.ts e substitua pelos seus dados reais do Firebase Console

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// EXEMPLO - Substitua pelas suas configurações reais do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Sua API Key aqui
  authDomain: "meu-projeto.firebaseapp.com", // Seu domínio aqui
  projectId: "meu-projeto", // ID do seu projeto aqui
  storageBucket: "meu-projeto.appspot.com", // Seu bucket aqui
  messagingSenderId: "123456789", // Seu sender ID aqui
  appId: "1:123456789:web:abcdef123456" // Seu app ID aqui
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
const auth = getAuth(app);

export { auth };
export default app;