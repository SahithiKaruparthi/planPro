// controllers/studyPlanController.js
const StudyPlan = require('../models/studyPlan');
const axios = require('axios');

// Generate a study plan
const generateStudyPlan = async (req, res) => {
  try {
    const { title, description, goals } = req.body;
    
    if (!title || !goals || goals.length === 0) {
      return res.status(400).json({ error: 'Please provide title and goals' });
    }
    
    // Call the ML model API or use a simple algorithm to generate tasks
    // For now, we'll use a simple algorithm
    const tasks = generateTasksFromGoals(goals);
    
    const studyPlan = await StudyPlan.create({
      user: req.user.userId,
      title,
      description,
      goals,
      tasks,
    });
    
    res.status(201).json({ studyPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to generate tasks from goals
const generateTasksFromGoals = (goals) => {
  const tasks = [];
  const now = new Date();
  
  goals.forEach((goal, index) => {
    // Create 3 tasks per goal
    for (let i = 0; i < 3; i++) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() + index * 3 + i);
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 2);
      
      tasks.push({
        title: `Task ${i + 1} for ${goal}`,
        description: `Complete task ${i + 1} to achieve ${goal}`,
        startDate,
        endDate,
        priority: i === 0 ? 'high' : i === 1 ? 'medium' : 'low',
      });
    }
  });
  
  return tasks;
};

// Get all study plans for a user
const getAllStudyPlans = async (req, res) => {
  try {
    const studyPlans = await StudyPlan.find({ user: req.user.userId });
    res.status(200).json({ studyPlans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single study plan
const getStudyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const studyPlan = await StudyPlan.findOne({
      _id: id,
      user: req.user.userId,
    });
    
    if (!studyPlan) {
      return res.status(404).json({ error: `No study plan with id ${id}` });
    }
    
    res.status(200).json({ studyPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateStudyPlan,
  getAllStudyPlans,
  getStudyPlan,
};