from flask import Flask, request, jsonify
from flask_cors import CORS
from database import create_database, add_discovery, get_discoveries
from services.vision_api import analyze_image
from services.nps_api import get_aggregated_park_dashboard, get_all_parks

app = Flask(__name__)
# Crucial: Enable CORS so your React frontend can talk to this server
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

@app.route('/api/scan', methods=['POST'])
def handle_scan():
    data = request.json
    image_base64 = data.get('image')
    
    if not image_base64:
        return jsonify({"error": "No image provided"}), 400

    # Call your secure helper function
    scan_result = analyze_image(image_base64)
    
    if scan_result:
        # convert the string back to a Python dictionary before sending it to React.
        return scan_result, 200 
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

# EXECUTION BLOCK
if __name__ == '__main__':
    print("Starting WildFind Backend on http://localhost:5001")
    # Initialize the database on startup (from app.py)
    create_database() 
    # Run the app on port 5001 (from app2.py)
    app.run(debug=True, port=5001)
