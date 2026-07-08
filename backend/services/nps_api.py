import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve the NPS API key
NPS_API_KEY = os.environ.get("NPS_API_KEY")
if not NPS_API_KEY:
    raise ValueError("NPS_API_KEY is missing from the environment variables.")

# Base URL for the National Park Service API
BASE_URL = "https://developer.nps.gov/api/v1"

def get_all_parks():
    """
    Fetches a list of all National Parks and their 4-letter codes.
    This can be used for populating a frontend search bar or dropdown menu.
    """
    endpoint = f"{BASE_URL}/parks"
    
    # Set a high limit (500) to get all major parks in one single API call
    params = {
        "limit": 500,
        "api_key": NPS_API_KEY
    }

    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        # Filter down the massive NPS response to just the Name and Code
        # This keeps the payload tiny so the React search bar loads instantly
        park_list = []
        for park in data.get("data", []):
            park_list.append({
                "name": park.get("fullName"),
                "parkCode": park.get("parkCode")
            })
            
        # Sort alphabetically by name for a better user experience
        park_list.sort(key=lambda x: x["name"])
            
        return {"parks": park_list}

    except requests.exceptions.RequestException as e:
        print(f"NPS API Error (Parks List): {e}")
        return {"error": "Failed to retrieve park list."}

def get_park_alerts(park_code):
    """Fetches active hazards, warnings, and closures."""
    endpoint = f"{BASE_URL}/alerts"
    params = {"parkCode": park_code, "api_key": NPS_API_KEY}
    
    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()
        
        return [
            {
                "title": alert.get("title"),
                "description": alert.get("description"),
                "category": alert.get("category"),
                "url": alert.get("url")
            }
            for alert in response.json().get("data", [])
        ]
    except requests.exceptions.RequestException as e:
        print(f"NPS Alerts Error: {e}")
        return [] # Return an empty list so the app doesn't crash if the API fails

def get_park_road_events(park_code):
    """Fetches active road construction, incidents, and traffic delays."""
    endpoint = f"{BASE_URL}/roadevents"
    params = {"parkCode": park_code, "api_key": NPS_API_KEY}
    
    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()
        
        return [
            {
                "title": event.get("title"),
                "type": event.get("type", "Notice"), # Usually 'Work Zone' or 'Incident'
                "description": event.get("description")
            }
            for event in response.json().get("data", [])
        ]
    except requests.exceptions.RequestException as e:
        print(f"NPS Road Events Error: {e}")
        return []

def get_aggregated_park_dashboard(park_code):
    """Calls both endpoints and merges the data for the React frontend."""
    alerts = get_park_alerts(park_code)
    road_events = get_park_road_events(park_code)
    
    return {
        "parkCode": park_code,
        "alerts": alerts,
        "road_events": road_events
    }
