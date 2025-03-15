import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studyPlanService } from '../services/api';
import TaskList from '../components/studyplans/TaskList';

const StudyPlanPage = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const result = await studyPlanService.getStudyPlan(id);
        if (result.success) {
          setPlan(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load study plan');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlan();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
        {plan.description && (
          <p className="mt-2 text-gray-600">{plan.description}</p>
        )}
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Study Goals</h2>
          <ul className="mt-2 space-y-2">
            {plan.goals.map((goal, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                {goal}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Study Schedule</h2>
        <TaskList tasks={plan.tasks} studyPlanId={plan._id} />
      </div>
    </div>
  );
};

export default StudyPlanPage;