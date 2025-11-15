import os
import jwt
import shutil
from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pathlib import Path
from typing import List, Dict, Optional, Any

# Load environment variables from .env file
load_dotenv()

USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
MOCK_DATA_ENABLED = os.getenv("MOCK_DATA_ENABLED", "false").lower() in ("1", "true", "yes", "on")

app = FastAPI()

# Enable CORS for React app running on localhost:3000
origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows CORS from localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2PasswordBearer is used to extract the token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# JWT Token creation
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)  # default 15 min
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# File Content
class FileRequest(BaseModel):
    file_path: str


class SaveFileRequest(BaseModel):
    file_path: str
    content: Any


# User authentication
class User(BaseModel):
    username: str
    password: str


# Login route
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Basic authentication using .env stored values
    if form_data.username == USERNAME and form_data.password == PASSWORD:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": form_data.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )


# API to check JWT token validity
@app.get("/protected")
async def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "This is a protected route", "user": payload["sub"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


# File Operations
def get_data_dir():
    if MOCK_DATA_ENABLED:
        DATA_DIR = os.getenv("MOCK_DATA_DIR")
    else:
        DATA_DIR = os.getenv("DATA_DIR")

    return DATA_DIR


def rich_tree_json(dir_path: Path) -> List[Dict]:
    """
    Recursively walk through dir_path (directory) and return
    a JSON-serializable structure for folders/files.
    """
    items = []
    for item in sorted(dir_path.iterdir()):
        node = {
            "id": str(item.resolve()),
            "label": item.name,  # ← label instead of name
            "type": "folder" if item.is_dir() else "file"
        }
        if item.is_dir():
            node["children"] = rich_tree_json(item)
        items.append(node)
    return items


def move_to_trash(path: Path):
    DATA_DIR = Path(get_data_dir()).resolve()
    trash_dir = DATA_DIR / "Trash"

    if not trash_dir.exists() or not trash_dir.is_dir():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Trash directory not found."
        )

    path = path.resolve()

    # Prevent path traversal
    if not str(path).startswith(str(DATA_DIR)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid path."
        )

    target = trash_dir / path.name

    # If target exists, append timestamp
    if target.exists():
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        target = trash_dir / f"{path.stem}_{timestamp}{path.suffix}"

    shutil.move(str(path), str(target))
    return str(target)


# API get_file_tree
@app.get("/api/tree")
async def read_file_tree():
    """
    Returns the full directory + file structure as Rich Tree View MUI valid JSON
    """
    DATA_DIR = Path(get_data_dir())
    if not DATA_DIR.exists():
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Datasource does not exist.") 
    return rich_tree_json(DATA_DIR)


@app.post("/api/add-folder", status_code=status.HTTP_201_CREATED)
async def add_folder(
    parent_id: Optional[str] = Body(None, embed=True),  # now optional
    folder_name: str = Body(..., embed=True)
):
    DATA_DIR = Path(get_data_dir()).resolve()

    if parent_id:
        parent_path = Path(parent_id).resolve()

        # Ensure parent is inside DATA_DIR
        if not str(parent_path).startswith(str(DATA_DIR)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid path."
            )

        # Ensure parent exists
        if not parent_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent path does not exist."
            )

        # Ensure parent is a folder
        if not parent_path.is_dir():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot add folder under a file."
            )
    else:
        # parent_id not provided → use DATA_DIR as root
        parent_path = DATA_DIR

    # Sanitize folder name
    if not folder_name.strip() or "/" in folder_name or "\\" in folder_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid folder name."
        )

    new_folder_path = parent_path / folder_name
    if new_folder_path.exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Folder already exists."
        )

    try:
        new_folder_path.mkdir(parents=False, exist_ok=False)
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied."
        )
    except OSError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create folder."
        )

    return {
        "id": str(new_folder_path.resolve()),
        "label": folder_name,
        "type": "folder",
        "children": []
    }


@app.post("/api/add-file", status_code=status.HTTP_201_CREATED)
async def add_file(
    parent_id: str = Body(..., embed=True),  # lastSelectedItem.id
    file_name: str = Body(..., embed=True)   # name of the new file
):
    DATA_DIR = Path(get_data_dir()).resolve()
    parent_path = Path(parent_id).resolve()

    # Prevent path traversal: parent must be inside DATA_DIR
    # Method differs from add-folder
    try:
        parent_path.relative_to(DATA_DIR)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid path."
        )

    # Check parent exists and is folder
    if not parent_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent folder does not exist."
        )
    if not parent_path.is_dir():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add file under a file."
        )

    # Sanitize file name
    if not file_name.strip() or "/" in file_name or "\\" in file_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file name."
        )

    new_file_path = parent_path / file_name
    if new_file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="File already exists."
        )

    try:
        new_file_path.touch(exist_ok=False)  # create empty file
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied."
        )
    except OSError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create file."
        )

    return {
        "id": str(new_file_path.resolve()),
        "label": file_name,
        "type": "file"
    }


@app.delete("/api/delete-folder")
async def delete_folder(folder_id: str = Body(..., embed=True)):
    folder_path = Path(folder_id)

    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder does not exist."
        )

    moved_path = move_to_trash(folder_path)
    return {
        "message": "Folder moved to Trash",
        "moved_path": str(moved_path)
    }


@app.delete("/api/delete-file")
async def delete_file(file_id: str = Body(..., embed=True)):
    file_path = Path(file_id)

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File does not exist."
        )

    moved_path = move_to_trash(file_path)
    return {
        "message": "File moved to Trash",
        "moved_path": str(moved_path)
    }


@app.post("/api/get-file-content")
async def get_file_content(payload: FileRequest):
    file_path = Path(payload.file_path)

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        import json
        raw = file_path.read_text(encoding="utf-8")

        try:
            content = json.loads(raw)
        except json.JSONDecodeError:
            content = None  # file was empty or invalid, frontend will handle

        return {
            "id": str(file_path.resolve()),
            "label": file_path.name,
            "content": content,
        }

    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read file.")


@app.post("/api/save-file-content")
async def save_file_content(payload: SaveFileRequest):
    file_path = Path(payload.file_path)

    if not file_path.parent.exists():
        raise HTTPException(status_code=400, detail="Parent folder does not exist")

    try:
        import json
        file_path.write_text(json.dumps(payload.content, indent=2), encoding="utf-8")
        return {"message": f"Saved file {file_path.name} successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
