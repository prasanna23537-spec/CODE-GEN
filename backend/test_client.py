import requests

# Simple test script to submit feedback to local server
URL = 'http://127.0.0.1:5000/submit_feedback'
PAYLOAD = {
    'name': 'Automated Test',
    'email': 'automated@test.local',
    'rating': 5,
    'message': 'This is a test submission.'
}

r = requests.post(URL, json=PAYLOAD)
print(r.status_code, r.text)
