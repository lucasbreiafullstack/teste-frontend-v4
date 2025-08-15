import { ApiService } from '../../../services/api';
import { ContabilidadeEntry, PaginationParams, PaginatedResponse } from '../../../types';

export class ContabilidadeService {
  private static readonly BASE_URL = '/contabilidade';

  // Lançamentos contábeis
  static async getLancamentos(params?: PaginationParams): Promise<PaginatedResponse<ContabilidadeEntry>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    }

    const url = `${this.BASE_URL}/lancamentos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return ApiService.get<PaginatedResponse<ContabilidadeEntry>>(url);
  }

  static async getLancamentoById(id: string): Promise<ContabilidadeEntry> {
    return ApiService.get<ContabilidadeEntry>(`${this.BASE_URL}/lancamentos/${id}`);
  }

  static async createLancamento(data: Omit<ContabilidadeEntry, 'id' | 'criadoEm' | 'aprovadoEm' | 'aprovadoPor'>): Promise<ContabilidadeEntry> {
    return ApiService.post<ContabilidadeEntry>(`${this.BASE_URL}/lancamentos`, data);
  }

  static async updateLancamento(id: string, data: Partial<ContabilidadeEntry>): Promise<ContabilidadeEntry> {
    return ApiService.put<ContabilidadeEntry>(`${this.BASE_URL}/lancamentos/${id}`, data);
  }

  static async deleteLancamento(id: string): Promise<void> {
    return ApiService.delete(`${this.BASE_URL}/lancamentos/${id}`);
  }

  static async aprovarLancamento(id: string): Promise<ContabilidadeEntry> {
    return ApiService.post<ContabilidadeEntry>(`${this.BASE_URL}/lancamentos/${id}/aprovar`);
  }

  static async cancelarLancamento(id: string, motivo: string): Promise<ContabilidadeEntry> {
    return ApiService.post<ContabilidadeEntry>(`${this.BASE_URL}/lancamentos/${id}/cancelar`, { motivo });
  }

  // Plano de contas
  static async getPlanoContas(): Promise<any[]> {
    return ApiService.get<any[]>(`${this.BASE_URL}/plano-contas`);
  }

  static async getContaById(id: string): Promise<any> {
    return ApiService.get<any>(`${this.BASE_URL}/plano-contas/${id}`);
  }

  // Balancetes
  static async getBalancete(dataInicio: string, dataFim: string): Promise<any> {
    return ApiService.get<any>(`${this.BASE_URL}/balancete`, {
      params: { dataInicio, dataFim }
    });
  }

  // Demonstrativos
  static async getDemonstrativoReceitas(dataInicio: string, dataFim: string): Promise<any> {
    return ApiService.get<any>(`${this.BASE_URL}/demonstrativo-receitas`, {
      params: { dataInicio, dataFim }
    });
  }

  static async getDemonstrativoDespesas(dataInicio: string, dataFim: string): Promise<any> {
    return ApiService.get<any>(`${this.BASE_URL}/demonstrativo-despesas`, {
      params: { dataInicio, dataFim }
    });
  }

  // Relatórios
  static async exportarLancamentos(params?: PaginationParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    }

    const url = `${this.BASE_URL}/lancamentos/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return ApiService.get<Blob>(url, {
      responseType: 'blob'
    });
  }

  static async gerarRelatorioBalancete(dataInicio: string, dataFim: string, formato: 'pdf' | 'excel' = 'pdf'): Promise<void> {
    const url = `${this.BASE_URL}/relatorio-balancete`;
    await ApiService.download(url, `balancete-${dataInicio}-${dataFim}.${formato}`, {
      params: { dataInicio, dataFim, formato }
    });
  }

  // Utilitários
  static async validarLancamento(data: Partial<ContabilidadeEntry>): Promise<{ valido: boolean; erros: string[] }> {
    return ApiService.post<{ valido: boolean; erros: string[] }>(`${this.BASE_URL}/validar-lancamento`, data);
  }

  static async importarLancamentos(arquivo: File): Promise<{ importados: number; erros: string[] }> {
    return ApiService.upload<{ importados: number; erros: string[] }>(`${this.BASE_URL}/importar-lancamentos`, arquivo);
  }
}