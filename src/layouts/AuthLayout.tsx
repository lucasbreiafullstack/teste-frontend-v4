import React from 'react';
import styled from 'styled-components';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[600]} 0%, ${props => props.theme.colors.primary[800]} 100%);
  padding: ${props => props.theme.spacing[4]};
`;

const AuthCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  width: 100%;
  max-width: 400px;
  padding: ${props => props.theme.spacing[8]};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[4]};
  
  img {
    height: 60px;
    width: auto;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0;
`;

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = "Sistema de Gestão Pública",
  subtitle = "Município de Mendes/RJ"
}) => {
  return (
    <AuthContainer>
      <AuthCard className="fade-in">
        <Header>
          <Logo>
            {/* Aqui seria colocado o logo da prefeitura */}
            <div style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: '#2563eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              M
            </div>
          </Logo>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>
        {children}
      </AuthCard>
    </AuthContainer>
  );
};