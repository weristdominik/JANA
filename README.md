# "Just Antoher Note App" (JANA)

Url: http://locahost:3000

![JANA, Notes app](/documentation/Picture01.png)

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

### Debug Mode

For debugging purpose there is an `JANA_DEBUG` switch inside of `.env` file inside of [src/frontend/jana/src/](./src/frontend/jana/src/). If this option is set to `true` you will be able to access an webpage http://localhost:3000/debug . This will give you an full overview of the TreeView data and selectedItem as well as its content.

Keep in mind that after changing .env Variables a restart of the [Frontend](#frontend) component is needed.

## Tests

> Running Tests

```bash
# make sure to be in root dir
source src/backend/venv/bin/activate
pytest
```

For pytest we are using an pytest.ini file.
