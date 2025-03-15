// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studyPlanService } from '../services/api';

const HomePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState(['']);
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Fetch existing study plans
  useEffect(() => {
    const fetchStudyPlans = async () => {
      const result = await studyPlanService.getAllStudyPlans();
      if (result.success) {
        setStudyPlans(result.data);
      }
      setLoadingPlans(false);
    };
    
    fetchStudyPlans();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    // Validate form
    if (!title) {
      setFormError('Please enter a title for your study plan');
      return;
    }
    
    // Filter out empty goals
    const filteredGoals = goals.filter(goal => goal.trim() !== '');
    
    if (filteredGoals.length === 0) {
      setFormError('Please enter at least one study goal');
      return;
    }
    
    setLoading(true);
    
    // Submit form
    const result = await studyPlanService.generateStudyPlan(
      title,
      description,
      filteredGoals
    );
    
    if (result.success) {
      // Reset form
      setTitle('');
      setDescription('');
      setGoals(['']);
      setSuccessMessage('Study plan created successfully!');
      
      // Refresh study plans
      const plansResult = await studyPlanService.getAllStudyPlans();
      if (plansResult.success) {
        setStudyPlans(plansResult.data);
      }
    } else {
      setFormError(result.error);
    }
    
    setLoading(false);
  };

  // Add a new goal input
  const addGoal = () => {
    setGoals([...goals, '']);
  };

  // Update a goal input
  const updateGoal = (index, value) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  // Remove a goal input
  const removeGoal = (index) => {
    if (goals.length > 1) {
      const newGoals = [...goals];
      newGoals.splice(index, 1);
      setGoals(newGoals);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Study Plan</h1>
        <p className="mt-2 text-gray-600">
          Enter your study goals and we'll generate an optimized study plan for you.
        </p>
      </div>
      
      {/* Create Study Plan Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{formError}</div>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{successMessage}</div>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Study Plan Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="e.g., Final Exams Prep"
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Describe your overall study objectives"
              />
            </div>
            
            {/* Study Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Study Goals
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Enter specific subjects or topics you want to study
              </p>
              
              <div className="space-y-2 mt-2">
                {goals.map((goal, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      className="flex-1 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="e.g., Master calculus derivatives"
                    />
                    {goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        // Continue from the previous code in HomePage.js
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only">Remove</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={addGoal}
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Goal
              </button>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Study Plan'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Existing Study Plans */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Study Plans</h2>
        
        {loadingPlans ? (
          <div className="text-center py-10">
            <svg className="animate-spin mx-auto h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading your study plans...</p>
          </div>
        ) : studyPlans.length === 0 ? (
          <div className="text-center py-10 bg-white shadow rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No study plans</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first study plan to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studyPlans.map((plan) => (
              <Link 
                key={plan._id} 
                to={`/study-plan/${plan._id}`}
                className="block hover:shadow-lg transition-shadow duration-200"
              >
                <div className="bg-white shadow rounded-lg p-6 h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{plan.title}</h3>
                    
                    {plan.description && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{plan.description}</p>
                    )}
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Goals:</h4>
                      <ul className="mt-2 space-y-1">
                        {plan.goals.slice(0, 3).map((goal, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <svg className="h-4 w-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{goal}</span>
                          </li>
                        ))}
                        {plan.goals.length > 3 && (
                          <li className="text-sm text-gray-500 italic">
                            +{plan.goals.length - 3} more goals
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center">
                    <div className="bg-primary-50 rounded-md py-1 px-2 text-xs font-medium text-primary-700">
                      {plan.tasks.length} tasks
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      Created {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;