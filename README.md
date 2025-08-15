# Sistema de Gestão Pública Integrada - Município de Mendes/RJ

## 📋 Sobre o Projeto

O Sistema de Gestão Pública Integrada é uma solução completa desenvolvida para atender às necessidades de gestão municipal conforme o **Termo de Referência do Pregão Eletrônico nº 90022/2025** do Município de Mendes/RJ.

O sistema atende às exigências do **Decreto Federal nº 10.540/2020 (SIAFIC)** e da **Lei Federal nº 14.133/2021**, integrando todos os módulos de gestão pública em uma única plataforma moderna e escalável.

## 🏛️ Módulos Funcionais

### Gestão Financeira
- **Contabilidade Pública**: Lançamentos contábeis, plano de contas, balancetes e demonstrativos
- **Planejamento e Orçamento**: PPA, LDO, LOA e execução orçamentária
- **Tesouraria**: Contas bancárias, movimentações e conciliação
- **Compras e Licitações**: Processos licitatórios, pregão eletrônico, contratos e fornecedores

### Gestão de Pessoas
- **Folha de Pagamento**: Processamento de folha e portal do servidor
- **Recursos Humanos**: Cadastro de funcionários, frequência e benefícios

### Serviços Municipais
- **Arrecadação e Tributação**: ISS, IPTU, taxas e dívida ativa
- **Patrimônio e Almoxarifado**: Controle de bens patrimoniais e estoque
- **Gestão de Frotas**: Controle de veículos e manutenções
- **Gestão da Saúde**: Pacientes, procedimentos e unidades de saúde
- **Assistência Social**: Programas sociais e cadastro único

### Recursos Avançados
- **Relatórios e Business Intelligence**: Dashboards interativos e relatórios personalizados
- **Integrações**: eSocial, EFD-Reinf, DCTFWeb, SISOBRASNET, SICONFI, Receita Federal, TJ-RJ, PNCP
- **Auditoria e Segurança**: Logs de auditoria, controle de permissões e assinatura digital

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Styled-components** para estilização
- **Zustand** para gerenciamento de estado
- **React Router DOM** para roteamento
- **React Hook Form** para formulários
- **Axios** para requisições HTTP
- **React Icons** para ícones
- **Date-fns** para manipulação de datas

### Backend
- **Node.js** com TypeScript
- **NestJS** como framework principal
- **PostgreSQL** como banco de dados
- **TypeORM** para ORM
- **JWT** para autenticação
- **Passport** para estratégias de autenticação
- **Swagger** para documentação da API
- **Helmet** e **CORS** para segurança

### Infraestrutura
- **Docker** e **Docker Compose** para containerização
- **Git** para versionamento
- **ESLint** e **Prettier** para qualidade de código
- **Jest** para testes

## 📁 Estrutura do Projeto

```
sistema-gestao-publica/
├── frontend/                    # Aplicação React
│   ├── public/                  # Arquivos públicos
│   ├── src/
│   │   ├── assets/             # Recursos estáticos
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── contexts/           # Contextos React
│   │   ├── hooks/              # Hooks customizados
│   │   ├── layouts/            # Layouts da aplicação
│   │   ├── modules/            # Módulos funcionais
│   │   │   ├── contabilidade/  # Módulo de contabilidade
│   │   │   ├── usuarios/       # Módulo de usuários
│   │   │   └── dashboard/      # Módulo de dashboard
│   │   ├── pages/              # Páginas principais
│   │   ├── routes/             # Configuração de rotas
│   │   ├── services/           # Serviços de API
│   │   ├── store/              # Gerenciamento de estado
│   │   ├── styles/             # Estilos globais e tema
│   │   ├── types/              # Tipos TypeScript
│   │   └── utils/              # Utilitários
│   └── package.json
├── backend/                     # API NestJS
│   ├── src/
│   │   ├── config/             # Configurações
│   │   ├── modules/            # Módulos da API
│   │   │   ├── auth/           # Autenticação
│   │   │   ├── contabilidade/  # Módulo de contabilidade
│   │   │   └── usuarios/       # Módulo de usuários
│   │   ├── common/             # Recursos compartilhados
│   │   │   ├── filters/        # Filtros de exceção
│   │   │   ├── interceptors/   # Interceptors
│   │   │   └── pipes/          # Pipes de validação
│   │   ├── guards/             # Guards de autorização
│   │   ├── decorators/         # Decoradores customizados
│   │   └── migrations/         # Migrações do banco
│   └── package.json
├── docker-compose.yml           # Configuração Docker
├── README.md                    # Documentação
└── .gitignore                   # Arquivos ignorados
```

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18.x ou superior)
- **npm** (versão 8.x ou superior)
- **PostgreSQL** (versão 13.x ou superior)
- **Git** (versão 2.x ou superior)

