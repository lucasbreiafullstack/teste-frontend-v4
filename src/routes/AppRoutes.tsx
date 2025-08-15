import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';
import { MainLayout } from '../layouts/MainLayout';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Lazy loading dos componentes
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));
const ContabilidadeLancamentosPage = React.lazy(() => import('../modules/contabilidade/pages/LancamentosPage'));

// Componente de proteção de rotas
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission, 'ler')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Componente para rotas públicas (apenas usuários não autenticados)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Componente de loading
const LoadingPage: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh' 
  }}>
    <LoadingSpinner />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Rotas públicas (não autenticadas) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicRoute>
          } 
        />

        {/* Rotas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout title="Dashboard">
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Módulo de Contabilidade */}
        <Route 
          path="/contabilidade/lancamentos" 
          element={
            <ProtectedRoute requiredPermission="contabilidade">
              <MainLayout title="Lançamentos Contábeis">
                <ContabilidadeLancamentosPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Outras rotas do módulo de contabilidade serão adicionadas aqui */}
        <Route 
          path="/contabilidade/*" 
          element={
            <ProtectedRoute requiredPermission="contabilidade">
              <MainLayout title="Contabilidade">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '400px',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <h2>Módulo em desenvolvimento</h2>
                  <p>Este módulo está sendo desenvolvido.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Rotas futuras para outros módulos */}
        <Route 
          path="/orcamento/*" 
          element={
            <ProtectedRoute requiredPermission="orcamento">
              <MainLayout title="Orçamento">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '400px',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <h2>Módulo em desenvolvimento</h2>
                  <p>Este módulo está sendo desenvolvido.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/compras/*" 
          element={
            <ProtectedRoute requiredPermission="compras">
              <MainLayout title="Compras e Licitações">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '400px',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <h2>Módulo em desenvolvimento</h2>
                  <p>Este módulo está sendo desenvolvido.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/rh/*" 
          element={
            <ProtectedRoute requiredPermission="recursos-humanos">
              <MainLayout title="Recursos Humanos">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '400px',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <h2>Módulo em desenvolvimento</h2>
                  <p>Este módulo está sendo desenvolvido.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Redirect da raiz para login ou dashboard */}
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />

        {/* Rota 404 */}
        <Route 
          path="*" 
          element={
            <MainLayout title="Página não encontrada">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <h1>404</h1>
                <h2>Página não encontrada</h2>
                <p>A página que você está procurando não existe.</p>
              </div>
            </MainLayout>
          } 
        />
      </Routes>
    </Suspense>
  );
};