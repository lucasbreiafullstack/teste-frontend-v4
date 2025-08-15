import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMenu, FiX, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useNotificationStore } from '../store/notificationStore';
import { Sidebar } from '../components/Sidebar';
import { NotificationDropdown } from '../components/NotificationDropdown';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.surface};
`;

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: 280px;
  background-color: ${props => props.theme.colors.sidebar.background};
  transition: transform 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: ${props => props.theme.zIndex.sticky};

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.base};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.base};
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: ${props => props.theme.colors.error};
  color: white;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 18px;
  height: 18px;
  font-size: ${props => props.theme.typography.fontSize.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.base};
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const UserRole = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing[6]};
  overflow-y: auto;
`;

const Overlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.theme.zIndex.modalBackdrop};
  display: ${props => props.visible ? 'block' : 'none'};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getUnreadCount } = useNotificationStore();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const unreadNotifications = getUnreadCount();

  return (
    <LayoutContainer>
      <SidebarContainer isOpen={sidebarOpen}>
        <Sidebar onClose={closeSidebar} />
      </SidebarContainer>

      <Overlay visible={sidebarOpen} onClick={closeSidebar} />

      <MainContent sidebarOpen={sidebarOpen}>
        <Header>
          <HeaderLeft>
            <MenuButton onClick={toggleSidebar}>
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </MenuButton>
            <PageTitle>{title}</PageTitle>
          </HeaderLeft>

          <HeaderRight>
            <IconButton>
              <FiBell size={20} />
              {unreadNotifications > 0 && (
                <NotificationBadge>
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </NotificationBadge>
              )}
            </IconButton>

            <IconButton>
              <FiSettings size={20} />
            </IconButton>

            <UserInfo>
              <Avatar>
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <UserDetails>
                <UserName>{user?.nome || 'Usuário'}</UserName>
                <UserRole>{user?.cargo || 'Funcionário'}</UserRole>
              </UserDetails>
            </UserInfo>

            <IconButton onClick={handleLogout} title="Sair">
              <FiLogOut size={20} />
            </IconButton>
          </HeaderRight>
        </Header>

        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};