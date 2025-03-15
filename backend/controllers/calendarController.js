// controllers/calendarController.js
const StudyPlan = require('../models/studyPlan');

// Get all tasks for calendar view
const getCalendarTasks = async (req, res) => {
  try {
    const studyPlans = await StudyPlan.find({ user: req.user.userId });
    
    // Extract tasks from all study plans
    const tasks = [];
    studyPlans.forEach(plan => {
      plan.tasks.forEach(task => {
        tasks.push({
          id: task._id,
          title: task.title,
          description: task.description,
          start: task.startDate,
          end: task.endDate,
          completed: task.completed,
          priority: task.priority,
          studyPlanId: plan._id,
          studyPlanTitle: plan.title,
        });
      });
    });
    
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task (mark as completed or reschedule)
const updateTask = async (req, res) => {
  try {
    const { studyPlanId, taskId } = req.params;
    const { completed, startDate, endDate } = req.body;
    
    const studyPlan = await StudyPlan.findOne({
      _id: studyPlanId,
      user: req.user.userId,
    });
    
    if (!studyPlan) {
      return res.status(404).json({ error: `No study plan with id ${studyPlanId}` });
    }
    
    const task = studyPlan.tasks.id(taskId);
    
    if (!task) {
      return res.status(404).json({ error: `No task with id ${taskId}` });
    }
    
    // Update task
    if (completed !== undefined) {
      task.completed = completed;
    }
    
    if (startDate) {
      task.startDate = new Date(startDate);
    }
    
    if (endDate) {
      task.endDate = new Date(endDate);
    }
    
    await studyPlan.save();
    
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCalendarTasks,
  updateTask,
};