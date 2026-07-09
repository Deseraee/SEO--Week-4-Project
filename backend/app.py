import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import create_database, add_discovery, get_discoveries
from services.vision_api import analyze_image
from services.nps_api import get_aggregated_park_dashboard, get_all_parks
import json

# Tell Flask where to find the React build files
app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)

# ROUTES FROM Database & Discoveries

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

# ROUTES FROM Vision API & NPS Dashboard)

@app.route('/api/scan', methods=['POST', 'OPTIONS'])
def handle_scan():
    if request.method == 'OPTIONS':
        response = jsonify({"message": "OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        return response, 200
    
    data = request.json
    image_base64 = data.get('image') if data else None

    if not image_base64:                                         
        return jsonify({"error": "No image provided"}), 400        
    
    # Call your secure helper function
    scan_result = analyze_image(image_base64)

    if scan_result:
        try:
            result_data = json.loads(scan_result)
            discovery_data = {
                "common_name": result_data.get("common_name"),
                "scientific_name": result_data.get("scientific_name"),
                "description": result_data.get("description"),
                "region_or_origin": result_data.get("origin"),
                "hazard_warning": result_data.get("safety_precautions"),
                "fun_fact": result_data.get("fun_fact")
            }
            new_id = add_discovery(discovery_data)
            result_data["id"] = new_id
            return jsonify(result_data), 200
        except json.JSONDecodeError:
            return jsonify({"result": scan_result, "raw": True}), 200
        except Exception as e:
            return jsonify({"error": f"Failed to save onto database: {str(e)}"}), 500
    else:
        return jsonify({"error": "Failed to analyze image"}), 500
    
# Get All Parks (For Searching)
@app.route('/api/parks', methods=['GET'])
def handle_get_parks():
    parks_data = get_all_parks()
    
    if "error" in parks_data:
        return jsonify(parks_data), 500
        
    return jsonify(parks_data), 200

# Park Safety Dashboard (Alerts & Road Events)

@app.route('/api/dashboard', methods=['GET'])
def handle_dashboard():
    park_code = request.args.get('park')
    
    if not park_code:
        return jsonify({"error": "No park code provided. Please provide a valid 4-letter NPS code."}), 400

    # This function aggregates both API calls (Alerts & Road Events)
    dashboard_data = get_aggregated_park_dashboard(park_code)
    
    return jsonify(dashboard_data), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    # If the requested file exists in the dist folder (like a .css or .js file), serve it
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    # Otherwise, serve the React index.html and let React Router handle the multi-page navigation
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("Starting WildFind Backend on http://localhost:5001")
    # Initialize the database on startup (from app.py)
    create_database()
     # Run the app on port 5001 (from app2.py)
    app.run(debug=True, port=5001)
