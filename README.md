# 🏛️ LegislaSaaS - Plataforma de Busca Contextual de Legislação

## 📋 Visão Geral

Plataforma SaaS escalável para busca contextual de legislação, inicialmente focada na Assembleia Legislativa do Estado do Rio de Janeiro (ALERJ), com arquitetura preparada para expansão para outras casas legislativas.

## 🏗️ Arquitetura do Sistema

### Visão de Alto Nível

O sistema utiliza uma **arquitetura de microsserviços híbrida** com os seguintes componentes principais:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Load Balancer │
│   (React PWA)   │────│   (Kong/Nginx)  │────│   (AWS ALB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │  Auth Service   │ │ Legislation API │ │ Notification    │
    │  (NestJS)       │ │ (NestJS)        │ │ Service (Node)  │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
                │               │               │
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │   PostgreSQL    │ │   Elasticsearch │ │   Redis Cache   │
    │   (Primary DB)  │ │   (Search)      │ │   (Sessions)    │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 🚀 Stack Tecnológica

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **PWA** com Service Workers
- **TanStack Query** para gerenciamento de estado servidor
- **Zustand** para estado local
- **React Hook Form** + **Zod** para formulários
- **Tailwind CSS** + **shadcn/ui** para UI
- **React Router v6** para roteamento

### Backend
- **NestJS** + **TypeScript** (framework robusto para APIs enterprise)
- **Prisma ORM** para PostgreSQL
- **Passport.js** para autenticação
- **Bull Queue** para processamento assíncrono
- **Helmet** e **CORS** para segurança
- **Winston** para logging

### Banco de Dados
- **PostgreSQL 15+** com Full Text Search
- **Elasticsearch 8.x** para busca avançada
- **Redis** para cache e sessões

### Infraestrutura Cloud (AWS)
- **ECS Fargate** para containers
- **RDS PostgreSQL** Multi-AZ
- **OpenSearch** (Elasticsearch gerenciado)
- **ElastiCache Redis**
- **S3** para arquivos estáticos
- **CloudFront CDN**
- **Route 53** para DNS
- **ALB** para load balancing

## 🎯 Justificativas de Design

### Por que Microsserviços Híbridos?
- **Escalabilidade independente** por domínio
- **Facilita manutenção** e deploy
- **Isolamento de falhas**
- **Permite equipes especializadas**

### Por que NestJS?
- **Arquitetura modular** nativa
- **TypeScript first**
- **Decorators** para cleaner code
- **Ecosystem robusto** (guards, interceptors, pipes)
- **GraphQL/REST** flexibility

### Por que PostgreSQL + Elasticsearch?
- **PostgreSQL**: ACID, relacionamentos complexos, full-text search nativo
- **Elasticsearch**: Busca semântica avançada, análise de texto, performance
- **Hybrid approach**: Melhor dos dois mundos

## 📁 Estrutura do Projeto

```
legisla-saas/
├── apps/
│   ├── web/                    # React PWA Frontend
│   ├── api-gateway/            # Kong/Nginx Gateway
│   ├── auth-service/           # Microsserviço de Autenticação
│   ├── legislation-service/    # Microsserviço de Legislação
│   └── notification-service/   # Microsserviço de Notificações
├── packages/
│   ├── shared/                 # Código compartilhado
│   ├── ui/                     # Componentes UI reutilizáveis
│   └── types/                  # TypeScript definitions
├── infrastructure/
│   ├── terraform/              # IaC
│   ├── docker/                 # Docker configs
│   └── k8s/                    # Kubernetes manifests
├── docs/                       # Documentação
└── scripts/                    # Scripts de automação
```
