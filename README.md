# FlaskMarket - Simple User API

A small Flask REST API example that manages users (create, read, update, delete) using Flask, SQLAlchemy and SQLite.

Project structure

- `run.py` - Application entrypoint that imports and runs the Flask app.
- `app/__init__.py` - Factory function `create_app()` that configures Flask, initializes the database and registers blueprints.
- `app/models/user.py` - `User` SQLAlchemy model and `to_dict()` helper.
- `app/routes/user_routes.py` - API blueprint exposing user CRUD endpoints.
- `instance/app.db` - SQLite database file (created automatically on first run).
- `templates/Home.html` - Basic home HTML page.
- `requirements.txt` - Project dependencies.

Requirements

- Python 3.8+ (recommended)
- See `requirements.txt` for exact package versions used (Flask, Flask-SQLAlchemy, SQLAlchemy, etc.).

Quickstart

1. Create a virtual environment and activate it (macOS / Linux):

   python3 -m venv .venv
   source .venv/bin/activate

2. Install dependencies:

   pip install -r requirements.txt

3. Run the application:

   python run.py

The app will start on the default Flask port (5000). Open http://127.0.0.1:5000/ to see the API welcome message.

Configuration

The app uses an application factory (`create_app`) and configures SQLAlchemy with an SQLite database at `sqlite:///app.db` by default. You can pass a `test_config` dict when creating the app to override settings for tests.

Database

- The database file is created automatically in the `instance` folder when the app runs for the first time.
- The `User` model has these fields:
  - `id` (integer, primary key)
  - `name` (string, required)
  - `email` (string, unique, required)

API Endpoints

Base path: `/`

- GET /                      
  - Description: Welcome message for the API.
  - Response: 200 { "message": "Welcome to User API" }

- POST /users
  - Description: Create a new user.
  - Body (JSON): { "name": "Alice", "email": "alice@example.com" }
  - Responses:
    - 201: Created -> Returns created user object
    - 400: Bad Request -> Missing required fields
    - 409: Conflict -> Email already exists

- GET /users
  - Description: Retrieve list of all users.
  - Response: 200 -> JSON array of users

- GET /users/<id>
  - Description: Retrieve a user by ID.
  - Response: 200 -> User object, 404 if not found

- PUT /users/<id>
  - Description: Update a user's `name` and/or `email`.
  - Body (JSON): { "name": "New Name", "email": "new@example.com" }
  - Responses:
    - 200: Updated user object
    - 409: Conflict if new email already exists
    - 404: Not found

- DELETE /users/<id>
  - Description: Delete a user by ID.
  - Response: 200 -> { "message": "User deleted" }

Error handling

- The app has a 404 error handler that returns JSON: `{ "error": "Resource not found" }`.
- Integrity errors (duplicate email) are caught and return status 409 with a JSON error message.

Example curl requests

Create user:

   curl -X POST http://127.0.0.1:5000/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Alice", "email": "alice@example.com"}'

Get all users:

   curl http://127.0.0.1:5000/users

Get a user:

   curl http://127.0.0.1:5000/users/1

Update a user:

   curl -X PUT http://127.0.0.1:5000/users/1 \
     -H "Content-Type: application/json" \
     -d '{"name": "Alice Updated"}'

Delete a user:

   curl -X DELETE http://127.0.0.1:5000/users/1

Notes and next steps

- This project is intentionally minimal to demonstrate a simple Flask app structure. Consider adding the following for production use:
  - Input validation (e.g., using Marshmallow or Flask-Inputs)
  - Authentication/authorization
  - Pagination for listing endpoints
  - Logging and error monitoring
  - Tests (unit and integration)

License

- Add a LICENSE file if you plan to publish this repository. No license is included by default.

