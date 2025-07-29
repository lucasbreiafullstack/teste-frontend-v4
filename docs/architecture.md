# 🏗️ Arquitetura do Sistema LegislaSaaS

## 📊 Visão Geral da Arquitetura

### Princípios Arquiteturais

1. **Domain-Driven Design (DDD)**: Separação clara por domínios de negócio
2. **Event-Driven Architecture**: Comunicação assíncrona entre serviços
3. **CQRS Pattern**: Separação de comandos e consultas para performance
4. **API-First**: Contratos bem definidos entre serviços
5. **Cloud-Native**: Projetado para ambientes containerizados

## 🎯 Microsserviços

### 1. Authentication Service
**Responsabilidades:**
- Gerenciamento de usuários e perfis
- Autenticação JWT + Refresh Token
- Autorização baseada em roles (RBAC)
- Integração com provedores OAuth (Google, Microsoft)

**Tecnologias:**
- NestJS + TypeScript
- Passport.js + JWT
- bcrypt para hash de senhas
- Rate limiting com Redis

**APIs:**
```typescript
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
GET  /auth/profile
PUT  /auth/profile
POST /auth/forgot-password
POST /auth/reset-password
```

### 2. Legislation Service
**Responsabilidades:**
- CRUD de normas legislativas
- Categorização e taxonomia
- Versionamento de documentos
- Indexação para busca

**Tecnologias:**
- NestJS + TypeScript
- Prisma ORM
- Elasticsearch client
- Bull Queue para processamento

**Entidades Principais:**
```typescript
interface LegislationDocument {
  id: string;
  title: string;
  type: LegislationType; // LEI, DECRETO, RESOLUCAO, etc
  number: string;
  year: number;
  author: string;
  summary: string;
  fullText: string;
  categories: Category[];
  themes: Theme[];
  subthemes: Subtheme[];
  status: DocumentStatus;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Notification Service
**Responsabilidades:**
- Disparo de alertas automáticos
- Templates de notificações
- Integração com múltiplos canais (Email, SMS, WhatsApp)
- Agendamento de envios

**Tecnologias:**
- Node.js + Express
- Bull Queue + Redis
- SendGrid (Email)
- Twilio (SMS)
- WhatsApp Business API

**Eventos Processados:**
- `legislation.created`
- `legislation.updated`
- `user.subscribed`
- `search.alert.triggered`

### 4. Search Service
**Responsabilidades:**
- Busca contextual avançada
- Indexação de documentos
- Análise semântica
- Cache de resultados

**Tecnologias:**
- NestJS + TypeScript
- Elasticsearch 8.x
- Redis para cache
- Natural Language Processing

## 🗄️ Estratégia de Dados

### PostgreSQL (Banco Principal)
```sql
-- Estrutura de tabelas principais
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE legislation_documents (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  type legislation_type NOT NULL,
  number VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  author VARCHAR(255),
  summary TEXT,
  full_text TEXT NOT NULL,
  status document_status DEFAULT 'active',
  published_at DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  -- Full text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(full_text, ''))
  ) STORED
);

-- Índices para performance
CREATE INDEX idx_legislation_search ON legislation_documents USING gin(search_vector);
CREATE INDEX idx_legislation_type_year ON legislation_documents(type, year);
CREATE INDEX idx_legislation_status ON legislation_documents(status);
```

### Elasticsearch (Busca Avançada)
```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "portuguese",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": { "type": "completion" }
        }
      },
      "fullText": {
        "type": "text",
        "analyzer": "portuguese"
      },
      "categories": {
        "type": "nested",
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "text", "analyzer": "portuguese" }
        }
      },
      "themes": { "type": "keyword" },
      "subthemes": { "type": "keyword" },
      "author": { "type": "text", "analyzer": "portuguese" },
      "year": { "type": "integer" },
      "type": { "type": "keyword" },
      "publishedAt": { "type": "date" }
    }
  }
}
```

## 🔍 Estratégia de Busca

### Busca Híbrida (PostgreSQL + Elasticsearch)
1. **Busca Simples**: PostgreSQL Full Text Search
2. **Busca Avançada**: Elasticsearch com análise semântica
3. **Auto-complete**: Elasticsearch Completion Suggester
4. **Busca por Similaridade**: Vector similarity com embeddings

### Algoritmo de Busca Contextual
```typescript
class AdvancedSearchService {
  async contextualSearch(query: SearchQuery): Promise<SearchResults> {
    // 1. Parse da query e extração de entidades
    const entities = await this.nlpService.extractEntities(query.text);
    
    // 2. Busca no Elasticsearch com boost por relevância
    const esQuery = {
      bool: {
        must: [
          {
            multi_match: {
              query: query.text,
              fields: ['title^3', 'summary^2', 'fullText'],
              type: 'best_fields'
            }
          }
        ],
        filter: [
          ...this.buildFilters(query.filters)
        ],
        should: [
          // Boost por categoria/tema/subtema
          ...this.buildCategoryBoosts(entities),
          // Boost por recência
          {
            function_score: {
              gauss: {
                publishedAt: {
                  origin: 'now',
                  scale: '365d',
                  decay: 0.5
                }
              }
            }
          }
        ]
      }
    };

    return await this.elasticsearchService.search(esQuery);
  }
}
```

## 🚀 Performance e Escalabilidade

### Estratégias de Cache
1. **Redis** para sessões e cache de aplicação
2. **CDN** (CloudFront) para assets estáticos
3. **Database Connection Pooling**
4. **Query Result Caching** no Elasticsearch

### Otimizações de Performance
- **Lazy Loading** no frontend
- **Pagination** com cursor-based navigation
- **Debounce** em buscas em tempo real
- **Service Worker** para cache offline
- **Database Indexing** estratégico

## 🔐 Segurança

### Autenticação e Autorização
```typescript
// JWT Payload Structure
interface JWTPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
}

// Role-Based Access Control
enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
  GUEST = 'guest'
}

const permissions = {
  [UserRole.ADMIN]: ['*'],
  [UserRole.EDITOR]: ['legislation:read', 'legislation:write', 'categories:write'],
  [UserRole.USER]: ['legislation:read', 'search:use', 'alerts:manage'],
  [UserRole.GUEST]: ['legislation:read', 'search:use']
};
```

### Medidas de Segurança
- **HTTPS** obrigatório em produção
- **CORS** configurado adequadamente
- **Rate Limiting** por IP e usuário
- **Input Validation** com Zod/Joi
- **SQL Injection** prevenção via ORM
- **XSS Protection** com sanitização
- **CSRF Protection** com tokens
- **Audit Logs** para ações sensíveis

## 📈 Monitoramento e Observabilidade

### Logs Estruturados
```typescript
// Winston Logger Configuration
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'legislation-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Métricas e Alertas
- **Application Performance Monitoring** (APM)
- **Database Performance** monitoring
- **API Response Times**
- **Error Rates** por endpoint
- **Search Performance** metrics
- **User Behavior** analytics

### Health Checks
```typescript
@Controller('health')
export class HealthController {
  @Get()
  async healthCheck(): Promise<HealthCheckResult> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        elasticsearch: await this.checkElasticsearch()
      }
    };
  }
}
```