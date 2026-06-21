# Script de Automação de Infraestrutura e Setup - MatchLearn
Clear-Host
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   INICIALIZANDO SETUP AUTOMÁTICO - TRINITY OMEGA" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Verificação de Variáveis de Ambiente
Write-Host "[1/5] Verificando arquivos de configuração (.env)..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Write-Host "[AVISO] .env.local não encontrado! Criando um modelo básico..." -ForegroundColor Magenta
    "NEXTAUTH_SECRET=`"$([guid]::NewGuid().ToString())`"`nGITHUB_ID=`"SEU_GITHUB_ID`"`nGITHUB_SECRET=`"SEU_GITHUB_SECRET`"`nNEXTAUTH_URL=`"http://localhost:3000`"" | Out-File -Encoding utf8 .env.local
    Write-Host "[!] Por favor, configure suas credenciais do GitHub no arquivo .env.local criado antes de prosseguir." -ForegroundColor Red
    Exit
} else {
    Write-Host "[✓] Arquivos de ambiente detectados." -ForegroundColor Green
}

# 2. Instalação de Dependências
Write-Host "[2/5] Verificando e instalando dependências (npm install)..." -ForegroundColor Yellow
npm install

# 3. Sincronização do Banco de Dados (Prisma + Neon)
Write-Host "[3/5] Sincronizing Banco de Dados com Prisma Client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "[3/5] Empurrando esquemas atualizados para a nuvem (Neon)..." -ForegroundColor Yellow
npx prisma db push

# 4. Limpeza Crítica de Cache
Write-Host "[4/5] Executando limpeza profunda de cache (.next)..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "[✓] Cache antigo eliminado com sucesso." -ForegroundColor Green
} else {
    Write-Host "[✓] Nenhum cache residual detectado." -ForegroundColor Green
}

# 5. Inicialização do Servidor
Write-Host "[5/5] Setup concluído com sucesso! Iniciando ambiente dinâmico..." -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
npm run dev