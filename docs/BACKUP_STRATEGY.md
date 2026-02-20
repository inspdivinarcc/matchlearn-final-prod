# Estratégia de Backup — AntiGravity App

## Visão Geral
- Provider: Supabase/Neon [A Confirmar Produção]
- Banco de dados: PostgreSQL
- Dados críticos: usuários, batalhas, inventário, transações, NFTs

## Configuração de Backups

### Frequência
- Backups automáticos: Diários (configurado no dashboard do provider)
- Backups manuais: Antes de migrations críticas

### Retenção
- Backups diários: 30 dias
- Backups semanais: 90 dias (se disponível no plano)

### Objetivos de Recuperação
- RTO (Recovery Time Objective): 4 horas
- RPO (Recovery Point Objective): 24 horas (último backup diário)

## Processo de Restore

### Supabase
1. Acessar Dashboard → Database → Backups
2. Selecionar backup desejado
3. Clicar em "Restore" e confirmar
4. Aguardar conclusão (5-15 minutos)
5. Verificar integridade com queries de validação

### Neon (caso seja o provider)
1. Acessar Dashboard → Branches → Backups
2. Selecionar snapshot
3. Criar nova branch a partir do backup
4. Testar integridade antes de promover para produção

## Checklist de Teste Mensal
- [ ] Listar backups disponíveis no dashboard
- [ ] Verificar que backups estão sendo criados diariamente
- [ ] Testar restore em ambiente de staging (trimestral)
- [ ] Validar integridade dos dados restaurados
- [ ] Documentar tempo de restore e problemas encontrados

## Queries de Validação Pós-Restore
```sql
-- Contar registros principais
SELECT 'users' as table, COUNT(*) FROM "User";
SELECT 'battles' as table, COUNT(*) FROM "Battle";
SELECT 'inventory' as table, COUNT(*) FROM "Inventory";

-- Verificar usuários criados nas últimas 24h
SELECT COUNT(*) FROM "User" WHERE "createdAt" > NOW() - INTERVAL '24 hours';

-- Verificar últimas transações
SELECT * FROM "Transaction" ORDER BY "createdAt" DESC LIMIT 10;
```

## Responsável
- Responsável primário: [Nome do DevOps/Tech Lead]
- Backup: [Nome do desenvolvedor senior]
- Contato de emergência: [Email/Slack]

## Configuração no Provider

### Ações Necessárias
1. Acessar dashboard do Supabase/Neon
2. Verificar que backups automáticos estão habilitados
3. Configurar notificações por email em caso de falha de backup
4. Testar processo de restore uma vez antes do lançamento

### Links Úteis
- Dashboard: [URL do dashboard]
- Documentação de backup: Supabase / Neon docs
- Runbook de emergência: `/docs/RUNBOOK.md` (criar futuramente)

## Histórico de Restores
| Data | Motivo | Tempo de Restore | Perda de Dados | Observações |
|------|--------|------------------|----------------|-------------|
| - | - | - | - | Nenhum restore realizado ainda |
