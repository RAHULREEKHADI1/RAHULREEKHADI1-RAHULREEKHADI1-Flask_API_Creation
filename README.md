# FlaskMarket - User Management API

A compact Flask REST API demonstrating a realistic project structure and features:
- JWT-based authentication (access + refresh tokens)
- Signup / login with password hashing and email validation
- Role-based authorization (admin role)
- Admin-managed API keys for third-party clients
- Clear separation between routes, services, models and utilities

Project layout

- `run.py` - App entrypoint (runs the Flask app using the factory).
- `app/__init__.py` - Application factory `create_app()`; reads env, configures DB and JWT, registers blueprints.
- `app/models/` - SQLAlchemy models (`user.py`, `api_key.py`).
- `app/routes/` - Blueprints for endpoints (`user_routes.py`, `admin_routes.py`, `client_routes.py`).
- `app/services/` - Business logic (e.g. `user_services.py`, `api_key_services.py`).
- `app/utils/` - Helper decorators (`decorators.py`, `api_key_decorators.py`).
- `instance/` - (optional) holds the SQLite DB file when using instance config.
- `requirements.txt` - Project dependencies.

What's new

This README was updated to reflect recent changes:
- Users now store hashed passwords and a `role` field.
- Signup/login return JWTs (access + refresh). Access tokens expire quickly; refresh tokens renew them.
- Protected endpoints use `@jwt_required()` and check JWT claims for role-based access.
- Admin blueprint (`/admin`) allows creation, regeneration and toggling of API keys.
- Client blueprint (`/api`) contains endpoints that require an API key provided as `Authorization: Api-Key <key>`.
- Config now supports environment variables via `.env`.

Requirements

- Python 3.8+
- Install dependencies:

  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt

Recommended additions (if not present):
- python-dotenv
- flask-jwt-extended
- email-validator

Configuration

Create a `.env` in project root to override defaults. Example `.env`:

  SECRET_KEY=your-secret
  DATABASE_URL=sqlite:///db.sqlite3
  JWT_SECRET_KEY=your-jwt-secret

Defaults used by the app when env vars are missing:
- SECRET_KEY -> "default_secret"
- DATABASE_URL -> "sqlite:///db.sqlite3"
- JWT_SECRET_KEY -> "supersecretkey"
- Access token expiry -> 5 minutes
- Refresh token expiry -> 7 days

Database

- Default DB: SQLite at `sqlite:///db.sqlite3` (change with DATABASE_URL).
- Models are created with `db.create_all()` at startup; consider using Flask-Migrate/Alembic for production migrations.
- User model fields: id, name, email (unique), password_hash, role.
- APIKey model fields: id, key, client_name, daily_limit, is_active, created_at.

Authentication & Authorization

- Signup (`/signup`) validates name, email and password, hashes the password and returns an access token.
- Login (`/login`) validates credentials and returns access + refresh tokens.
- Access-protected endpoints use: Authorization: Bearer <access_token>
- Refresh endpoint (`/refresh`) uses a refresh token to return a new access token.
- Admin routes require a JWT with a `role` claim equal to `admin`.

API Endpoints (summary)

Public
- POST /signup
  - Body: { "name", "email", "password" }
  - Returns: 201 { user, access_token }

- POST /login
  - Body: { "email", "password" }
  - Returns: 200 { user, access_token, refresh_token }

Protected (JWT required)
- POST /refresh
  - Requires: Authorization: Bearer <refresh_token> (decorated with refresh=True)
  - Returns new access token

- GET /me
  - Returns current user from JWT identity

- GET /users
- GET /users/<id>
- PUT /users/<id>
- DELETE /users/<id>

Admin (prefix: /admin) - require JWT + admin role
- POST /admin/api-keys
  - Create API key. Body: { "client_name": "name", "daily_limit": 1000 }
  - Returns: 201 { key, client_name, daily_limit }

- PUT /admin/api-keys/<key_id>/regenerate
  - Regenerates the API key value for <key_id>

- PUT /admin/api-keys/<key_id>/toggle
  - Enable/disable an API key

Client (prefix: /api)
- GET /api/data
  - Example client endpoint protected by API key
  - Requires header: Authorization: Api-Key <api_key>

Headers
- JWT access:
  Authorization: Bearer <access_token>

- API key:
  Authorization: Api-Key <api_key>

Examples (curl)

Signup:
  curl -X POST http://127.0.0.1:5000/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'

Login:
  curl -X POST http://127.0.0.1:5000/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"password123"}'

Access protected endpoint:
  curl http://127.0.0.1:5000/users \
    -H "Authorization: Bearer <access_token>"

Client access with API key:
  curl http://127.0.0.1:5000/api/data \
    -H "Authorization: Api-Key <api_key>"

Error handling

- HTTP exceptions are returned as JSON: { "error": "..." }.
- Validation errors raise 4xx responses (BadRequest, Unauthorized, Conflict, NotFound).

Development notes & next steps

- Replace `db.create_all()` with Flask-Migrate for schema migrations.
- Add tests for services and protected routes (unit & integration).
- Add request rate limiting and usage tracking for API keys.
- Add password reset, email verification, and stronger password policies.

License

- No license included. Add a LICENSE file if you plan to publish this repository.

