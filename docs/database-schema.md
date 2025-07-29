# 🗄️ Esquema do Banco de Dados

## 📋 Visão Geral

O sistema utiliza **PostgreSQL** como banco principal com **Elasticsearch** para busca avançada. O design segue princípios de normalização adequada com índices otimizados para performance.

## 🏗️ Estrutura de Tabelas

### 👥 Usuários e Autenticação

```sql
-- Roles de usuário
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'user', 'guest');

-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessões e refresh tokens
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) NOT NULL UNIQUE,
  device_info JSONB,
  ip_address INET,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permissões customizadas
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES users(id)
);
```

### 📚 Sistema de Categorização

```sql
-- Categorias hierárquicas
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  level INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Temas
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID NOT NULL REFERENCES categories(id),
  color VARCHAR(7), -- Hex color para UI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subtemas
CREATE TABLE subthemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  theme_id UUID NOT NULL REFERENCES themes(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 📜 Documentos Legislativos

```sql
-- Tipos de documentos
CREATE TYPE legislation_type AS ENUM (
  'LEI', 'DECRETO', 'RESOLUCAO', 'PROJETO_LEI', 
  'PROJETO_DECRETO', 'EMENDA', 'MOCAO', 'INDICACAO'
);

-- Status dos documentos
CREATE TYPE document_status AS ENUM (
  'draft', 'active', 'revoked', 'superseded', 'inactive'
);

-- Documentos principais
CREATE TABLE legislation_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  type legislation_type NOT NULL,
  number VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  author VARCHAR(255),
  co_authors TEXT[], -- Array de co-autores
  summary TEXT,
  full_text TEXT NOT NULL,
  keywords TEXT[], -- Array de palavras-chave
  status document_status DEFAULT 'active',
  published_at DATE,
  effective_date DATE,
  revoked_at DATE,
  revoked_by UUID REFERENCES legislation_documents(id),
  superseded_by UUID REFERENCES legislation_documents(id),
  source_url VARCHAR(500),
  pdf_url VARCHAR(500),
  metadata JSONB, -- Metadados flexíveis
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Full text search vector (PostgreSQL)
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('portuguese', 
      coalesce(title, '') || ' ' || 
      coalesce(summary, '') || ' ' || 
      coalesce(full_text, '') || ' ' ||
      coalesce(author, '') || ' ' ||
      array_to_string(coalesce(keywords, '{}'), ' ')
    )
  ) STORED,
  
  -- Constraints
  CONSTRAINT unique_document_number_year UNIQUE (type, number, year)
);

-- Relacionamentos entre documentos
CREATE TABLE document_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id UUID NOT NULL REFERENCES legislation_documents(id),
  target_document_id UUID NOT NULL REFERENCES legislation_documents(id),
  relationship_type VARCHAR(50) NOT NULL, -- 'amends', 'revokes', 'references', etc
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categorização de documentos (many-to-many)
CREATE TABLE document_categories (
  document_id UUID NOT NULL REFERENCES legislation_documents(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, category_id)
);

CREATE TABLE document_themes (
  document_id UUID NOT NULL REFERENCES legislation_documents(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, theme_id)
);

CREATE TABLE document_subthemes (
  document_id UUID NOT NULL REFERENCES legislation_documents(id) ON DELETE CASCADE,
  subtheme_id UUID NOT NULL REFERENCES subthemes(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, subtheme_id)
);
```

### 🔔 Sistema de Notificações

```sql
-- Tipos de notificação
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'whatsapp', 'push');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'cancelled');

