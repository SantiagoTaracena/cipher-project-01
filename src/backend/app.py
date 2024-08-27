from flask import Flask, request, session, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import psycopg2
import datetime
from rsa_cipher import *

app = Flask(__name__)
CORS(app)
load_dotenv()

app.secret_key = os.getenv("SECRET_KEY")

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Load database connection parameters from environment
postgres_user = os.getenv("POSTGRES_USER")
postgres_password = os.getenv("POSTGRES_PASSWORD")
postgres_host = os.getenv("POSTGRES_HOST")
postgres_db = os.getenv("POSTGRES_DB")

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname=postgres_db,
    user=postgres_user,
    password=postgres_password,
    host=postgres_host,
)

@app.route("/")
def hello():
    return "Hello world!"

# Register a user
@app.post("/users")
def post_user():
    data = request.json
    username = data.get("username")
    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400
    
    public_key, private_key = create_new_keys()
    session['private_key'] = private_key
    
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Usuario (public_key, username, fecha_creacion)
        VALUES (%s, %s, %s)
    """, (public_key, username, datetime.date.today()))
    conn.commit()
    cur.close()
    
    with open("users.txt", mode="a") as file:
        file.write(f"{username}: {private_key}\n")
    
    access_token = create_access_token(identity=username)
    return jsonify({"status": 200, "private_key": private_key, "access_token": access_token})

# Login and authenticate a user
@app.post("/users/<string:user>")
def auth_user(user):
    data = request.json
    private_key = data.get("privateKey")
    if not private_key:
        return jsonify({"status": "error", "message": "Private key is required"}), 400
    
    session["private_key"] = private_key
    
    cur = conn.cursor()
    cur.execute("SELECT id, username FROM Usuario WHERE username ILIKE %s", (f'%{user}%',))
    rows = cur.fetchall()
    cur.close()
    
    if not rows:
        return jsonify({"status": "error", "message": "User not found"}), 404
    
    user_data = rows[0]
    auth = user.lower() == user_data[1].lower()
    
    if auth:
        public_key = update_public_key(private_key)
        cur = conn.cursor()
        cur.execute("""
            UPDATE Usuario
            SET public_key = %s
            WHERE username = %s
        """, (public_key, user_data[1]))
        conn.commit()
        cur.close()
    
    access_token = create_access_token(identity=user_data[1])
    return jsonify({"status": 200, "auth": auth, "id": user_data[0], "username": user_data[1], "access_token": access_token})

# Get all users (Protected)
@app.get("/users")
@jwt_required()
def get_users():
    cur = conn.cursor()
    cur.execute("SELECT id, username FROM Usuario")
    rows = cur.fetchall()
    cur.close()
    
    users_json = [{"id": row[0], "username": row[1]} for row in rows]
    return jsonify(users_json)

# Get user's public key (Protected)
@app.get("/users/<string:user>/key")
@jwt_required()
def get_user_key(user):
    cur = conn.cursor()
    cur.execute("""
        SELECT username, public_key FROM Usuario
        WHERE username ILIKE %s
    """, (f'%{user}%',))
    rows = cur.fetchall()
    cur.close()
    
    keys_json = [{"username": row[0], "public_key": row[1]} for row in rows]
    return jsonify(keys_json)

# Get user's messages (Protected)
@app.get("/messages/<string:user>")
@jwt_required()
def get_user_messages(user):
    private_key = request.args.get("privateKey")
    if not private_key:
        return jsonify({"status": "error", "message": "Private key is required"}), 400
    
    cur = conn.cursor()
    cur.execute("""
        SELECT id, mensaje_cifrado, username_destino, username_origen FROM Mensajes
        WHERE username_destino ILIKE %s OR username_origen ILIKE %s
    """, (f'%{user}%', f'%{user}%',))
    rows = cur.fetchall()
    cur.close()
    
    messages_json = []
    for row in rows:
        try:
            decipher_message = decipher_direct_message(private_key, row[1])
            message = {
                "id": row[0],
                "message": decipher_message,
                "username_destino": row[2],
                "username_origen": row[3]
            }
            messages_json.append(message)
        except Exception as e:
            continue
    
    return jsonify(messages_json)

# Get all groups (Protected)
@app.get("/groups")
@jwt_required()
def get_groups():
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, usuarios, clave_simetrica FROM Grupos")
    rows = cur.fetchall()
    cur.close()
    
    groups_json = [{"id": row[0], "nombre": row[1], "usuarios": row[2], "clave_simetrica": row[3]} for row in rows]
    return jsonify(groups_json)

# Get group messages (Protected)
@app.get("/messages/groups/<int:group_id>")
@jwt_required()
def get_group_messages(group_id):
    cur = conn.cursor()
    cur.execute("""
        SELECT mg.id, mg.id_grupo, mg.author, mg.mensaje_cifrado, g.clave_simetrica 
        FROM Mensajes_Grupos mg
        JOIN Grupos g ON mg.id_grupo = g.id
        WHERE mg.id_grupo = %s
    """, (group_id,))
    rows = cur.fetchall()
    cur.close()
    
    if not rows:
        return jsonify([])
    
    simetric_key = rows[0][-1]
    group_messages_json = []
    for row in rows:
        try:
            decipher_message = decipher_group_message(simetric_key, row[3])
            group_message = {
                "id": row[0],
                "id_group": row[1],
                "author": row[2],
                "mensaje": decipher_message
            }
            group_messages_json.append(group_message)
        except Exception as e:
            continue
    
    return jsonify(group_messages_json)

# Post a new message (Protected)
@app.post("/messages/<string:user>")
@jwt_required()
def post_message(user):
    data = request.json
    message = data.get("message")
    emisor = data.get("emisor")
    receptor = data.get("receptor")
    
    if not all([message, emisor, receptor]):
        return jsonify({"status": "error", "message": "All fields are required"}), 400
    
    cur = conn.cursor()
    cur.execute("SELECT nombre FROM Grupos")
    groups = [row[0].lower().replace(" ", "-") for row in cur.fetchall()]
    
    if user.lower().replace(" ", "-") in groups:
        cur.execute("""
            SELECT id, clave_simetrica FROM Grupos
            WHERE nombre ILIKE %s
        """, (f'%{user.lower().replace(" ", "-")}%'))
        group = cur.fetchone()
        if group:
            group_id = group[0]
            simetric_key = group[1]
            cipher_message = cipher_group_message(simetric_key, message)
            cur.execute("""
                INSERT INTO Mensajes_Grupos (id_grupo, author, mensaje_cifrado)
                VALUES (%s, %s, %s)
            """, (group_id, emisor, cipher_message))
            conn.commit()
    else:
        cur.execute("""
            SELECT public_key FROM Usuario
            WHERE username ILIKE %s
        """, (f'%{receptor}%',))
        receptor_public_key = cur.fetchone()[0]
        cipher_message = cipher_direct_message(receptor_public_key, message)
        cur.execute("""
            INSERT INTO Mensajes (mensaje_cifrado, username_destino, username_origen)
            VALUES (%s, %s, %s)
        """, (cipher_message, receptor, emisor))
        conn.commit()
    
    cur.close()
    return jsonify({"status": 200})

# Create a new group (Protected)
@app.post("/groups")
@jwt_required()
def post_group():
    data = request.json
    name = data.get("groupName")
    members = data.get("groupMembers")
    password = data.get("password")
    
    if not all([name, members, password]):
        return jsonify({"status": "error", "message": "All fields are required"}), 400
    
    members_formatted_array = '{' + ', '.join(f'"{member}"' for member in members) + '}'
    simetric_key = generate_group_key()
    
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Grupos (nombre, usuarios, contraseña, clave_simetrica)
        VALUES (%s, %s, %s, %s)
    """, (name.lower().replace(" ", "-"), members_formatted_array, password, simetric_key))
    conn.commit()
    cur.close()
    
    return jsonify({"status": 200})

if __name__ == "__main__":
    app.run(debug=True)
