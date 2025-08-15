import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { ApiService } from '../services/api';
import { User } from '../types';

interface LoginCredentials {
  email: string;
  senha: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: setAuth,
    logout: clearAuth,
    updateUser,
    setLoading,
    hasPermission,
    isAdmin,
  } = useAuthStore();

  const { addNotification } = useNotificationStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      const response = await ApiService.post<LoginResponse>('/auth/login', credentials);
      
      setAuth(response.user, response.token);
      
      addNotification({
        tipo: 'success',
        titulo: 'Login realizado',
        mensagem: `Bem-vindo(a), ${response.user.nome}!`,
      });

      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading, addNotification]);

  const logout = useCallback(async () => {
    try {
      // Opcionalmente, fazer logout no servidor
      if (token) {
        await ApiService.post('/auth/logout');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      clearAuth();
      addNotification({
        tipo: 'info',
        titulo: 'Logout realizado',
        mensagem: 'Você foi desconectado com sucesso.',
      });
    }
  }, [token, clearAuth, addNotification]);

  const refreshToken = useCallback(async () => {
    try {
      if (!token) {
        throw new Error('Nenhum token disponível');
      }

      const response = await ApiService.post<LoginResponse>('/auth/refresh');
      setAuth(response.user, response.token);
      
      return response;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      clearAuth();
      throw error;
    }
  }, [token, setAuth, clearAuth]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      
      await ApiService.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      addNotification({
        tipo: 'success',
        titulo: 'Senha alterada',
        mensagem: 'Sua senha foi alterada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addNotification]);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      setLoading(true);
      
      const updatedUser = await ApiService.put<User>('/auth/profile', userData);
      updateUser(updatedUser);

      addNotification({
        tipo: 'success',
        titulo: 'Perfil atualizado',
        mensagem: 'Suas informações foram atualizadas com sucesso.',
      });

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, updateUser, addNotification]);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      setLoading(true);
      
      await ApiService.post('/auth/forgot-password', { email });

      addNotification({
        tipo: 'success',
        titulo: 'Email enviado',
        mensagem: 'Instruções para redefinir sua senha foram enviadas para seu email.',
      });
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addNotification]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      
      await ApiService.post('/auth/reset-password', {
        token,
        newPassword,
      });

      addNotification({
        tipo: 'success',
        titulo: 'Senha redefinida',
        mensagem: 'Sua senha foi redefinida com sucesso. Faça login com a nova senha.',
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addNotification]);

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Ações
    login,
    logout,
    refreshToken,
    changePassword,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    
    // Utilitários
    hasPermission,
    isAdmin,
  };
};