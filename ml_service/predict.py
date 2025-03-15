# ml_service/predict.py
from flask import Blueprint, request, jsonify
from model_handler import generate_tasks
from datetime import datetime, timedelta

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    print("Received input:", request.json)  # Debugging line

    data = request.json
    goals = data.get('goals', [])

    if not goals:
        return jsonify({'error': 'No goals provided'}), 400

    start_date_str = data.get('startDate')
    start_date = None

    if start_date_str:
        try:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid start date format'}), 400

    try:
        tasks = generate_tasks(goals)
        print("Generated Tasks:", tasks)

        if start_date:
            for i, task in enumerate(tasks.get("tasks", [])):
                task["start_date"] = (start_date.replace(hour=0, minute=0, second=0) + 
                                      timedelta(days=i * 2)).strftime('%Y-%m-%d')

        return jsonify({'tasks': tasks})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
