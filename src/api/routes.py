"""
This module takes care of starting the API Server, Loading the DB, and Adding the endpoints
"""
from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask import current_app
import os

api = Blueprint('api', __name__)

# CORS para todas las rutas
CORS(api, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Encabezados CORS en cada respuesta de la API. (útil cuando el frontend está en un dominio diferente y necesita comunicarse con el backend)
@api.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

# Verificar que la API funciona correctamente.
@api.route('/user', methods=['GET'])
def handle_hello():
    return jsonify({"msg": "Hello, this is your GET /user response"}), 200

# Sitemap
@api.route('/', methods=['GET'])
def sitemap():
    return jsonify(generate_sitemap(current_app)), 200  # ✅ Pasa 'current_app'

# Sirve archivos estáticos desde ka carpeta 
@api.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    static_file_dir = '/path/to/static/files'
    file_path = os.path.join(static_file_dir, path)
    if not os.path.isfile(file_path):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # x caché
    return response

# Registrarse
@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')

    if not email or not password:
        return jsonify({'message': 'El correo electrónico y la contraseña son requeridos'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'El usuario ya existe'}), 400
    
    new_user = User(email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

# login
@api.route("/login", methods=["POST"])
def login():
    try:
        email = request.json.get("email")
        password = request.json.get("password")
        
        if not email or not password:
            return jsonify({"msg": "El correo electrónico y la contraseña son requeridos"}), 400
        
        user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
        if not user or user.password != password:
            return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401
        
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    except Exception as e:
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500

# proteccionb profile con JWT
@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# errores personalizados en Flask con APIException y genera un json
@api.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Manejo de errores
@api.errorhandler(400)
def handle_bad_request(error):
    return jsonify({"msg": "Bad Request", "detail": str(error)}), 400

@api.errorhandler(401)
def handle_unauthorized(error):
    return jsonify({"msg": "Unauthorized", "detail": str(error)}), 401

@api.errorhandler(404)
def handle_not_found(error):
    return jsonify({"msg": "Not Found", "detail": str(error)}), 404

@api.errorhandler(500)
def handle_internal_server_error(error):
    return jsonify({"msg": "Internal Server Error", "detail": str(error)}), 500
