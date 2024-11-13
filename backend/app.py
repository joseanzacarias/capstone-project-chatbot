from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

ELEVENLABS_API_KEY = 'sk_9cac98ed5ce0a3fb10bff8f2d09d13fa5c161a2b2056763a'  # Reemplaza con tu clave de API de ElevenLabs
VOICE_ID = 'iP95p4xoKVk53GoZ742B'  # Reemplaza con el ID de la voz que deseas utilizar

@app.route('/synthesize', methods=['POST'])
def synthesize():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No se proporcionó texto'}), 400

    url = f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}'
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
        return jsonify({'error': 'Error al generar el audio'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
