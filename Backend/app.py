from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

candidates = []
stages = ["Applied", "Interview Scheduled", "Selected", "Rejected"]

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/candidates', methods=['GET'])
def get_candidates():
    try:
        return jsonify(candidates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/candidates', methods=['POST'])
def add_candidate():
    try:
        data = request.json
        if not data or 'name' not in data:
            return jsonify({"error": "Name is required"}), 400
            
        candidate = {
            'id': len(candidates) + 1,
            'name': data['name'],
            'status': 'Applied'
        }
        candidates.append(candidate)
        return jsonify(candidate), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/candidates/<int:candidate_id>', methods=['PUT'])
def update_candidate(candidate_id):
    try:
        data = request.json
        if not data or 'status' not in data:
            return jsonify({"error": "Status is required"}), 400
            
        for candidate in candidates:
            if candidate['id'] == candidate_id:
                candidate['status'] = data['status']
                return jsonify(candidate)
        return jsonify({'error': 'Candidate not found'}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
