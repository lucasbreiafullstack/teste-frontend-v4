import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiDollarSign, 
  FiFileText, 
  FiUsers, 
  FiTruck, 
  FiHeart, 
  FiShield, 
  FiBarChart3,
  FiChevronDown,
  FiChevronRight,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { MenuItem } from '../types';

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.sidebar.background};
  color: ${props => props.theme.colors.sidebar.text};
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${props => props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.borderRadius.base};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.sidebar.text};
`;

const LogoSubtitle = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: rgba(255, 255, 255, 0.7);
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.sidebar.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing[1]};

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing[4]} 0;
`;

const MenuGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const MenuGroupTitle = styled.div`
  padding: 0 ${props => props.theme.spacing[4]} ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MenuItemContainer = styled.div<{ active?: boolean; hasChildren?: boolean }>`
  margin-bottom: ${props => props.theme.spacing[1]};
`;

const MenuItemButton = styled.button<{ active?: boolean; level?: number }>`
  width: 100%;
  background: none;
  border: none;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  padding-left: ${props => (props.level || 0) * 16 + 16}px;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  color: ${props => props.active ? props.theme.colors.sidebar.text : 'rgba(255, 255, 255, 0.8)'};
  background-color: ${props => props.active ? props.theme.colors.sidebar.active : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.sidebar.active : props.theme.colors.sidebar.hover};
    color: ${props => props.theme.colors.sidebar.text};
  }
`;

const MenuItemIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuItemText = styled.span`
  flex: 1;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const MenuItemChevron = styled.div<{ expanded?: boolean }>`
  transition: transform 0.2s ease;
  transform: rotate(${props => props.expanded ? '90deg' : '0deg'});
`;

