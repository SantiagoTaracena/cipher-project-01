from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import psycopg2
import datetime
from rsa_cipher import *

app = Flask(__name__)
CORS(app)

load_dotenv()

postgres_user = os.getenv("POSTGRES_USER")
postgres_password = os.getenv("POSTGRES_PASSWORD")
postgres_host = os.getenv("POSTGRES_HOST")
postgres_db = os.getenv("POSTGRES_DB")

conn = psycopg2.connect(
    dbname=postgres_db,
    user=postgres_user,
    password=postgres_password,
    host=postgres_host,
)

@app.route("/")
def hello():
    return "Hello world!"

@app.get("/users")
def get_usersss():
    cur = conn.cursor()
    cur.execute("SELECT * FROM Usuario")
    rows = cur.fetchall()
    cur.close()
    users_json = []
    for row in rows:
        user = {}
        user["id"] = row[0]
        user["username"] = row[2]
        users_json.append(user)
    return jsonify(users_json)

@app.get("/users/<string:user>/key")
def get_user_key(user):
    cur = conn.cursor()
    cur.execute(f"SELECT username, public_key FROM Usuario WHERE username = '{user}'")
    rows = cur.fetchall()
    cur.close()
    keys_json = []
    for row in rows:
        key = {}
        key["username"] = row[0]
        key["public_key"] = row[1]
        keys_json.append(key)
    return jsonify(keys_json)

@app.get("/messages/<string:user>")
def get_user_messages(user):
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM Mensajes WHERE username_destino = '{user}'")
    rows = cur.fetchall()
    cur.close()
    messages_json = []
    for row in rows:
        message = {}
        message["id"] = row[0]
        message["message"] = row[1]
        message["username_destino"] = row[2]
        message["username_origen"] = row[3]
        messages_json.append(message)
    return jsonify(messages_json)

@app.get("/groups")
def get_groups():
    cur = conn.cursor()
    cur.execute("SELECT * FROM Grupos")
    rows = cur.fetchall()
    cur.close()
    groups_json = []
    for row in rows:
        group = {}
        group["id"] = row[0]
        group["nombre"] = row[1]
        group["usuarios"] = row[2]
        group["clave_simetrica"] = row[4]
        groups_json.append(group)
    return jsonify(groups_json)

@app.get("/messages/groups/<int:group_id>")
def get_group_messages(group_id):
    cur = conn.cursor()
    cur.execute(f"""
        SELECT * FROM Mensajes_Grupos mg
        WHERE mg.id_grupo = {group_id}
    """)
    rows = cur.fetchall()
    cur.close()
    group_messages_json = []
    for row in rows:
        group_message = {}
        group_message["id"] = row[0]
        group_message["id_group"] = row[1]
        group_message["author"] = row[2]
        group_message["mensaje"] = row[3]
        group_messages_json.append(group_message)
    return jsonify(group_messages_json)

@app.post("/users")
def post_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    public_key, private_key = create_keys()
    cur = conn.cursor()
    cur.execute("SELECT MAX(id) FROM Usuario")
    rows = cur.fetchall()
    max_id = rows[0][0]
    cur.execute(f"INSERT INTO Usuario (id, public_key, username, fecha_creacion, password) VALUES ({max_id + 1}, '{public_key}', '{username}', '{datetime.date.today()}', '{password}')")
    conn.commit()
    cur.close()
    return jsonify({ "status": 200, "private_key": private_key })

@app.post("/messages/<string:user>")
def post_message(user):
    data = request.json
    message = data.get("message")
    emisor = data.get("emisor")
    receptor = data.get("receptor")
    cur = conn.cursor()
    cur.execute("SELECT MAX(id) FROM Mensajes")
    rows = cur.fetchall()
    max_id = rows[0][0]
    cur.execute(f"INSERT INTO Mensajes (id, mensaje_cifrado, username_destino, username_origen) VALUES ({max_id + 1}, '{message}', '{receptor}', '{emisor}')")
    conn.commit()
    cur.close()
    return jsonify({ "status": 200 })

@app.post("/groups")
def post_group():
    data = request.json
    name = data.get("groupName").lower().replace(" ", "-")
    members = data.get("groupMembers")
    password = data.get("password")
    cur = conn.cursor()
    cur.execute("SELECT MAX(id) FROM Grupos")
    rows = cur.fetchall()
    max_id = rows[0][0]
    members_formatted_array = "{"
    for member in members:
        members_formatted_array += f"\"{member}\", "
    members_formatted_array = f"{members_formatted_array[:-2]}" + "}"
    cur.execute(f"INSERT INTO Grupos (id, nombre, usuarios, contraseña, clave_simetrica) VALUES ({max_id + 1}, '{name}', '{members_formatted_array}', '{password}', 'simetric-key')")
    conn.commit()
    cur.close()
    return jsonify({ "status": 200 })

if (__name__ == "__main__"):
    app.run(debug=True)
