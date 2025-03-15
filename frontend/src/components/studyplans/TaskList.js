import React from 'react';
import { calendarService } from '../../services/api';

const TaskList = ({ tasks, studyPlanId }) => {
  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const result = await calendarService.updateTask(
        studyPlanId,
        taskId,
        updates
      );
      if (!result.success) {
        console.error('Update failed:', result.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="flex items-center p-4 border rounded-lg">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => handleTaskUpdate(task._id, {
              completed: e.target.checked
            })}
            className="h-4 w-4 text-primary-600 rounded border-gray-300"
          />
          
          <div className="ml-4 flex-1">
            <h3 className="font-medium">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            )}
            <div className="mt-2 flex items-center space-x-4 text-sm">
              <span className="text-gray-500">
                {new Date(task.startDate).toLocaleDateString()} -{' '}
                {new Date(task.endDate).toLocaleDateString()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;