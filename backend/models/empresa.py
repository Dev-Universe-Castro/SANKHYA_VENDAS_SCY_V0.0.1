
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from backend.core.database import Base
import uuid

class Empresa(Base):
    __tablename__ = "empresas"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    ultima_sync = Column(DateTime, nullable=True)
    
    # Credenciais Sankhya
    sankhya_endpoint = Column(String, nullable=True)
    sankhya_app_key = Column(String, nullable=True)
    sankhya_username = Column(String, nullable=True)
    sankhya_password_encrypted = Column(Text, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
