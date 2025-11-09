from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Profile Schemas
class StudentProfileCreate(BaseModel):
    name: str
    bio: Optional[str] = None
    gpa: Optional[Dict[str, float]] = None
    grade_level: Optional[str] = None
    institution: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_formats: Optional[List[str]] = None

class StudentProfileResponse(StudentProfileCreate):
    id: UUID
    user_id: UUID
    
    class Config:
        from_attributes = True

class TeacherProfileCreate(BaseModel):
    name: str
    bio: Optional[str] = None
    hourly_rate: float
    subjects_taught: Optional[List[str]] = None
    experience_years: Optional[int] = None
    certifications: Optional[Dict] = None
    avatar_url: Optional[str] = None
    preferred_formats: Optional[List[str]] = None

class TeacherProfileResponse(TeacherProfileCreate):
    id: UUID
    user_id: UUID
    average_rating: float
    
    class Config:
        from_attributes = True

# Request Schemas
class RequestCreate(BaseModel):
    subject: str
    topic: str
    description: Optional[str] = None
    preferred_format: Optional[str] = None
    urgency_level: Optional[str] = None
    hourly_rate: Optional[float] = None
    duration: Optional[str] = None

class RequestResponse(RequestCreate):
    id: UUID
    student_id: UUID
    status: str
    created_at: datetime
    student_name: Optional[str] = None
    student_grade: Optional[str] = None
    
    class Config:
        from_attributes = True

# Search Schemas
class TeacherSearchParams(BaseModel):
    subject: Optional[str] = None
    min_rate: Optional[float] = None
    max_rate: Optional[float] = None
    min_rating: Optional[float] = None
    formats: Optional[List[str]] = None
    page: int = 1
    per_page: int = 10
