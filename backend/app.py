from flask import Flask, request, jsonify
from flask_cors import CORS
from database import create_database, add_discovery, get_discoveries

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({"message": "Wildfind backend is running"})


@app.route("/setup-db")
def setup_db():
    create_database()
    return jsonify({"message": "Wildfind database created"})


@app.route("/api/discoveries", methods=["POST"])
def save_discovery():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data sent"}), 400

    if not data.get("common_name"):
        return jsonify({"error": "common_name is required"}), 400

    new_id = add_discovery(data)

    return jsonify({
        "message": "Discovery saved",
        "id": new_id
    }), 201


@app.route("/api/discoveries", methods=["GET"])
def list_discoveries():
    discoveries = get_discoveries()
    return jsonify(discoveries)


if __name__ == "__main__":
    create_database()
    app.run(debug=True)
