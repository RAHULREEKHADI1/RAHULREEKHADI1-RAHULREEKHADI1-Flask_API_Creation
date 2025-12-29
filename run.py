from app import create_app
from flask_cors import CORS

app = create_app()
CORS(app, 
     resources={r"/*": {"origins": "http://localhost:3000"}}, 
     supports_credentials=True,
     expose_headers=["Content-Type", "Authorization"],
     allow_headers=["Content-Type", "Authorization"])
if __name__ == "__main__":
    app.run()
