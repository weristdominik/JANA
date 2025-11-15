import os
import pytest
from fastapi.testclient import TestClient
from fastapi import status
from dotenv import load_dotenv
from backend.main import app

# Load environment variables from the .env file located in the 'backend' directory
load_dotenv(dotenv_path='src/backend/.env')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Create the TestClient to send requests to the FastAPI app
client = TestClient(app)


