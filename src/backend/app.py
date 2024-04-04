from flask import Flask, request, session, jsonify
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

app.secret_key = "moronga12"

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
    cur.execute(f"""
        SELECT username, public_key FROM Usuario
        WHERE username LIKE '%{user}%'
    """)
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
    cur.execute(f"""
        SELECT * FROM Mensajes
        WHERE username_destino LIKE '%{user}%'
        OR username_origen LIKE '%{user}%'
    """)
    rows = cur.fetchall()
    cur.close()
    # llave privada del usuario para descifrar
    private_key = request.args.get("privateKey")
    messages_json = []
    for row in rows:
        message = {}
        message["id"] = row[0]
        try:
            decipher_message = decipher_direct_message(private_key, row[1])
        except:
            continue
        message["message"] = decipher_message
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
        SELECT mg.*, g.clave_simetrica FROM Mensajes_Grupos mg
        JOIN Grupos g ON mg.id_grupo = g.id
        WHERE mg.id_grupo = {group_id}
    """)
    rows = cur.fetchall()
    cur.close()
    if (not rows):
        return jsonify([])
    group_messages_json = []
    simetric_key = rows[0][-1]
    for row in rows:
        group_message = {}
        group_message["id"] = row[0]
        group_message["id_group"] = row[1]
        group_message["author"] = row[2]
        decipher_message = decipher_group_message(simetric_key, row[3])
        group_message["mensaje"] = decipher_message
        group_messages_json.append(group_message)
    return jsonify(group_messages_json)

@app.post("/users")
def post_user():
    data = request.json
    username = data.get("username")
    public_key, private_key = create_new_keys()
    session['private_key'] = private_key
    cur = conn.cursor()
    cur.execute(f"""
        INSERT INTO Usuario (public_key, username, fecha_creacion)
        VALUES ('{public_key}', '{username}', '{datetime.date.today()}')
    """)
    conn.commit()
    cur.close()
    with open("users.txt", mode="a") as file:
        file.write(private_key + "\n")
    return jsonify({ "status": 200, "private_key": private_key })

@app.post("/users/<string:user>")
def auth_user(user):
    cur = conn.cursor()
    cur.execute("SELECT * FROM Usuario")
    rows = cur.fetchall()
    auth = False
    id = 0
    username = ""
    for row in rows:
        if (user == row[2]):
            auth = True
            id = row[0]
            username = row[2]
    return jsonify({ "status": 200, "auth": auth, "id": id, "username": username })

@app.post("/messages/<string:user>")
def post_message(user):
    data = request.json
    message = data.get("message")
    emisor = data.get("emisor")
    receptor = data.get("receptor")
    cur = conn.cursor()
    cur.execute("SELECT nombre FROM Grupos")
    rows = cur.fetchall()
    groups = [row[0] for row in rows]

    if (user.lower().replace(" ", "-") in groups):
        group_name = user.lower().replace(" ", "-")
        cur.execute(f"""
            SELECT id, clave_simetrica FROM Grupos
            WHERE nombre LIKE '%{group_name}%'
        """)
        rows = cur.fetchall()
        group_id = rows[0][0]
        simetric_key = rows[0][-1]
        cipher_message = cipher_group_message(simetric_key, message)
        cur.execute(f"""
            INSERT INTO Mensajes_Grupos (id_grupo, author, mensaje_cifrado)
            VALUES ('{group_id}', '{emisor}', '{cipher_message}')
        """)
        conn.commit()

    else:
        cur.execute(f"""
            SELECT public_key FROM Usuario
            WHERE username LIKE '%{receptor}%'
        """)
        rows = cur.fetchall()
        receptor_public_key = rows[0][0]
        cipher_message = cipher_direct_message(receptor_public_key, message)
        cur.execute(f"""
            INSERT INTO Mensajes (mensaje_cifrado, username_destino, username_origen)
            VALUES ('{cipher_message}', '{receptor}', '{emisor}')
        """)
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
    members_formatted_array = "{"
    for member in members:
        members_formatted_array += f"\"{member}\", "
    members_formatted_array = f"{members_formatted_array[:-2]}" + "}"
    simetric_key = generate_group_key()
    cur.execute(f"""
        INSERT INTO Grupos (nombre, usuarios, contraseña, clave_simetrica)
        VALUES ('{name}', '{members_formatted_array}', '{password}', '{simetric_key}')
    """)
    conn.commit()
    cur.close()
    return jsonify({ "status": 200 })

@app.put("/users/<string:user>/key")
def update_user_key(user):
    data = request.json
    private_key = data.get("privateKey")
    public_key = update_public_key(private_key)
    print("public_key", public_key)
    # cur = conn.cursor()
    # cur.execute(f"""
    #     UPDATE Usuario
    #     SET public_key = '{public_key}'
    #     WHERE username LIKE '%{user}%'
    # """)
    # conn.commit()
    # cur.close()
    return jsonify({ "status": 200 })

@app.delete("/groups/<string:group>")
def delete_group(group):
    group = group.lower().replace(" ", "-")
    password = request.json["password"]
    cur = conn.cursor()
    cur.execute(f"""
        DELETE FROM Grupos
        WHERE nombre LIKE '%{group}%'
        AND contraseña LIKE '%{password}%'
    """)
    conn.commit()
    cur.close()
    return jsonify({ "status": 200 })

if (__name__ == "__main__"):
    app.run(debug=True, host="0.0.0.0")
