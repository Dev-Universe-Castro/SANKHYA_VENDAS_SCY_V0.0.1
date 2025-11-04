
#!/bin/bash

echo "🔧 Instalando dependências..."

echo "📦 Instalando pacotes Node.js..."
npm install

echo "🐍 Instalando pacotes Python..."
pip install -r requirements.txt

echo "🔴 Iniciando Redis..."
redis-server --daemonize yes

sleep 2

echo "✅ Dependências instaladas!"
echo "🚀 Iniciando sistema completo..."
echo ""
echo "Frontend: http://localhost:5000"
echo "Backend API: http://localhost:8000"
echo "Credenciais: admin@sistema.com / admin123"
echo ""

npm run dev &
python backend/seed.py && uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload &
celery -A backend.worker.celery_app worker --loglevel=info &

wait
