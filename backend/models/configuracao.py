
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from backend.core.database import Base
import uuid

class Configuracao(Base):
    __tablename__ = "configuracoes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    chave = Column(String, unique=True, nullable=False)
    valor = Column(Text, nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
