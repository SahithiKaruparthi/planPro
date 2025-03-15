// src/pages/CalendarPage.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { calendarService } from '../services/api';

const CalendarPage = () => {
  const [tasks, setTasks] = React.useState([]);;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(false);
  const [newDates, setNewDates] = useState({ startDate: null, endDate: null });

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const result = await calendarService.getCalendarTasks();
      
      console.log("API Response:", result); // Debugging line to check API response
      
      if (result.success && Array.isArray(result.data)) {  
      const events = result.data.map(task => ({ // Use result.data directly
        id: `${task.studyPlanId}-${task.id}`,
        title: task.title,
        start: task.start,
        end: task.end,
        backgroundColor: getTaskColor(task.priority, task.completed),
        borderColor: getTaskColor(task.priority, task.completed),
        textColor: '#FFFFFF',
        extendedProps: { ...task }
      }));
      setTasks(events);
    } else {
      console.error("No tasks found in API response:", result);
      setTasks([]); 
      setError(result.error || "No tasks available");
    }

    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  fetchTasks();
}, []);


  const getTaskColor = (priority, completed) => {
    if (completed) {
      return '#9CA3AF'; // Gray for completed tasks
    }
    
    switch (priority) {
      case 'high':
        return '#EF4444'; // Red
      case 'medium':
        return '#F59E0B'; // Amber
      case 'low':
        return '#10B981'; // Green
      default:
        return '#3B82F6'; // Blue
    }
  };

  const handleEventClick = (info) => {
    setSelectedTask(info.event.extendedProps);
    setShowTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
    setNewDates({ startDate: null, endDate: null });
  };

  const handleMarkCompleted = async () => {
    if (!selectedTask) return;

    setUpdatingTask(true);
    try {
      const result = await calendarService.updateTask(
        selectedTask.studyPlanId,
        selectedTask.id,
        { completed: true }
      );

      if (result.success) {
        // Update the local state
        setTasks(tasks.map(task => {
          if (task.id === `${selectedTask.studyPlanId}-${selectedTask.id}`) {
            return {
              ...task,
              backgroundColor: '#9CA3AF', // Gray
              borderColor: '#9CA3AF',
              extendedProps: {
                ...task.extendedProps,
                completed: true
              }
            };
          }
          return task;
        }));
        setShowTaskModal(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    } finally {
      setUpdatingTask(false);
    }
  };

  const handleEventDrop = async (info) => {
    const { event } = info;
    const taskId = event.extendedProps.id;
    const studyPlanId = event.extendedProps.studyPlanId;
    
    try {
      const result = await calendarService.updateTask(
        studyPlanId,
        taskId,
        {
          startDate: event.start.toISOString(),
          endDate: event.end.toISOString()
        }
      );
      
      if (!result.success) {
        setError(result.error);
        info.revert();
      }
    } catch (err) {
      setError('Failed to reschedule task');
      console.error(err);
      info.revert();
    }
  };

  const handleDateChange = (field, date) => {
    setNewDates(prev => ({ ...prev, [field]: date }));
  };

  const handleReschedule = async () => {
    if (!selectedTask || !newDates.startDate || !newDates.endDate) return;

    setUpdatingTask(true);
    try {
      const result = await calendarService.updateTask(
        selectedTask.studyPlanId,
        selectedTask.id,
        { 
          startDate: newDates.startDate.toISOString(),
          endDate: newDates.endDate.toISOString()
        }
      );

      if (result.success) {
        // Update the local state
        setTasks(tasks.map(task => {
          if (task.id === `${selectedTask.studyPlanId}-${selectedTask.id}`) {
            return {
              ...task,
              start: newDates.startDate,
              end: newDates.endDate,
              extendedProps: {
                ...task.extendedProps,
                start: newDates.startDate.toISOString(),
                end: newDates.endDate.toISOString()
              }
            };
          }
          return task;
        }));
        setShowTaskModal(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to reschedule task');
      console.error(err);
    } finally {
      setUpdatingTask(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Study Calendar</h1>
        <p className="mt-2 text-gray-600">
          View and manage your study schedule. Click on a task to see details or drag and drop to reschedule.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-10">
            <svg className="animate-spin mx-auto h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading your calendar...</p>
          </div>
        ) : (
          <div className="h-[70vh]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={tasks}
              eventClick={handleEventClick}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              eventDrop={handleEventDrop}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">Task Details</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Study Plan</div>
                <div className="mt-1 text-gray-900">{selectedTask.studyPlanTitle}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Task</div>
                <div className="mt-1 text-gray-900">{selectedTask.title}</div>
              </div>
              
              {selectedTask.description && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Description</div>
                  <div className="mt-1 text-gray-900">{selectedTask.description}</div>
                </div>
              )}
              
              <div>
                <div className="text-sm font-medium text-gray-500">Priority</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedTask.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedTask.completed ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedTask.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Time</div>
                <div className="mt-1 text-gray-900">
                  {new Date(selectedTask.start).toLocaleString()} - {new Date(selectedTask.end).toLocaleTimeString()}
                </div>
              </div>
              
              {!selectedTask.completed && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Reschedule</div>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="startDate" className="block text-xs font-medium text-gray-700">Start Date</label>
                      <input
                        type="datetime-local"
                        id="startDate"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        defaultValue={new Date(selectedTask.start).toISOString().slice(0, 16)}
                        onChange={(e) => handleDateChange('startDate', new Date(e.target.value))}
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-xs font-medium text-gray-700">End Date</label>
                      <input
                        type="datetime-local"
                        id="endDate"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        defaultValue={new Date(selectedTask.end).toISOString().slice(0, 16)}
                        onChange={(e) => handleDateChange('endDate', new Date(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              
              {!selectedTask.completed && (
                <>
                  <button
                    onClick={handleReschedule}
                    disabled={updatingTask || !newDates.startDate || !newDates.endDate}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {updatingTask ? 'Updating...' : 'Reschedule'}
                  </button>
                  
                  <button
                    onClick={handleMarkCompleted}
                    disabled={updatingTask}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {updatingTask ? 'Updating...' : 'Mark Completed'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;