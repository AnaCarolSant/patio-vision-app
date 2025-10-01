import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Alert } from 'react-native';

export const useFirebaseAuth = () => {
  const { login, register, logout, user, isLoading } = useUser();
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return false;
    }

    setAuthLoading(true);
    try {
      await login(email, password);
      return true;
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string): Promise<boolean> => {
    if (!email || !password || !name) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    setAuthLoading(true);
    try {
      await register(email, password, name);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      return true;
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async (): Promise<boolean> => {
    setAuthLoading(true);
    try {
      await logout();
      return true;
    } catch (error: any) {
      Alert.alert('Erro no Logout', error.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    isLoading: isLoading || authLoading,
    handleLogin,
    handleRegister,
    handleLogout,
    isAuthenticated: !!user
  };
};