## 📦 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/sistema-gestao-publica-mendes.git
cd sistema-gestao-publica-mendes
```

### 2. Configuração do Frontend

```bash
# Instalar dependências
npm install

# Criar arquivo de variáveis de ambiente
cp .env.example .env.local

# Editar as variáveis de ambiente conforme necessário
```

**Variáveis de ambiente do frontend (.env.local):**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Sistema de Gestão Pública
```

### 3. Configuração do Backend

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo de variáveis de ambiente
cp .env.example .env

# Editar as variáveis de ambiente conforme necessário
```

**Variáveis de ambiente do backend (.env):**
```env
# Configurações da aplicação
NODE_ENV=development
PORT=3001
API_PREFIX=api

# Configurações JWT
JWT_SECRET=seu_jwt_secret_super_secreto_aqui
JWT_EXPIRES_IN=7d

# Configurações do banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gestao_publica

# Configurações de CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Configuração do Banco de Dados

#### Opção A: PostgreSQL Local

```bash
# Criar banco de dados
createdb gestao_publica

# Executar migrações (quando disponíveis)
cd backend
npm run migration:run
```

#### Opção B: Docker (Recomendado)

```bash
# Criar e iniciar containers
docker-compose up -d postgres

# Aguardar o PostgreSQL inicializar
sleep 10

# Executar migrações
cd backend
npm run migration:run
```

## 🚀 Executando o Projeto

### Desenvolvimento

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

#### Terminal 2 - Frontend
```bash
npm start
```

### Produção

```bash
# Build do frontend
npm run build

# Build do backend
cd backend
npm run build

# Iniciar aplicação
npm run start:prod
```

### Docker (Produção)

```bash
# Construir e iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

## 🔐 Acesso ao Sistema

### URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Documentação Swagger**: http://localhost:3001/api/docs

### Usuário Padrão (Desenvolvimento)

```
Email: admin@mendes.rj.gov.br
Senha: admin123
```

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI em:
**http://localhost:3001/api/docs**

### Principais Endpoints

#### Autenticação
- `POST /api/auth/login` - Realizar login
- `POST /api/auth/logout` - Realizar logout
- `POST /api/auth/refresh` - Renovar token

#### Contabilidade
- `GET /api/contabilidade/lancamentos` - Listar lançamentos
- `POST /api/contabilidade/lancamentos` - Criar lançamento
- `PUT /api/contabilidade/lancamentos/:id` - Atualizar lançamento
- `DELETE /api/contabilidade/lancamentos/:id` - Excluir lançamento

#### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário

## 🧪 Testes

### Frontend
```bash
npm test                    # Executar testes
npm run test:coverage      # Executar com cobertura
```

### Backend
```bash
cd backend
npm test                    # Testes unitários
npm run test:e2e           # Testes end-to-end
npm run test:cov           # Cobertura de testes
```

## 📝 Scripts Disponíveis

### Frontend
- `npm start` - Desenvolvimento
- `npm run build` - Build de produção
- `npm test` - Executar testes
- `npm run lint` - Linting do código

### Backend
- `npm run start:dev` - Desenvolvimento com hot reload
- `npm run start:prod` - Produção
- `npm run build` - Build do projeto
- `npm run migration:generate` - Gerar migração
- `npm run migration:run` - Executar migrações

## 🏗️ Arquitetura

### Frontend (React)
- **Arquitetura baseada em módulos** para escalabilidade
- **Zustand** para estado global simples e performático
- **Styled-components** para CSS-in-JS com tema dinâmico
- **Axios** com interceptors para tratamento de erros
- **React Router** com lazy loading e proteção de rotas

### Backend (NestJS)
- **Arquitetura modular** seguindo princípios SOLID
- **TypeORM** para mapeamento objeto-relacional
- **Guards e Decorators** para autorização
- **Interceptors** para logging e transformação de dados
- **Swagger** para documentação automática

### Banco de Dados
- **PostgreSQL** para dados relacionais
- **Migrações** para versionamento do schema
- **Índices otimizados** para performance
- **Backup automático** configurado

## 🔒 Segurança

- **JWT** para autenticação stateless
- **Bcrypt** para hash de senhas
- **Helmet** para headers de segurança
- **CORS** configurado adequadamente
- **Rate limiting** para prevenir abuso
- **Validação** rigorosa de dados de entrada
- **Logs de auditoria** para rastreabilidade

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe de Desenvolvimento

- **Desenvolvedor Principal**: Sistema de Gestão Pública
- **Email**: contato@gestao-publica.gov.br
- **Município**: Mendes/RJ

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **Email**: suporte@mendes.rj.gov.br
- **Telefone**: (21) 0000-0000
- **Horário**: Segunda a Sexta, 8h às 17h

---

**Desenvolvido com ❤️ para a gestão pública eficiente do Município de Mendes/RJ**
