# 🚀 Deployment e Infraestrutura

## 📋 Visão Geral

O LegislaSaaS utiliza uma arquitetura cloud-native na AWS com containers ECS Fargate para máxima escalabilidade e disponibilidade.

## 🏗️ Ambientes

### Desenvolvimento (Development)
- **Branch**: `develop`
- **URL**: `https://dev.legisla-saas.com`
- **Propósito**: Testes de novas funcionalidades
- **Deploy**: Automático via GitHub Actions

### Produção (Production)
- **Branch**: `main`
- **URL**: `https://app.legisla-saas.com`
- **Propósito**: Ambiente live para usuários
- **Deploy**: Automático com aprovação manual

## 🛠️ Stack de Infraestrutura

### Compute
- **ECS Fargate**: Containers sem servidor
- **Application Load Balancer**: Distribuição de tráfego
- **Auto Scaling**: Escalonamento automático baseado em métricas

### Storage
- **RDS PostgreSQL**: Banco de dados principal (Multi-AZ)
- **ElastiCache Redis**: Cache e sessões
- **OpenSearch**: Motor de busca
- **S3**: Arquivos estáticos e backups

### Network
- **VPC**: Rede privada virtual
- **CloudFront**: CDN global
- **Route 53**: DNS
- **Internet Gateway + NAT Gateway**: Conectividade

### Security
- **WAF**: Firewall de aplicação web
- **Secrets Manager**: Gerenciamento de secrets
- **IAM Roles**: Controle de acesso
- **Security Groups**: Firewall de rede

## 🔧 Configuração Inicial

### 1. Requisitos
```bash
# Ferramentas necessárias
- AWS CLI v2
- Terraform >= 1.0
- Docker
- Node.js >= 18
```

### 2. Configuração AWS
```bash
# Configure credenciais AWS
aws configure

# Crie bucket para estado do Terraform
aws s3 mb s3://legisla-saas-terraform-state

# Habilite versionamento
aws s3api put-bucket-versioning \
  --bucket legisla-saas-terraform-state \
  --versioning-configuration Status=Enabled
```

### 3. Deploy da Infraestrutura
```bash
# Clone o repositório
git clone https://github.com/your-org/legisla-saas
cd legisla-saas

# Inicialize Terraform
cd infrastructure/terraform
terraform init

# Planeje as mudanças
terraform plan -var-file="environments/prod.tfvars"

# Aplique a infraestrutura
terraform apply -var-file="environments/prod.tfvars"
```

### 4. Configuração dos Secrets
```bash
# Crie secrets no AWS Secrets Manager
aws secretsmanager create-secret \
  --name "legisla-saas/database" \
  --secret-string '{"username":"postgres","password":"your-secure-password"}'

aws secretsmanager create-secret \
  --name "legisla-saas/jwt" \
  --secret-string '{"secret":"your-jwt-secret","refresh_secret":"your-refresh-secret"}'
```

## 📦 Processo de Deploy

### Pipeline CI/CD
O pipeline executa automaticamente nos seguintes cenários:

1. **Pull Request**: Executa testes e validações
2. **Push para develop**: Deploy automático para desenvolvimento
3. **Push para main**: Deploy para produção (com aprovação)

### Etapas do Pipeline

#### 1. Qualidade e Testes
```yaml
- Type checking (TypeScript)
- ESLint (Code quality)
- Unit tests (Jest/Vitest)
- Integration tests
- Security scanning (Trivy)
- Dependency audit
```

#### 2. Build
```yaml
- Build Docker images
- Push para ECR
- Tag com SHA do commit
- Cache layers para otimização
```

#### 3. Deploy
```yaml
- Update ECS services
- Run database migrations
- Deploy frontend para S3
- Invalidate CloudFront cache
- Health checks
```

## 🏃‍♂️ Deploy Manual

### Backend Services
```bash
# Build e push das imagens
docker build -t auth-service ./apps/auth-service
docker tag auth-service:latest $ECR_REGISTRY/legisla-saas-auth-service:latest
docker push $ECR_REGISTRY/legisla-saas-auth-service:latest

# Update ECS service
aws ecs update-service \
  --cluster legisla-saas-cluster \
  --service auth-service \
  --force-new-deployment
```

