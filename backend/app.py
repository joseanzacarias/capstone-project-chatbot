from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

ELEVENLABS_API_KEY = ''  # Replace with your ElevenLabs API key

@app.route('/synthesize', methods=['POST'])
def synthesize():
    data = request.get_json()
    text = data.get('text', '')
    voice_id = data.get('voice', '')  # Get the voice ID from the frontend

    if not text:
        return jsonify({'error': 'No text provided'}), 400
    if not voice_id:
        return jsonify({'error': 'No voice ID provided'}), 400

    url = f'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}'
    headers = {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
    }
    payload = {
        'text': text,
        'voice_settings': {
            'stability': 0.15,
            'similarity_boost': 0.85
        }
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        return Response(response.content, mimetype='audio/mpeg')
    else:
        return jsonify({'error': 'Error generating audio', 'details': response.text}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
