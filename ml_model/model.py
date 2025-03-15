# ml_model/model.py
import numpy as np
from datetime import datetime, timedelta
import json

class StudyPlanOptimizer:
    """
    A simple model to optimize study plans based on user goals.
    This is a placeholder for a more sophisticated ML model.
    """
    
    def __init__(self):
        # Predefined task templates for different study goals
        self.task_templates = {
            "exam": [
                {"title": "Initial Review", "duration_hours": 2, "priority": "high"},
                {"title": "Detailed Study", "duration_hours": 3, "priority": "high"},
                {"title": "Practice Questions", "duration_hours": 2, "priority": "medium"},
                {"title": "Mock Exam", "duration_hours": 2, "priority": "high"},
                {"title": "Review Weak Areas", "duration_hours": 2, "priority": "medium"}
            ],
            "project": [
                {"title": "Research", "duration_hours": 3, "priority": "high"},
                {"title": "Planning", "duration_hours": 2, "priority": "high"},
                {"title": "Initial Draft", "duration_hours": 4, "priority": "medium"},
                {"title": "Review & Revise", "duration_hours": 3, "priority": "medium"},
                {"title": "Final Submission", "duration_hours": 2, "priority": "high"}
            ],
            "skill": [
                {"title": "Fundamentals", "duration_hours": 2, "priority": "high"},
                {"title": "Practice Session 1", "duration_hours": 2, "priority": "medium"},
                {"title": "Advanced Concepts", "duration_hours": 3, "priority": "medium"},
                {"title": "Practice Session 2", "duration_hours": 2, "priority": "medium"},
                {"title": "Skill Integration", "duration_hours": 3, "priority": "high"}
            ]
        }
        
        # Default to "skill" template if no match is found
        self.default_template = "skill"
    
    def _categorize_goal(self, goal):
        """Categorize the goal based on keywords"""
        goal_lower = goal.lower()
        
        if any(keyword in goal_lower for keyword in ["exam", "test", "quiz"]):
            return "exam"
        elif any(keyword in goal_lower for keyword in ["project", "assignment", "paper"]):
            return "project"
        else:
            return "skill"
    
    def _generate_task_schedule(self, start_date, tasks):
        """Generate a schedule for tasks starting from start_date"""
        schedule = []
        current_date = start_date
        
        for task in tasks:
            # Start time is 9 AM if morning, 2 PM if afternoon
            if current_date.hour < 12:
                start_time = current_date.replace(hour=9, minute=0)
            else:
                start_time = current_date.replace(hour=14, minute=0)
            
            end_time = start_time + timedelta(hours=task["duration_hours"])
            
            # If end time is after 6 PM, move to next day at 9 AM
            if end_time.hour >= 18:
                current_date = current_date + timedelta(days=1)
                start_time = current_date.replace(hour=9, minute=0)
                end_time = start_time + timedelta(hours=task["duration_hours"])
            
            schedule.append({
                "title": task["title"],
                "description": f"Complete {task['title']} for your goal",
                "startDate": start_time.isoformat(),
                "endDate": end_time.isoformat(),
                "priority": task["priority"]
            })
            
            # Move to next time slot
            current_date = end_time + timedelta(hours=1)
            
            # If after 6 PM, move to next day
            if current_date.hour >= 18:
                current_date = current_date + timedelta(days=1)
                current_date = current_date.replace(hour=9, minute=0)
        
        return schedule
    
    def generate_study_plan(self, goals, start_date=None):
        """
        Generate a study plan based on goals.
        
        Args:
            goals: List of study goals
            start_date: Optional start date (default: today)
            
        Returns:
            List of tasks with start and end dates
        """
        if start_date is None:
            start_date = datetime.now()
        
        all_tasks = []
        
        for i, goal in enumerate(goals):
            category = self._categorize_goal(goal)
            tasks = self.task_templates.get(category, self.task_templates[self.default_template])
            
            # Customize task titles for this specific goal
            for task in tasks:
                task["title"] = f"{task['title']} - {goal}"
            
            # Generate schedule for this goal's tasks
            goal_start_date = start_date + timedelta(days=i*2)  # Stagger goals by 2 days
            scheduled_tasks = self._generate_task_schedule(goal_start_date, tasks)
            
            all_tasks.extend(scheduled_tasks)
        
        return all_tasks

# Example usage:
if __name__ == "__main__":
    optimizer = StudyPlanOptimizer()
    goals = ["Pass calculus exam", "Complete research project", "Learn Python"]
    plan = optimizer.generate_study_plan(goals)
    print(json.dumps(plan, indent=2))