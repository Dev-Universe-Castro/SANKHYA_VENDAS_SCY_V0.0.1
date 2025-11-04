
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from backend.core.database import Base
import uuid

class SyncLog(Base):
    __tablename__ = "sync_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    empresa_id = Column(String, nullable=False)
    tipo = Column(String, nullable=False)  # IN/OUT
    status = Column(String, nullable=False)  # Sucesso/Falha
    duracao = Column(String, nullable=True)
    detalhes = Column(Text, nullable=True)
    erro = Column(Text, nullable=True)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
