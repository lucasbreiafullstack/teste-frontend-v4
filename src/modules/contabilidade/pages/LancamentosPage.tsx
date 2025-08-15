import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiCheck, 
  FiX,
  FiDownload,
  FiUpload,
  FiEye
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ContabilidadeEntry, PaginationParams } from '../../../types';
import { ContabilidadeService } from '../services/contabilidadeService';
import { useNotificationStore } from '../../../store/notificationStore';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  flex-wrap: wrap;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;

  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background-color: ${props.theme.colors.error};
          color: white;
          border-color: ${props.theme.colors.error};
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${props.theme.colors.primary[600]};
          border-color: ${props.theme.colors.primary[300]};
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.primary[50]};
          }
        `;
      case 'secondary':
        return `
          background-color: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.text.primary};
          border-color: ${props.theme.colors.gray[300]};
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.gray[200]};
          }
        `;
      default:
        return `
          background-color: ${props.theme.colors.primary[600]};
          color: white;
          border-color: ${props.theme.colors.primary[600]};
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.primary[700]};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FiltersCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: ${props => props.theme.shadows.base};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[500]}20;
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.base};
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[500]}20;
  }
`;

const TableCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.base};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.gray[50]};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border.light};

  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ status: 'rascunho' | 'aprovado' | 'cancelado' }>`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;

  ${props => {
    switch (props.status) {
      case 'aprovado':
        return `
          background-color: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `;
      case 'cancelado':
        return `
          background-color: ${props.theme.colors.error}20;
          color: ${props.theme.colors.error};
        `;
      default:
        return `
          background-color: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
`;

const IconButton = styled.button`
  padding: ${props => props.theme.spacing[2]};
  border: none;
  background: none;
  border-radius: ${props => props.theme.borderRadius.base};
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.border.light};
`;

const PaginationInfo = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
`;

const LancamentosPage: React.FC = () => {
  const [lancamentos, setLancamentos] = useState<ContabilidadeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  const { addNotification } = useNotificationStore();
  
  const { register, handleSubmit, watch, reset } = useForm<{
    search: string;
    status: string;
    dataInicio: string;
    dataFim: string;
  }>();

  const watchedValues = watch();

  useEffect(() => {
    loadLancamentos();
  }, [pagination.page, watchedValues]);

  const loadLancamentos = async () => {
    try {
      setLoading(true);
      
      const params: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: watchedValues.search || undefined,
        orderBy: 'data',
        orderDirection: 'desc'
      };

      // Mock data - em produção seria chamada real para o backend
      const mockData = {
        data: [
          {
            id: '1',
            numeroLancamento: 'LC2025001',
            data: new Date('2025-01-15'),
            historico: 'Pagamento de salários - Janeiro/2025',
            valor: 125000.00,
            tipo: 'debito' as const,
            contaDebito: '3.1.1.01.01 - Salários',
            contaCredito: '1.1.1.01.01 - Caixa',
            status: 'aprovado' as const,
            criadoPor: 'João Silva',
            criadoEm: new Date('2025-01-15'),
            aprovadoPor: 'Maria Santos',
            aprovadoEm: new Date('2025-01-15')
          },
          {
            id: '2',
            numeroLancamento: 'LC2025002',
            data: new Date('2025-01-14'),
            historico: 'Recebimento de IPTU - Janeiro/2025',
            valor: 45000.00,
            tipo: 'credito' as const,
            contaDebito: '1.1.1.01.01 - Caixa',
            contaCredito: '4.1.1.01.01 - IPTU',
            status: 'rascunho' as const,
            criadoPor: 'Ana Costa',
            criadoEm: new Date('2025-01-14')
          }
        ],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1
      };

      setLancamentos(mockData.data);
      setPagination(prev => ({
        ...prev,
        total: mockData.total,
        totalPages: mockData.totalPages
      }));
    } catch (error) {
      console.error('Erro ao carregar lançamentos:', error);
      addNotification({
        tipo: 'error',
        titulo: 'Erro',
        mensagem: 'Erro ao carregar lançamentos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNovoLancamento = () => {
    addNotification({
      tipo: 'info',
      titulo: 'Em desenvolvimento',
      mensagem: 'Funcionalidade de novo lançamento em desenvolvimento'
    });
  };

  const handleEditarLancamento = (id: string) => {
    addNotification({
      tipo: 'info',
      titulo: 'Em desenvolvimento',
      mensagem: 'Funcionalidade de edição em desenvolvimento'
    });
  };

  const handleExcluirLancamento = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      addNotification({
        tipo: 'info',
        titulo: 'Em desenvolvimento',
        mensagem: 'Funcionalidade de exclusão em desenvolvimento'
      });
    }
  };

  const handleAprovarLancamento = (id: string) => {
    addNotification({
      tipo: 'info',
      titulo: 'Em desenvolvimento',
      mensagem: 'Funcionalidade de aprovação em desenvolvimento'
    });
  };

  const handleExportar = () => {
    addNotification({
      tipo: 'info',
      titulo: 'Em desenvolvimento',
      mensagem: 'Funcionalidade de exportação em desenvolvimento'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <PageContainer>
      <PageHeader>
        <HeaderLeft>
          <PageTitle>Lançamentos Contábeis</PageTitle>
          <PageDescription>
            Gerencie todos os lançamentos contábeis do município
          </PageDescription>
        </HeaderLeft>
        
        <HeaderActions>
          <Button variant="outline" onClick={handleExportar}>
            <FiDownload size={16} />
            Exportar
          </Button>
          <Button onClick={handleNovoLancamento}>
            <FiPlus size={16} />
            Novo Lançamento
          </Button>
        </HeaderActions>
      </PageHeader>

      <FiltersCard>
        <form>
          <FiltersGrid>
            <FormGroup>
              <Label>Pesquisar</Label>
              <Input
                type="text"
                placeholder="Número, histórico..."
                {...register('search')}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Status</Label>
              <Select {...register('status')}>
                <option value="">Todos</option>
                <option value="rascunho">Rascunho</option>
                <option value="aprovado">Aprovado</option>
                <option value="cancelado">Cancelado</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Data Início</Label>
              <Input
                type="date"
                {...register('dataInicio')}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Data Fim</Label>
              <Input
                type="date"
                {...register('dataFim')}
              />
            </FormGroup>
          </FiltersGrid>
        </form>
      </FiltersCard>

      <TableCard>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <LoadingSpinner size="lg" text="Carregando lançamentos..." />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Número</TableHeaderCell>
                  <TableHeaderCell>Data</TableHeaderCell>
                  <TableHeaderCell>Histórico</TableHeaderCell>
                  <TableHeaderCell>Valor</TableHeaderCell>
                  <TableHeaderCell>Tipo</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Ações</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {lancamentos.map((lancamento) => (
                  <TableRow key={lancamento.id}>
                    <TableCell>{lancamento.numeroLancamento}</TableCell>
                    <TableCell>{formatDate(lancamento.data)}</TableCell>
                    <TableCell>{lancamento.historico}</TableCell>
                    <TableCell>{formatCurrency(lancamento.valor)}</TableCell>
                    <TableCell style={{ textTransform: 'capitalize' }}>
                      {lancamento.tipo}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lancamento.status}>
                        {lancamento.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <IconButton title="Visualizar">
                          <FiEye size={16} />
                        </IconButton>
                        {lancamento.status === 'rascunho' && (
                          <>
                            <IconButton 
                              title="Editar"
                              onClick={() => handleEditarLancamento(lancamento.id)}
                            >
                              <FiEdit size={16} />
                            </IconButton>
                            <IconButton 
                              title="Aprovar"
                              onClick={() => handleAprovarLancamento(lancamento.id)}
                            >
                              <FiCheck size={16} />
                            </IconButton>
                            <IconButton 
                              title="Excluir"
                              onClick={() => handleExcluirLancamento(lancamento.id)}
                            >
                              <FiTrash2 size={16} />
                            </IconButton>
                          </>
                        )}
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            <Pagination>
              <PaginationInfo>
                Mostrando {lancamentos.length} de {pagination.total} registros
              </PaginationInfo>
              
              <PaginationButtons>
                <Button 
                  variant="outline" 
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Anterior
                </Button>
                <Button 
                  variant="outline"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Próximo
                </Button>
              </PaginationButtons>
            </Pagination>
          </>
        )}
      </TableCard>
    </PageContainer>
  );
};

export default LancamentosPage;