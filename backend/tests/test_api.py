import unittest
from unittest.mock import patch, MagicMock
from services.nps_api import (
    get_park_alerts,
    get_park_road_events,
    get_all_parks,
    get_aggregated_park_dashboard
)
from services.vision_api import analyze_image


class TestAPIServices(unittest.TestCase):

    # Test Claude API calls
    @patch('services.vision_api.client.messages.create')
    def test_analyze_image_success(self, mock_create):
        '''
        Test the analyze_image function with a successful response from the API.
        Uses unittest.mock to patch the client.messages.create method and simulate a successful API response.
        '''

        mock_response = MagicMock()
        mock_response.content = [MagicMock(text='{"common_name": "Douglas Squirrel"}')]
        mock_create.return_value = mock_response

        result = analyze_image("fake_base64_string")
        self.assertIn("Douglas Squirrel", result)

    @patch('services.vision_api.client.messages.create')
    def test_analyze_image_failure(self, mock_create):
        '''
        Test the analyze_image function with a failed response from the API.
        Uses unittest.mock to patch the client.messages.create method and simulate a failed API response.
        '''

        # Create mock error
        mock_create.side_effect = Exception("API is down!")

        result = analyze_image("fake_base64_string")
        self.assertIsNone(result)

    # Test NPS API calls
    @patch('services.nps_api.requests.get')
    def test_get_park_alerts_success(self, mock_get):
        '''
        Test the get_park_alerts function with a successful response from the API.
        Uses unittest.mock to patch the requests.get method and simulate a successful API response.
        '''
        # Create mock JSON response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "data": [
                {"title": "Bear Activity", "category": "Danger", "description": "Active bear in area."}]
        }
        mock_get.return_value = mock_response

        result = get_park_alerts("yose")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["title"], "Bear Activity")

    @patch('services.nps_api.requests.get')
    def test_get_park_road_events_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "data": [
                {"title": "Hwy 120 Closed", "type": "Work Zone"}]
        }
        mock_get.return_value = mock_response
        result = get_park_road_events("yose")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["type"], "Work Zone")


if __name__ == '__main__':
    unittest.main()