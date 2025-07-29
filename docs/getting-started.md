# 🚀 Guia de Início Rápido - LegislaSaaS

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker** & **Docker Compose** ([Download](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/))
- **AWS CLI** v2 (para deploy em produção)

## 🛠️ Configuração do Ambiente de Desenvolvimento

### 1. Clone o Repositório

```bash
git clone https://github.com/your-org/legisla-saas.git
cd legisla-saas
```

### 2. Instale as Dependências

```bash
# Instala dependências do monorepo
npm install

# Instala dependências de todos os workspaces
npm run install:all
```

### 3. Configure as Variáveis de Ambiente

```bash
# Copie os arquivos de exemplo
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/legislation-service/.env.example apps/legislation-service/.env
cp apps/notification-service/.env.example apps/notification-service/.env
```

### 4. Configure o Docker Compose

```bash
# Inicie os serviços de infraestrutura
docker-compose up -d postgres redis elasticsearch

# Aguarde os serviços estarem prontos (cerca de 30 segundos)
docker-compose logs -f postgres redis elasticsearch
```

### 5. Configure o Banco de Dados

```bash
# Execute as migrações
npm run db:migrate

# Execute o seed (dados iniciais)
npm run db:seed
```

### 6. Configure o Elasticsearch

```bash
# Setup inicial do Elasticsearch
npm run es:setup

# Indexe os documentos iniciais
npm run es:reindex
```

## 🏃‍♂️ Executando o Projeto

### Modo Desenvolvimento (Recomendado)

```bash
# Inicia todos os serviços em modo desenvolvimento
npm run dev

# Ou inicie individualmente:
npm run dev:web          # Frontend (http://localhost:3000)
npm run dev:auth         # Auth Service (http://localhost:3001)
npm run dev:legislation  # Legislation Service (http://localhost:3002)
npm run dev:notification # Notification Service (http://localhost:3003)
npm run dev:gateway      # API Gateway (http://localhost:8080)
```

### Modo Docker (Completo)

```bash
# Build e inicia todos os containers
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

## 🌐 Acessos

Após iniciar o projeto:

- **Frontend (React)**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:3001
- **Legislation Service**: http://localhost:3002
- **Notification Service**: http://localhost:3003
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601
- **Redis**: localhost:6379
- **PostgreSQL**: localhost:5432

## 👤 Usuários de Teste

O sistema vem com usuários pré-configurados:

```typescript
// Admin
email: admin@legisla-saas.com
password: admin123

// Editor
email: editor@legisla-saas.com
password: editor123

// Usuário comum
email: user@legisla-saas.com
password: user123
```

## 📊 Dados de Teste

O seed do banco inclui:

- **10 categorias** (Educação, Saúde, Segurança, etc.)
- **30 temas** distribuídos nas categorias
- **90 subtemas** 
- **500 documentos** de exemplo da ALERJ
- **Indexação automática** no Elasticsearch

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Executa testes
npm run test

# Executa testes com coverage
npm run test:coverage

# Executa linting
npm run lint

# Fix automático de lint
npm run lint:fix

# Type checking
npm run type-check

# Build de produção
npm run build
```

### Docker

```bash
# Rebuild específico
docker-compose build auth-service

# Logs específicos
docker-compose logs -f legislation-service

# Reset completo
docker-compose down -v
docker-compose up --build
```

### Banco de Dados

```bash
# Reset do banco
npm run db:reset

# Nova migration
npm run db:migrate:new create_new_table

# Studio do Prisma
npm run db:studio
```

### Elasticsearch

```bash
# Verifica status
curl http://localhost:9200/_cluster/health

# Reindexação completa
npm run es:reindex

# Limpa índice
npm run es:clean
```

## 📝 Estrutura de Pastas

```
legisla-saas/
├── apps/                      # Aplicações
│   ├── web/                   # Frontend React
│   │   ├── src/
│   │   │   ├── components/    # Componentes React
│   │   │   ├── pages/         # Páginas/Routes
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── services/      # API clients
│   │   │   └── utils/         # Utilities
│   │   ├── public/            # Assets estáticos
│   │   └── dist/              # Build output
│   ├── auth-service/          # Microsserviço Auth
│   │   ├── src/
│   │   │   ├── modules/       # Módulos NestJS
│   │   │   ├── common/        # Shared code
│   │   │   └── database/      # Database config
│   │   └── prisma/            # Schema e migrations
│   ├── legislation-service/   # Microsserviço Legislação
│   └── notification-service/  # Microsserviço Notificações
├── packages/                  # Packages compartilhados
│   ├── shared/                # Código compartilhado
│   ├── ui/                    # Componentes UI
│   └── types/                 # TypeScript types
├── infrastructure/            # IaC e configs
│   ├── terraform/             # Terraform configs
│   ├── docker/                # Dockerfiles
│   └── k8s/                   # Kubernetes manifests
├── docs/                      # Documentação
└── scripts/                   # Scripts de automação
```

## 🧪 Executando Testes

### Frontend (React)

```bash
cd apps/web

# Testes unitários
npm run test

# Testes com watch mode
npm run test:watch

# Testes E2E (Playwright)
npm run test:e2e
```

### Backend (NestJS)

```bash
cd apps/auth-service

# Testes unitários
npm run test

# Testes de integração
npm run test:e2e

# Coverage
npm run test:cov
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Porta já em uso
```bash
# Mata processos nas portas
npx kill-port 3000 3001 3002 3003 8080

# Ou muda as portas no .env
```

#### 2. Elasticsearch não conecta
```bash
# Verifica se está rodando
docker-compose ps elasticsearch

# Restart
docker-compose restart elasticsearch

# Verifica logs
docker-compose logs elasticsearch
```

#### 3. Banco de dados com problemas
```bash
# Reset completo
npm run db:reset
npm run db:seed
```

#### 4. Cache do Node.js
```bash
# Limpa cache
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Logs e Debug

```bash
# Logs em tempo real
npm run logs

# Debug específico
DEBUG=legisla:* npm run dev

# Logs do Docker
docker-compose logs -f --tail=100
```

## 📱 PWA (Progressive Web App)

Para testar as funcionalidades PWA:

1. **Build de produção**:
   ```bash
   cd apps/web
   npm run build
   npm run preview
   ```

2. **HTTPS local** (necessário para PWA):
   ```bash
   # Com mkcert
   mkcert localhost
   # Configure SSL no vite.config.ts
   ```

3. **Teste offline**:
   - Abra DevTools > Network
   - Marque "Offline"
   - Navegue pela aplicação

## 🔐 Autenticação Local

Para testar autenticação:

```bash
# JWT tokens são válidos por 15 minutos
# Refresh tokens por 30 dias

# Teste no terminal
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@legisla-saas.com","password":"admin123"}'
```

## 📈 Monitoramento Local

Acesse as ferramentas de monitoramento:

- **Health Check**: http://localhost:8080/health
- **Metrics**: http://localhost:8080/metrics
- **Swagger**: http://localhost:3001/api/docs
- **Prisma Studio**: http://localhost:5555 (após `npm run db:studio`)

## 🎯 Próximos Passos

1. **Explore a documentação** em `/docs`
2. **Configure seu IDE** com as extensões recomendadas
3. **Familiarize-se com a arquitetura** em `/docs/architecture.md`
4. **Implemente novas features** seguindo os padrões estabelecidos
5. **Execute os testes** regularmente
6. **Configure o deploy** seguindo `/docs/deployment.md`

## 🆘 Suporte

- **Issues**: GitHub Issues
- **Documentação**: `/docs` folder
- **API Docs**: http://localhost:3001/api/docs
- **Health Status**: http://localhost:8080/health