const SubMenu = styled.div<{ expanded?: boolean }>`
  max-height: ${props => props.expanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['principal']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'FiHome',
      path: '/dashboard',
    },
    {
      id: 'contabilidade',
      label: 'Contabilidade',
      icon: 'FiDollarSign',
      children: [
        { id: 'lancamentos', label: 'Lançamentos', path: '/contabilidade/lancamentos' },
        { id: 'plano-contas', label: 'Plano de Contas', path: '/contabilidade/plano-contas' },
        { id: 'balancetes', label: 'Balancetes', path: '/contabilidade/balancetes' },
        { id: 'demonstrativos', label: 'Demonstrativos', path: '/contabilidade/demonstrativos' },
      ],
    },
    {
      id: 'orcamento',
      label: 'Orçamento',
      icon: 'FiBarChart3',
      children: [
        { id: 'ppa', label: 'PPA', path: '/orcamento/ppa' },
        { id: 'ldo', label: 'LDO', path: '/orcamento/ldo' },
        { id: 'loa', label: 'LOA', path: '/orcamento/loa' },
        { id: 'execucao', label: 'Execução Orçamentária', path: '/orcamento/execucao' },
      ],
    },
    {
      id: 'compras',
      label: 'Compras e Licitações',
      icon: 'FiFileText',
      children: [
        { id: 'processos', label: 'Processos', path: '/compras/processos' },
        { id: 'pregoes', label: 'Pregões', path: '/compras/pregoes' },
        { id: 'contratos', label: 'Contratos', path: '/compras/contratos' },
        { id: 'fornecedores', label: 'Fornecedores', path: '/compras/fornecedores' },
      ],
    },
    {
      id: 'tesouraria',
      label: 'Tesouraria',
      icon: 'FiDollarSign',
      children: [
        { id: 'contas-bancarias', label: 'Contas Bancárias', path: '/tesouraria/contas' },
        { id: 'movimentacoes', label: 'Movimentações', path: '/tesouraria/movimentacoes' },
        { id: 'conciliacao', label: 'Conciliação', path: '/tesouraria/conciliacao' },
      ],
    },
    {
      id: 'recursos-humanos',
      label: 'Recursos Humanos',
      icon: 'FiUsers',
      children: [
        { id: 'funcionarios', label: 'Funcionários', path: '/rh/funcionarios' },
        { id: 'folha-pagamento', label: 'Folha de Pagamento', path: '/rh/folha' },
        { id: 'frequencia', label: 'Frequência', path: '/rh/frequencia' },
        { id: 'beneficios', label: 'Benefícios', path: '/rh/beneficios' },
      ],
    },
    {
      id: 'tributacao',
      label: 'Tributação',
      icon: 'FiFileText',
      children: [
        { id: 'iptu', label: 'IPTU', path: '/tributacao/iptu' },
        { id: 'iss', label: 'ISS', path: '/tributacao/iss' },
        { id: 'taxas', label: 'Taxas', path: '/tributacao/taxas' },
        { id: 'divida-ativa', label: 'Dívida Ativa', path: '/tributacao/divida-ativa' },
      ],
    },
    {
      id: 'patrimonio',
      label: 'Patrimônio',
      icon: 'FiTruck',
      children: [
        { id: 'bens', label: 'Bens Patrimoniais', path: '/patrimonio/bens' },
        { id: 'almoxarifado', label: 'Almoxarifado', path: '/patrimonio/almoxarifado' },
        { id: 'inventario', label: 'Inventário', path: '/patrimonio/inventario' },
      ],
    },
    {
      id: 'saude',
      label: 'Saúde',
      icon: 'FiHeart',
      children: [
        { id: 'pacientes', label: 'Pacientes', path: '/saude/pacientes' },
        { id: 'procedimentos', label: 'Procedimentos', path: '/saude/procedimentos' },
        { id: 'unidades', label: 'Unidades de Saúde', path: '/saude/unidades' },
      ],
    },
    {
      id: 'assistencia-social',
      label: 'Assistência Social',
      icon: 'FiShield',
      children: [
        { id: 'programas', label: 'Programas Sociais', path: '/assistencia/programas' },
        { id: 'beneficiarios', label: 'Beneficiários', path: '/assistencia/beneficiarios' },
        { id: 'cadastro-unico', label: 'Cadastro Único', path: '/assistencia/cadastro-unico' },
      ],
    },
  ];

  const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    FiHome,
    FiDollarSign,
    FiFileText,
    FiUsers,
    FiTruck,
    FiHeart,
    FiShield,
    FiBarChart3,
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      toggleMenu(item.id);
    } else if (item.path) {
      navigate(item.path);
      onClose?.();
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isMenuExpanded = (menuId: string) => {
    return expandedMenus.includes(menuId);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const IconComponent = iconMap[item.icon || 'FiHome'];
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = isMenuExpanded(item.id);
    const active = isActive(item.path);

    return (
      <MenuItemContainer key={item.id} hasChildren={hasChildren}>
        <MenuItemButton
          active={active}
          level={level}
          onClick={() => handleMenuClick(item)}
        >
          <MenuItemIcon>
            <IconComponent size={18} />
          </MenuItemIcon>
          <MenuItemText>{item.label}</MenuItemText>
          {hasChildren && (
            <MenuItemChevron expanded={isExpanded}>
              <FiChevronRight size={16} />
            </MenuItemChevron>
          )}
        </MenuItemButton>
        
        {hasChildren && (
          <SubMenu expanded={isExpanded}>
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </SubMenu>
        )}
      </MenuItemContainer>
    );
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <LogoIcon>M</LogoIcon>
          <LogoText>
            <LogoTitle>SGP</LogoTitle>
            <LogoSubtitle>Mendes/RJ</LogoSubtitle>
          </LogoText>
        </Logo>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
      </SidebarHeader>

      <Navigation>
        <MenuGroup>
          <MenuGroupTitle>Principal</MenuGroupTitle>
          {menuItems.slice(0, 1).map(item => renderMenuItem(item))}
        </MenuGroup>

        <MenuGroup>
          <MenuGroupTitle>Gestão Financeira</MenuGroupTitle>
          {menuItems.slice(1, 5).map(item => renderMenuItem(item))}
        </MenuGroup>

        <MenuGroup>
          <MenuGroupTitle>Gestão de Pessoas</MenuGroupTitle>
          {menuItems.slice(5, 6).map(item => renderMenuItem(item))}
        </MenuGroup>

        <MenuGroup>
          <MenuGroupTitle>Serviços Municipais</MenuGroupTitle>
          {menuItems.slice(6).map(item => renderMenuItem(item))}
        </MenuGroup>
      </Navigation>
    </SidebarContainer>
  );
};