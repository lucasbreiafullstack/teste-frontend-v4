import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { ApiResponse } from '../types';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Criação da instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação nas requisições
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log da requisição (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log da resposta (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response ${response.status}:`, response.data);
    }

    return response;
  },
  (error) => {
    const { addNotification } = useNotificationStore.getState();
    const { logout } = useAuthStore.getState();

    // Log do erro (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error:', error);
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 401:
          // Token inválido ou expirado
          addNotification({
            tipo: 'error',
            titulo: 'Sessão expirada',
            mensagem: 'Sua sessão expirou. Faça login novamente.',
          });
          logout();
          window.location.href = '/login';
          break;

        case 403:
          // Sem permissão
          addNotification({
            tipo: 'error',
            titulo: 'Acesso negado',
            mensagem: 'Você não tem permissão para realizar esta ação.',
          });
          break;

        case 404:
          // Recurso não encontrado
          addNotification({
            tipo: 'error',
            titulo: 'Não encontrado',
            mensagem: 'O recurso solicitado não foi encontrado.',
          });
          break;

        case 422:
          // Erro de validação
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((error: string) => {
              addNotification({
                tipo: 'error',
                titulo: 'Erro de validação',
                mensagem: error,
              });
            });
          }
          break;

        case 500:
          // Erro interno do servidor
          addNotification({
            tipo: 'error',
            titulo: 'Erro interno',
            mensagem: 'Ocorreu um erro interno no servidor. Tente novamente.',
          });
          break;

        default:
          // Outros erros
          addNotification({
            tipo: 'error',
            titulo: 'Erro',
            mensagem: data.message || 'Ocorreu um erro inesperado.',
          });
      }
    } else if (error.request) {
      // Erro de rede
      addNotification({
        tipo: 'error',
        titulo: 'Erro de conexão',
        mensagem: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      });
    } else {
      // Outros erros
      addNotification({
        tipo: 'error',
        titulo: 'Erro',
        mensagem: 'Ocorreu um erro inesperado.',
      });
    }

    return Promise.reject(error);
  }
);

// Classe de serviços da API
export class ApiService {
  // Métodos genéricos para CRUD
  static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // Método para upload de arquivos
  static async upload<T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });

    return response.data.data;
  }

  // Método para download de arquivos
  static async download(url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> {
    const response = await api.get(url, {
      ...config,
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export default api;