from pydantic import BaseModel, EmailStr

# For creating user
class UserCreate(BaseModel):
    name: str
    email: EmailStr

# For response
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True