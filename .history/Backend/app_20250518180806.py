from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

candidates = []
stages = ["Applied", "Interview Scheduled", "Selected", "Rejected"]

@app.route('/candidates', methods=['GET'])
def get_candidates():
    return jsonify(candidates)

@app.route('/candidates', methods=['POST'])
def add_candidate():
    data = request.json
    candidate = {
        'id': len(candidates) + 1,
        'name': data['name'],
        'status': 'Applied'
    }
    candidates.append(candidate)
    return jsonify(candidate), 201

@app.route('/candidates/<int:candidate_id>', methods=['PUT'])
def update_candidate(candidate_id):
    data = request.json
    for candidate in candidates:
        if candidate['id'] == candidate_id:
            candidate['status'] = data.get('status', candidate['status'])
            return jsonify(candidate)
    return jsonify({'error': 'Candidate not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
