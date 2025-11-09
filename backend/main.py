from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from datetime import timedelta
import models
import schemas
import auth
from database import get_db, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fast-Classified API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Authentication Endpoints ====================

@app.post("/api/auth/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        role=models.UserRole(user.role)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
def get_me(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    profile = None
    if current_user.role == models.UserRole.STUDENT:
        profile = db.query(models.StudentProfile).filter(
            models.StudentProfile.user_id == current_user.id
        ).first()
    elif current_user.role == models.UserRole.TEACHER:
        profile = db.query(models.TeacherProfile).filter(
            models.TeacherProfile.user_id == current_user.id
        ).first()
    
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
        "profile": profile,
        "has_profile": profile is not None
    }

# ==================== Profile Endpoints ====================

@app.post("/api/profiles/student", response_model=schemas.StudentProfileResponse)
def create_student_profile(
    profile: schemas.StudentProfileCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can create student profiles")
    
    existing = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    new_profile = models.StudentProfile(
        user_id=current_user.id,
        **profile.model_dump()
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@app.post("/api/profiles/teacher", response_model=schemas.TeacherProfileResponse)
def create_teacher_profile(
    profile: schemas.TeacherProfileCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != models.UserRole.TEACHER:
        raise HTTPException(status_code=403, detail="Only teachers can create teacher profiles")
    
    existing = db.query(models.TeacherProfile).filter(
        models.TeacherProfile.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    new_profile = models.TeacherProfile(
        user_id=current_user.id,
        **profile.model_dump()
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@app.patch("/api/profiles/student/{profile_id}", response_model=schemas.StudentProfileResponse)
def update_student_profile(
    profile_id: str,
    profile_update: schemas.StudentProfileCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.id == profile_id,
        models.StudentProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile_update.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile

@app.patch("/api/profiles/teacher/{profile_id}", response_model=schemas.TeacherProfileResponse)
def update_teacher_profile(
    profile_id: str,
    profile_update: schemas.TeacherProfileCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.TeacherProfile).filter(
        models.TeacherProfile.id == profile_id,
        models.TeacherProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile_update.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile

# ==================== Request Feed Endpoints ====================

@app.post("/api/requests", response_model=schemas.RequestResponse)
def create_request(
    request: schemas.RequestCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != models.UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can create requests")
    
    new_request = models.Request(
        student_id=current_user.id,
        **request.model_dump()
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    # Add student info
    student_profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()
    
    response = schemas.RequestResponse.model_validate(new_request)
    if student_profile:
        response.student_name = student_profile.name
        response.student_grade = student_profile.grade_level
    
    return response

@app.get("/api/requests", response_model=List[schemas.RequestResponse])
def get_requests(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * per_page
    requests = db.query(models.Request).filter(
        models.Request.status == models.RequestStatus.ACTIVE
    ).order_by(models.Request.created_at.desc()).offset(offset).limit(per_page).all()
    
    result = []
    for req in requests:
        student_profile = db.query(models.StudentProfile).filter(
            models.StudentProfile.user_id == req.student_id
        ).first()
        
        req_response = schemas.RequestResponse.model_validate(req)
        if student_profile:
            req_response.student_name = student_profile.name
            req_response.student_grade = student_profile.grade_level
        result.append(req_response)
    
    return result

@app.delete("/api/requests/{request_id}")
def delete_request(
    request_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    request = db.query(models.Request).filter(
        models.Request.id == request_id,
        models.Request.student_id == current_user.id
    ).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    db.delete(request)
    db.commit()
    return {"message": "Request deleted successfully"}

# ==================== Teacher Search Endpoints ====================

@app.get("/api/teachers/search", response_model=List[schemas.TeacherProfileResponse])
def search_teachers(
    subject: Optional[str] = None,
    min_rate: Optional[float] = None,
    max_rate: Optional[float] = None,
    min_rating: Optional[float] = None,
    formats: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(models.TeacherProfile)
    
    if subject:
        query = query.filter(models.TeacherProfile.subjects_taught.contains([subject]))
    
    if min_rate is not None:
        query = query.filter(models.TeacherProfile.hourly_rate >= min_rate)
    
    if max_rate is not None:
        query = query.filter(models.TeacherProfile.hourly_rate <= max_rate)
    
    if min_rating is not None:
        query = query.filter(models.TeacherProfile.average_rating >= min_rating)
    
    if formats:
        format_list = formats.split(",")
        for fmt in format_list:
            query = query.filter(models.TeacherProfile.preferred_formats.contains([fmt]))
    
    offset = (page - 1) * per_page
    teachers = query.offset(offset).limit(per_page).all()
    
    return teachers

@app.get("/api/teachers/{teacher_id}", response_model=schemas.TeacherProfileResponse)
def get_teacher(teacher_id: str, db: Session = Depends(get_db)):
    teacher = db.query(models.TeacherProfile).filter(
        models.TeacherProfile.id == teacher_id
    ).first()
    
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    return teacher

@app.get("/")
def root():
    return {"message": "Fast-Classified API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
