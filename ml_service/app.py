# ml_service/app.py
from flask import Flask, request, jsonify
from predict import predict_bp
from model_handler import generate_tasks

app = Flask(__name__)

# Register the Blueprint
app.register_blueprint(predict_bp, url_prefix='/api')

@app.route('/generate-tasks', methods=['POST'])
def generate_tasks_endpoint():
    data = request.json
    goals = data.get('goals', [])

    if not goals:
        return jsonify({'error': 'No goals provided'}), 400

    try:
        tasks = generate_tasks(goals)
        return jsonify({'tasks': tasks})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
