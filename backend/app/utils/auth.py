from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.dependencies import get_db
from app.models.user_model import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# verify password
def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# create JWT token
def create_access_token(user_id: int):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": str(user_id),  # store user id
        "exp": expire
    }

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# verifying jwt token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise Exception("Invalid token")

        return int(user_id)

    except JWTError:
        raise Exception("Invalid token")
    
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    print("TOKEN RECEIVED:", credentials.credentials)
    user_id = verify_token(credentials.credentials)
        
    print("USER ID FROM TOKEN:", user_id)
        
    user = db.query(User).filter(User.id == user_id).first()
        
    print("USER FOUND:", user)

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

   