-- Assinaturas de alertas
CREATE TABLE alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  query_params JSONB NOT NULL, -- Filtros da busca
  channels notification_channel[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  frequency VARCHAR(20) DEFAULT 'immediate', -- immediate, daily, weekly
  last_triggered TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Log de notificações enviadas
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  subscription_id UUID REFERENCES alert_subscriptions(id),
  channel notification_channel NOT NULL,
  recipient VARCHAR(255) NOT NULL, -- email, phone, etc
  subject VARCHAR(500),
  content TEXT NOT NULL,
  template_id VARCHAR(100),
  template_data JSONB,
  status notification_status DEFAULT 'pending',
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 📊 Sistema de Auditoria e Logs

```sql
-- Auditoria de mudanças
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Logs de busca para analytics
CREATE TABLE search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  query TEXT NOT NULL,
  filters JSONB,
  results_count INTEGER,
  response_time_ms INTEGER,
  clicked_result_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔍 Índices para Performance

```sql
-- Índices principais para legislation_documents
CREATE INDEX idx_legislation_search ON legislation_documents USING gin(search_vector);
CREATE INDEX idx_legislation_type_year ON legislation_documents(type, year DESC);
CREATE INDEX idx_legislation_status ON legislation_documents(status);
CREATE INDEX idx_legislation_published ON legislation_documents(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX idx_legislation_author ON legislation_documents(author) WHERE author IS NOT NULL;
CREATE INDEX idx_legislation_keywords ON legislation_documents USING gin(keywords);

-- Índices para categorização
CREATE INDEX idx_categories_parent ON categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_categories_level ON categories(level);
CREATE INDEX idx_themes_category ON themes(category_id);
CREATE INDEX idx_subthemes_theme ON subthemes(theme_id);

-- Índices para relacionamentos many-to-many
CREATE INDEX idx_doc_categories_category ON document_categories(category_id);
CREATE INDEX idx_doc_themes_theme ON document_themes(theme_id);
CREATE INDEX idx_doc_subthemes_subtheme ON document_subthemes(subtheme_id);

-- Índices para usuários e sessões
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- Índices para notificações
CREATE INDEX idx_subscriptions_user ON alert_subscriptions(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Índices para auditoria
CREATE INDEX idx_audit_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_user ON audit_logs(changed_by);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_search_logs_user ON search_logs(user_id);
CREATE INDEX idx_search_logs_created ON search_logs(created_at DESC);
```

## 🔧 Views e Funções Úteis

```sql
-- View para documentos com informações completas
CREATE VIEW legislation_full AS
SELECT 
  ld.*,
  array_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) as category_names,
  array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as theme_names,
  array_agg(DISTINCT st.name) FILTER (WHERE st.name IS NOT NULL) as subtheme_names,
  u1.first_name || ' ' || u1.last_name as created_by_name,
  u2.first_name || ' ' || u2.last_name as updated_by_name
FROM legislation_documents ld
LEFT JOIN document_categories dc ON ld.id = dc.document_id
LEFT JOIN categories c ON dc.category_id = c.id
LEFT JOIN document_themes dt ON ld.id = dt.document_id  
LEFT JOIN themes t ON dt.theme_id = t.id
LEFT JOIN document_subthemes dst ON ld.id = dst.document_id
LEFT JOIN subthemes st ON dst.subtheme_id = st.id
LEFT JOIN users u1 ON ld.created_by = u1.id
LEFT JOIN users u2 ON ld.updated_by = u2.id
GROUP BY ld.id, u1.first_name, u1.last_name, u2.first_name, u2.last_name;

-- Função para busca full-text
CREATE OR REPLACE FUNCTION search_legislation(
  search_query text,
  doc_type legislation_type DEFAULT NULL,
  doc_year integer DEFAULT NULL,
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title varchar,
  type legislation_type,
  number varchar,
  year integer,
  author varchar,
  summary text,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ld.id,
    ld.title,
    ld.type,
    ld.number,
    ld.year,
    ld.author,
    ld.summary,
    ts_rank(ld.search_vector, plainto_tsquery('portuguese', search_query)) as rank
  FROM legislation_documents ld
  WHERE 
    ld.search_vector @@ plainto_tsquery('portuguese', search_query)
    AND (doc_type IS NULL OR ld.type = doc_type)
    AND (doc_year IS NULL OR ld.year = doc_year)
    AND ld.status = 'active'
  ORDER BY rank DESC, ld.published_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_legislation_updated_at
  BEFORE UPDATE ON legislation_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 📈 Estratégia de Particionamento

```sql
-- Particionamento por ano para legislation_documents (futuro)
-- Útil quando o volume de dados crescer significativamente

-- CREATE TABLE legislation_documents_2024 PARTITION OF legislation_documents
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- CREATE TABLE legislation_documents_2025 PARTITION OF legislation_documents  
-- FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

## 🔒 Políticas de Segurança (RLS)

```sql
-- Row Level Security para controle de acesso granular
ALTER TABLE legislation_documents ENABLE ROW LEVEL SECURITY;

-- Política para leitura: usuários podem ver documentos ativos
CREATE POLICY legislation_read_policy ON legislation_documents
  FOR SELECT
  USING (status = 'active' OR 
         (SELECT role FROM users WHERE id = current_setting('app.current_user_id')::uuid) IN ('admin', 'editor'));

-- Política para escrita: apenas admins e editores
CREATE POLICY legislation_write_policy ON legislation_documents
  FOR ALL
  USING ((SELECT role FROM users WHERE id = current_setting('app.current_user_id')::uuid) IN ('admin', 'editor'));
```