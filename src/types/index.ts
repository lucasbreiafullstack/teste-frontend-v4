// Tipos globais do sistema de gestão pública

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  setor: string;
  ativo: boolean;
  permissoes: Permission[];
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Permission {
  id: string;
  modulo: string;
  acao: 'criar' | 'ler' | 'atualizar' | 'excluir' | 'aprovar';
  descricao: string;
}

export interface AuditLog {
  id: string;
  usuarioId: string;
  usuario: string;
  acao: string;
  modulo: string;
  entidadeId?: string;
  dadosAnteriores?: any;
  dadosNovos?: any;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos específicos para módulos
export interface ContabilidadeEntry {
  id: string;
  numeroLancamento: string;
  data: Date;
  historico: string;
  valor: number;
  tipo: 'debito' | 'credito';
  contaDebito: string;
  contaCredito: string;
  documentoReferencia?: string;
  status: 'rascunho' | 'aprovado' | 'cancelado';
  criadoPor: string;
  criadoEm: Date;
  aprovadoPor?: string;
  aprovadoEm?: Date;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  permissions?: string[];
}

// Tipos para formulários
export interface FormState {
  isLoading: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Tipos para notificações
export interface Notification {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  titulo: string;
  mensagem: string;
  timestamp: Date;
  lida: boolean;
}