// src/services/api.js
import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add request/response interceptors
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location = '/login';
      }
      return Promise.reject(error);
    }
  );

// Study plan service
export const studyPlanService = {
  // Generate a new study plan
  generateStudyPlan: async (title, description, goals) => {
    try {
      const response = await axios.post('/api/study-plan', {
        title,
        description,
        goals,
      });
      return { success: true, data: response.data.studyPlan };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate study plan',
      };
    }
  },
  
  // Get all study plans
  getAllStudyPlans: async () => {
    try {
      const response = await axios.get('/api/study-plan');
      return { success: true, data: response.data.studyPlans };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch study plans',
      };
    }
  },
  
  // Get a single study plan
  getStudyPlan: async (id) => {
    try {
      const response = await axios.get(`/api/study-plan/${id}`);
      return { success: true, data: response.data.studyPlan };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch study plan',
      };
    }
  },
};

// Calendar service
export const calendarService = {
  // Get all tasks for calendar view
  getCalendarTasks: async () => {
    try {
      const response = await axios.get('/api/calendar/tasks');
      return { success: true, data: response.data.tasks };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch calendar tasks',
      };
    }
  },
  
  // Update a task (mark as completed or reschedule)
  updateTask: async (studyPlanId, taskId, updates) => {
    try {
      const response = await axios.patch(
        `/api/calendar/tasks/${studyPlanId}/${taskId}`,
        updates
      );
      return { success: true, data: response.data.task };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update task',
      };
    }
  },

  // Add to studyPlanService
  deleteStudyPlan: async (id) => {
    try {
      await axios.delete(`/api/study-plan/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete study plan'
      };
    }
  },

};