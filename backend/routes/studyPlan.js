// routes/studyPlan.js
const express = require('express');
const router = express.Router();
const { 
  generateStudyPlan, 
  getAllStudyPlans, 
  getStudyPlan 
} = require('../controllers/studyPlanController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.post('/', generateStudyPlan);
router.get('/', getAllStudyPlans);
router.get('/:id', getStudyPlan);

module.exports = router;