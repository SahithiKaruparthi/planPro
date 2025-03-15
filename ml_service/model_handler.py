# ml_service/model_handler.py
import requests
import json
import os

# Load API key from environment variable (set this in your system)
# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_KEY="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"


GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_tasks(goals):
    print("Received Goals:", goals)  # Debugging step
    print("Groq API URL:", GROQ_API_URL)

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    print("Request Headers:", headers)  # ✅ Now, headers is defined before printing

    prompt = f"""
    Generate a structured study plan with tasks based on these goals:
    {', '.join(goals)}
    
    The response should be in JSON format:
    {{
        "tasks": [
            {{
                "title": "Task title",
                "description": "Task description",
                "duration_hours": 2,
                "priority": "high",
                "dependencies": []
            }}
        ]
    }}
    """

    payload = {
        "model": "llama-3.1-8b-instant",  # Ensure this model exists
        "messages": [
            {"role": "system", "content": "You are an expert study planner."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload)

    print("Groq API Response Status Code:", response.status_code)  # Debugging
    print("Groq API Response JSON:", response.text)  # Debugging

    try:
        result = response.json()
    except json.JSONDecodeError:
        return {"error": "Invalid JSON response from API"}

    if "choices" in result and len(result["choices"]) > 0:
        generated_text = result["choices"][0]["message"]["content"]

        try:
            json_start = generated_text.find('{')
            json_end = generated_text.rfind('}') + 1
            json_str = generated_text[json_start:json_end]
            parsed_data = json.loads(json_str)
            
            # Extract only tasks if "study_plan" exists
            if "study_plan" in parsed_data and "tasks" in parsed_data["study_plan"]:
                return {"success": True, "data": parsed_data["study_plan"]["tasks"]}
            
            return {"error": "No tasks found in API response"}
        except Exception as e:
            return {"error": f"Failed to parse JSON response: {str(e)}"}

    
    return {"error": "No valid response from the model"}
