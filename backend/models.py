from sqlalchemy import Column, String, Integer, Float, DateTime, Enum, ForeignKey, ARRAY, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"

class RequestStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    EXPIRED = "expired"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False)
    requests = relationship("Request", back_populates="student")

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    name = Column(String, nullable=False)
    bio = Column(String)
    gpa = Column(JSON)  # {"Math": 3.8, "Physics": 3.5}
    grade_level = Column(String)
    institution = Column(String)
    avatar_url = Column(String)
    preferred_formats = Column(ARRAY(String))
    
    user = relationship("User", back_populates="student_profile")

class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    name = Column(String, nullable=False)
    bio = Column(String)
    hourly_rate = Column(Float, nullable=False)
    subjects_taught = Column(JSON)  # ["Math", "Physics", "Chemistry"]
    experience_years = Column(Integer)
    certifications = Column(JSON)
    avatar_url = Column(String)
    preferred_formats = Column(ARRAY(String))
    average_rating = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="teacher_profile")

class Request(Base):
    __tablename__ = "requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    subject = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    description = Column(String)
    preferred_format = Column(String)
    urgency_level = Column(String)
    hourly_rate = Column(Float)
    duration = Column(String)
    status = Column(Enum(RequestStatus), default=RequestStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("User", back_populates="requests")
