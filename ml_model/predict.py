# ml_model/predict.py
from flask import Flask, request, jsonify
from model import StudyPlanOptimizer
from datetime import datetime
import json

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # Extract goals from request
    goals = data.get('goals', [])
    
    if not goals:
        return jsonify({'error': 'No goals provided'}), 400
    
    # Extract start date if provided
    start_date_str = data.get('startDate')
    start_date = None
    
    if start_date_str:
        try:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid start date format'}), 400
    
    # Generate study plan
    optimizer = StudyPlanOptimizer()
    tasks = optimizer.generate_study_plan(goals, start_date)
    
    return jsonify({'tasks': tasks})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)