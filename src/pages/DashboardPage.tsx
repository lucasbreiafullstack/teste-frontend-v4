import React from 'react';
import styled from 'styled-components';
import { 
  FiDollarSign, 
  FiUsers, 
  FiFileText, 
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`;

const WelcomeSection = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: ${props => props.theme.shadows.base};
`;

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing[4]};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: ${props => props.theme.shadows.base};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const StatCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const StatCardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const StatCardIcon = styled.div<{ color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.base};
  background-color: ${props => props.color || props.theme.colors.primary[100]};
  color: ${props => props.color ? 'white' : props.theme.colors.primary[600]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatCardValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const StatCardChange = styled.div<{ positive?: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.error};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`;

const QuickActionsSection = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: ${props => props.theme.shadows.base};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing[4]};
`;

const QuickActionCard = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  padding: ${props => props.theme.spacing[4]};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    background-color: ${props => props.theme.colors.primary[50]};
  }
`;

const QuickActionTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
`;

const QuickActionDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const AlertsSection = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  box-shadow: ${props => props.theme.shadows.base};
`;

const AlertItem = styled.div<{ type: 'warning' | 'success' | 'info' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.base};
  background-color: ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning + '10';
      case 'success': return props.theme.colors.success + '10';
      default: return props.theme.colors.info + '10';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning;
      case 'success': return props.theme.colors.success;
      default: return props.theme.colors.info;
    }
  }};
  margin-bottom: ${props => props.theme.spacing[3]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const AlertIcon = styled.div<{ type: 'warning' | 'success' | 'info' }>`
  color: ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning;
      case 'success': return props.theme.colors.success;
      default: return props.theme.colors.info;
    }
  }};
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.h5`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`;

const AlertDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Receita Arrecadada',
      value: 'R$ 2.450.000',
      change: '+12.5%',
      positive: true,
      icon: FiDollarSign,
      color: '#22c55e'
    },
    {
      title: 'Despesas Executadas',
      value: 'R$ 1.890.000',
      change: '+8.2%',
      positive: true,
      icon: FiTrendingUp,
      color: '#3b82f6'
    },
    {
      title: 'Servidores Ativos',
      value: '1.247',
      change: '+2.1%',
      positive: true,
      icon: FiUsers,
      color: '#8b5cf6'
    },
    {
      title: 'Processos Abertos',
      value: '89',
      change: '-5.3%',
      positive: false,
      icon: FiFileText,
      color: '#f59e0b'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Lançamento',
      description: 'Registrar lançamento contábil',
      action: () => window.location.href = '/contabilidade/lancamentos'
    },
    {
      title: 'Consultar Receitas',
      description: 'Visualizar receitas arrecadadas',
      action: () => alert('Em desenvolvimento')
    },
    {
      title: 'Folha de Pagamento',
      description: 'Processar folha do mês',
      action: () => alert('Em desenvolvimento')
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatórios gerenciais',
      action: () => alert('Em desenvolvimento')
    }
  ];

  const alerts = [
    {
      type: 'warning' as const,
      title: 'Prazo de Entrega',
      description: 'Relatório SICONFI vence em 3 dias'
    },
    {
      type: 'success' as const,
      title: 'Conciliação Concluída',
      description: 'Conciliação bancária de dezembro finalizada'
    },
    {
      type: 'info' as const,
      title: 'Atualização Disponível',
      description: 'Nova versão do sistema disponível'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>
          {getGreeting()}, {user?.nome?.split(' ')[0] || 'Usuário'}!
        </WelcomeTitle>
        <WelcomeSubtitle>
          Bem-vindo ao Sistema de Gestão Pública do Município de Mendes/RJ
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatCardHeader>
              <StatCardTitle>{stat.title}</StatCardTitle>
              <StatCardIcon color={stat.color}>
                <stat.icon size={24} />
              </StatCardIcon>
            </StatCardHeader>
            <StatCardValue>{stat.value}</StatCardValue>
            <StatCardChange positive={stat.positive}>
              <FiTrendingUp size={16} />
              {stat.change} vs mês anterior
            </StatCardChange>
          </StatCard>
        ))}
      </StatsGrid>

      <QuickActionsSection>
        <SectionTitle>Ações Rápidas</SectionTitle>
        <QuickActionsGrid>
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} onClick={action.action}>
              <QuickActionTitle>{action.title}</QuickActionTitle>
              <QuickActionDescription>{action.description}</QuickActionDescription>
            </QuickActionCard>
          ))}
        </QuickActionsGrid>
      </QuickActionsSection>

      <AlertsSection>
        <SectionTitle>Alertas e Notificações</SectionTitle>
        {alerts.map((alert, index) => (
          <AlertItem key={index} type={alert.type}>
            <AlertIcon type={alert.type}>
              {alert.type === 'warning' && <FiAlertTriangle size={20} />}
              {alert.type === 'success' && <FiCheckCircle size={20} />}
              {alert.type === 'info' && <FiFileText size={20} />}
            </AlertIcon>
            <AlertContent>
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </AlertContent>
          </AlertItem>
        ))}
      </AlertsSection>
    </DashboardContainer>
  );
};

export default DashboardPage;