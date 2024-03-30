from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import psycopg2
import datetime

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
def get_users():
    cur = conn.cursor()
    cur.execute("SELECT * FROM Usuario")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

@app.get("/users/<string:user>/key")
def get_user_key(user):
    cur = conn.cursor()
    cur.execute(f"SELECT public_key FROM Usuario WHERE username = '{user}'")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

@app.get("/messages/<string:user>")
def get_user_messages(user):
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM Mensajes WHERE username_destino = '{user}'")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

@app.get("/groups")
def get_groups():
    cur = conn.cursor()
    cur.execute("SELECT * FROM Grupos")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

@app.get("/messages/groups/<string:group>")
def get_group_messages(group):
    group = group.lower().replace(" ", "-")
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM Grupos")

@app.post("/users")
def post_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    cur = conn.cursor()
    cur.execute("SELECT MAX(id) FROM Usuario")
    rows = cur.fetchall()
    max_id = rows[0][0]
    cur.execute(f"INSERT INTO Usuario (id, public_key, username, fecha_creacion, password) VALUES ({max_id + 1}, 'test-public-key', '{username}', '{datetime.date.today()}', '{password}')")
    conn.commit()
    cur.close()
    return jsonify({ "status": 200 })

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
