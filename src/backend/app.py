from flask import Flask, jsonify
from dotenv import load_dotenv
import os
import psycopg2

app = Flask(__name__)

load_dotenv()

postgres_user = os.getenv("POSTGRES_USER")
postgres_password = os.getenv("POSTGRES_PASSWORD")
postgres_host = os.getenv("POSTGRES_HOST")
postgres_db = os.getenv("POSTGRES_DB")

# ! Cambiar el .env para usar las variables que son.
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
    cur.execute("SELECT * FROM users")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

if (__name__ == "__main__"):
    app.run(debug=True)
