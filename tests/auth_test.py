import os
import pytest
import jwt
from fastapi.testclient import TestClient
from fastapi import status
from dotenv import load_dotenv
from backend.main import app

# Load environment variables from the .env file located in the 'backend' directory
load_dotenv(dotenv_path='src/backend/.env')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Create the TestClient to send requests to the FastAPI app
client = TestClient(app)


# Test login (GET token) functionality with correct credentials
def test_successful_login():
    response = client.post("/login", data={
        "username": os.getenv('USERNAME'),
        "password": os.getenv('PASSWORD')
    })

    assert response.status_code == status.HTTP_200_OK
    json = response.json()

    # Check that the response contains access_token and token_type
    assert "access_token" in json
    assert json["token_type"] == "bearer"

    # Optionally decode the token to check claims (JWT)
    token = json["access_token"]
    try:
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=[os.getenv('ALGORITHM')])
        # Check that the decoded token contains the expected username (subject)
        assert decoded_token["sub"] == os.getenv('USERNAME')
    except jwt.ExpiredSignatureError:
        pytest.fail("JWT token expired")
    except jwt.PyJWTError:
        pytest.fail("Invalid JWT token")


# Test login with incorrect credentials
def test_login_incorrect_credentials():
    response = client.post("/login", data={
        "username": "wrong_username",
        "password": "wrong_password"
    })

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()

    assert data["detail"] == "Incorrect username or password"


def test_login_missing_data():
    response = client.post("/login", data={
        "username": os.getenv('USERNAME')
    })

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


# Test accessing a protected route with a valid token
def test_protected_route():
    login_response = client.post("login", data={
        "username": os.getenv('USERNAME'),
        "password": os.getenv('PASSWORD')
    })

    assert login_response.status_code == status.HTTP_200_OK
    token = login_response.json()["access_token"]

    protected_response = client.get(
        "/protected",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert protected_response.status_code == status.HTTP_200_OK
    data = protected_response.json()

    # Check the response for the expected message and user
    assert data["message"] == "This is a protected route"
    assert data["user"] == os.getenv('USERNAME')


# Test accessing a protected route with an invalid token
def test_protected_route_invalid_token():
    # Make a request with an invalid token
    response = client.get(
        "/protected",
        headers={"Authorization": "Bearer invalid_token"}
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()

    assert data["detail"] == "Invalid token"
