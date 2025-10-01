import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "operator" | "admin";
}

export class FirebaseAuthService {
  
  // Registrar novo usuário
  static async register(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Atualizar o perfil do usuário com o nome
      await updateProfile(user, {
        displayName: name
      });
      
      // Retornar dados do usuário formatados
      return {
        id: user.uid,
        name: name,
        email: user.email || '',
        role: 'operator' // Por padrão, novos usuários são operadores
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }
  
  // Fazer login
  static async login(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        id: user.uid,
        name: user.displayName || 'Usuário',
        email: user.email || '',
        role: 'operator' // Por enquanto, todos são operadores
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }
  
  // Fazer logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }
  
  // Observar mudanças no estado de autenticação
  static onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          role: 'operator'
        };
        callback(authUser);
      } else {
        callback(null);
      }
    });
  }
  
  // Obter usuário atual
  static getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    if (user) {
      return {
        id: user.uid,
        name: user.displayName || 'Usuário',
        email: user.email || '',
        role: 'operator'
      };
    }
    return null;
  }
  
  // Tratar erros de autenticação
  private static handleAuthError(error: any): Error {
    let message = 'Erro desconhecido';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Este e-mail já está sendo usado por outra conta.';
        break;
      case 'auth/weak-password':
        message = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
        break;
      case 'auth/invalid-email':
        message = 'E-mail inválido.';
        break;
      case 'auth/user-not-found':
        message = 'Usuário não encontrado.';
        break;
      case 'auth/wrong-password':
        message = 'Senha incorreta.';
        break;
      case 'auth/too-many-requests':
        message = 'Muitas tentativas de login. Tente novamente mais tarde.';
        break;
      case 'auth/network-request-failed':
        message = 'Erro de conexão. Verifique sua internet.';
        break;
      case 'auth/invalid-credential':
        message = 'E-mail ou senha incorretos.';
        break;
      default:
        message = error.message || 'Erro ao autenticar';
    }
    
    return new Error(message);
  }
}