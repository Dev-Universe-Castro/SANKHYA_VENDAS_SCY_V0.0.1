
from backend.core.database import SessionLocal, engine, Base
from backend.core.security import hash_password
from backend.core.crypto import encrypt
from backend.models.usuario import Usuario
from backend.models.empresa import Empresa
from backend.models.configuracao import Configuracao

def seed_database():
    print("🌱 Iniciando seed do banco de dados...")
    
    # Criar tabelas
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Criar usuário admin
        admin = db.query(Usuario).filter(Usuario.email == "admin@central.com").first()
        if not admin:
            admin = Usuario(
                email="admin@central.com",
                password=hash_password("admin123"),
                nome="Administrador",
                perfil="ADM"
            )
            db.add(admin)
            print("✅ Usuário admin criado: admin@central.com / admin123")
        
        # Criar empresas de exemplo
        if db.query(Empresa).count() == 0:
            empresas = [
                Empresa(
                    nome="Empresa Alpha Ltda",
                    ativo=True,
                    sankhya_endpoint="https://api.sankhya.com.br/alpha",
                    sankhya_app_key="ALPHA_APP_KEY_123",
                    sankhya_username="alpha_user",
                    sankhya_password_encrypted=encrypt("alpha_pass")
                ),
                Empresa(
                    nome="Empresa Beta S.A.",
                    ativo=True,
                    sankhya_endpoint="https://api.sankhya.com.br/beta",
                    sankhya_app_key="BETA_APP_KEY_456",
                    sankhya_username="beta_user",
                    sankhya_password_encrypted=encrypt("beta_pass")
                ),
            ]
            for emp in empresas:
                db.add(emp)
            print("✅ Empresas de exemplo criadas")
        
        # Criar configurações padrão
        configs = [
            ("intervalo_sync", "15"),
            ("unidade_intervalo", "minutos"),
            ("retry_attempts", "3"),
            ("retry_delay", "5")
        ]
        for chave, valor in configs:
            if not db.query(Configuracao).filter(Configuracao.chave == chave).first():
                db.add(Configuracao(chave=chave, valor=valor))
        
        db.commit()
        print("✅ Seed concluído com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro no seed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
