// src/App.js
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';

// // Pages
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import CalendarPage from './pages/CalendarPage';
// import Layout from './components/Layout';
// import StudyPlanPage from './pages/studyPlanPage';

// // Protected route component
// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
  
//   if (!user) {
//     return <Navigate to="/login" />;
//   }
  
//   return children;
// };

// function App() {
//   return (
//     <Routes>

//       <Route path="/login" element={<LoginPage />} />

//       <Route path="/register" element={<RegisterPage />} />

//       <Route path="/" element={
//         <ProtectedRoute>
//           <Layout>
//             <HomePage />
//           </Layout>
//         </ProtectedRoute>
//       } />

//       <Route path="/calendar" element={
//         <ProtectedRoute>
//           <Layout>
//             <CalendarPage />
//           </Layout>
//         </ProtectedRoute>
//       } />
      
//       <Route path="/study-plan/:id" element={
//         <ProtectedRoute>
//           <Layout>
//             <StudyPlanPage />
//           </Layout>
//           </ProtectedRoute>
//       } />

//     </Routes>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CalendarPage from './pages/CalendarPage';
import Layout from './components/Layout';
import StudyPlanPage from './pages/studyPlanPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter> {/* Wrap everything inside BrowserRouter */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Layout>
                <CalendarPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-plan/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <StudyPlanPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
