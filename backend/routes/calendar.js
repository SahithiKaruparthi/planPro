// routes/calendar.js
const express = require('express');
const router = express.Router();
const { 
  getCalendarTasks, 
  updateTask 
} = require('../controllers/calendarController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/tasks', getCalendarTasks);
router.patch('/tasks/:studyPlanId/:taskId', updateTask);

module.exports = router;