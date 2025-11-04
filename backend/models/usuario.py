
from sqlalchemy import Column, String, Text
from backend.core.database import Base
import uuid

class Usuario(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    nome = Column(String, nullable=False)
    perfil = Column(String, default="ADM", nullable=False)
