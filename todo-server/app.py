import datetime
import csv
import flask
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)

TODO_FILE_PATH = "/home/aarya/GoogleDrive/Todos.csv"
fields = ["id", "description", "status", "deleted"]
todos = []


def strtobool(s):
    return s.lower() in ["true", "1", "t", "y", "yes"]


with open(TODO_FILE_PATH, "r+") as f:
    csv_reader = csv.DictReader(f, quotechar='"')
    for row in csv_reader:
        todo = {}
        todo["id"] = int(row["id"])
        todo["description"] = row["description"]
        todo["status"] = strtobool(row["status"])
        todo["deleted"] = strtobool(row["id"])
        todos.append(todo)

    print(f"Loaded {len(todos)} from file {TODO_FILE_PATH}: {todos}")


@app.route("/save", methods=["GET"])
def save_todos():
    global todos
    global TODO_FILE_PATH
    try:
        with open(TODO_FILE_PATH, "w") as f:
            csv_writer = csv.DictWriter(f, fields, quotechar='"')
            csv_writer.writeheader()
            csv_writer.writerows(todos)
            print("Saved todos to file", TODO_FILE_PATH)
            return "", 200
    except Exception as e:
        return str(e), 500


@app.route("/todos", methods=["GET"])
def get_todos():
    global todos
    return flask.jsonify(todos)


@app.route("/todos", methods=["POST"])
def add_todo():
    global todos
    data = flask.request.json

    required_fields = [
        "deleted",
        "status",
        "description",
        "id",
    ]

    for field in required_fields:
        if field not in data:
            return "Error: json is invalid", 400

    todo = {
        "id": data["id"],
        "description": data["description"],
        "status": data["status"],
        "deleted": data["deleted"],
    }

    print("Adding todo", todo)

    todos.append(todo)

    return "Success", 200


@app.route("/todos/<id>", methods=["PUT"])
def update_todo(id):
    global todos
    data = flask.request.json

    if not data:
        return "Error: json not found", 400

    for todo in todos:
        if todo["id"] == int(id):
            for field in fields:
                if field == "id":
                    continue
                if field in data:
                    todo[field] = data[field]

            return "Success", 200

    print(f"Todo with id {id} not found")
    return "Error: Todo not found", 400
