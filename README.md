# "Just Antoher Note App" (JANA)

Url: http://locahost:3000

Username and Password for login can be defined in `src/backend/.env` file.

## Backend

```bash
source src/backend/venv/bin/activate
cd src/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

## Frontend

```bash
cd src/frontend/jana
npm start
```

## Tests

> Running Tests

```bash
cd src
source src/backend/venv/bin/activate
pytest
```

For pytest we are using an pytest.ini file.
