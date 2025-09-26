# planPro

planPro is a project designed to help users generate well-structured and effective study plans for various subjects or objectives. PlanPro harnesses the capabilities of Groq for advanced reasoning and plan generation, ensuring that each study plan is tailored, actionable, and optimized for real-world learning.

## Features

- **AI-Powered Study Plan Generation:** Utilizes Groq to analyze input topics, deadlines, and user preferences to produce personalized study plans.
- **Flexible Inputs:** Accepts user goals, available study time, and preferred pacing to build realistic schedules.
- **Structured Output:** Provides plans broken down by days, weeks, or modules, with clear milestones and actionable tasks.
- **Python-Based:** Easy to extend and integrate into other educational tools or workflows.

## How It Works

1. **User Input:** The user specifies the subject or exam, available preparation time, and any constraints (e.g., preferred days, blackout periods).
2. **Groq Integration:** planPro connects to Groq, sending user inputs and leveraging Groq's advanced reasoning to generate a plan.
3. **Output:** The tool returns a detailed study schedule, including daily/weekly tasks and progress checkpoints.

## Example Usage

```python
from planpro import generate_study_plan

topic = "Data Structures and Algorithms"
start_date = "2025-10-01"
end_date = "2025-12-01"
preferences = {
    "study_days_per_week": 5,
    "hours_per_day": 2,
    "focus_areas": ["Trees", "Graphs", "Dynamic Programming"]
}

plan = generate_study_plan(
    topic=topic,
    start_date=start_date,
    end_date=end_date,
    preferences=preferences
)

print(plan)
```

## Output Example

```
Week 1-2:
  - Introduction to Data Structures
  - Arrays and Linked Lists
  - Practice: LeetCode Easy Problems

Week 3-4:
  - Trees: Binary Trees, BSTs
  - Implementation and Traversals
  - Practice: Tree-specific problems

...

Final Week:
  - Revision and mock tests
  - Focus on weak areas identified in practice sessions
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/SahithiKaruparthi/planPro.git
cd planPro
pip install -r requirements.txt
```

## Configuration

planPro requires credentials or an API key to access Groq's reasoning engine. Set up your `.env` or configuration file as follows:

```
GROQ_API_KEY=your_groq_api_key_here
```

## License

This project is licensed under the MIT License.