### Frontend
```bash
# Build da aplicação React
cd apps/web
npm run build

# Deploy para S3
aws s3 sync dist/ s3://legisla-saas-frontend --delete

# Invalidate CDN
aws cloudfront create-invalidation \
  --distribution-id E1234567890 \
  --paths "/*"
```

## 📊 Monitoramento

### Métricas Principais
- **CPU/Memory**: Utilização dos containers
- **Response Time**: Tempo de resposta das APIs
- **Error Rate**: Taxa de erro por serviço
- **Database**: Conexões, queries/sec, latência
- **Search**: Performance do Elasticsearch

### Alertas Configurados
```yaml
- CPU > 80% por 5 minutos
- Memory > 85% por 5 minutos
- Error rate > 5% por 2 minutos
- Response time > 2s por 5 minutos
- Database connections > 80%
```

### Logs
```bash
# Visualizar logs dos serviços
aws logs tail legisla-saas-auth-service --follow

# Buscar logs específicos
aws logs filter-log-events \
  --log-group-name legisla-saas-auth-service \
  --filter-pattern "ERROR"
```

## 🔒 Segurança

### Certificados SSL
```bash
# Certificados gerenciados via ACM
aws acm request-certificate \
  --domain-name legisla-saas.com \
  --subject-alternative-names *.legisla-saas.com \
  --validation-method DNS
```

### WAF Rules
- Rate limiting (100 req/min por IP)
- Bloqueio de IPs maliciosos
- Proteção contra SQL injection
- Proteção contra XSS

### Backup Strategy
- **RDS**: Backup automático diário (retenção 7 dias)
- **Snapshots**: Manual antes de deploys importantes
- **S3**: Versionamento habilitado
- **Cross-region**: Replicação para DR

## 🔄 Rollback

### Rollback Automático
```bash
# Via GitHub Actions
gh workflow run rollback.yml \
  --ref main \
  -f service=auth-service \
  -f version=v1.2.3
```

### Rollback Manual
```bash
# Rollback do ECS service
aws ecs update-service \
  --cluster legisla-saas-cluster \
  --service auth-service \
  --task-definition auth-service:42

# Rollback do frontend
aws s3 sync s3://legisla-saas-frontend-backup/v1.2.3/ s3://legisla-saas-frontend/ --delete
```

## 🎯 Otimizações de Performance

### Auto Scaling
```yaml
# CPU-based scaling
Target CPU: 70%
Min instances: 2
Max instances: 10
Scale out: +1 instance quando CPU > 70% por 2 min
Scale in: -1 instance quando CPU < 50% por 5 min
```

### Caching Strategy
- **CloudFront**: Assets estáticos (TTL 1 ano)
- **Redis**: Sessões e cache da aplicação
- **Database**: Query result caching
- **Application**: Memory caching para dados frequentes

### Database Optimization
- **Read Replicas**: Para consultas de relatórios
- **Connection Pooling**: PgBouncer
- **Índices**: Estratégicos para busca
- **Partitioning**: Por ano (futuro)

## 📈 Scaling Strategy

### Horizontal Scaling
- ECS Auto Scaling baseado em métricas
- Database read replicas
- ElastiCache cluster mode

### Vertical Scaling
- Upgrade de instance types conforme necessário
- Database instance scaling

### Multi-Region (Futuro)
- Replicação cross-region para DR
- Global load balancing
- Data residency compliance

## 🛡️ Disaster Recovery

### RTO/RPO Targets
- **RTO**: 1 hora (Recovery Time Objective)
- **RPO**: 15 minutos (Recovery Point Objective)

### DR Procedures
1. **Database**: Restore do último snapshot
2. **Application**: Deploy em região secundária
3. **DNS**: Switchover via Route 53
4. **Data**: Sync from backups

### Testing
- DR drill mensal
- Backup restore testing
- Chaos engineering (futuro)