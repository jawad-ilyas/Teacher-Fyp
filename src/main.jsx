import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux';
import { store } from './store/Store.js';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import App from '../src/App';


import Home from '../src/pages/Home';
import Register from '../src/pages/Register';
import Login from '../src/pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CourseModules from './pages/CourseModules.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage.jsx';
import QuestionsDashboard from './pages/QuestionsDashboard.jsx';
import AddQuestion from './pages/AddQuestion.jsx';
import ShowQuestion from './pages/ShowQuestion.jsx';
import TeacherManagement from './pages/TeacherManagement.jsx';
import TeacherProfile from './pages/TeacherProfile.jsx';
import ShowEnrolledStudents from './pages/ShowEnrolledStudents.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import AddQuestionsIntoModule from './pages/AddQuestionsIntoModule.jsx';
import ViewModuleQuestions from './pages/ViewModuleQuestions.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Resources from './pages/Resources.jsx';
import AdminQuestionDetail from './pages/AdminQuestionDetail.jsx';
import AdminSubmissions from './pages/AdminSubmissions.jsx';

const router = createBrowserRouter([
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
    path: '/',
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses/:courseId',
        element: (
          <ProtectedRoute>
            <CourseModules />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      {
        path: 'questionsdashboard',
        element: (
          <ProtectedRoute>
            <QuestionsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'addquestion',
        element: (
          <ProtectedRoute>
            <AddQuestion />
          </ProtectedRoute>
        ),
      },
      {
        path: 'question/:id',
        element: (
          <ProtectedRoute>
            <ShowQuestion />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teacherdashboard',
        element: (
          <ProtectedRoute>
            <TeacherManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teachers/:teacherId',
        element: (
          <ProtectedRoute>
            <TeacherProfile />
          </ProtectedRoute>
        ),
      },
      {

        path: '/courses/:courseId/enrolled-students',
        element: (
          <ProtectedRoute>
            <ShowEnrolledStudents />
          </ProtectedRoute>
        ),
      },
      {


        path: '/course/:courseId/students/:studentId',
        element: (
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        ),
      },
      {

        path: "/addquestionsintomodule/:courseId/:moduleId",
        element: (
          <ProtectedRoute>
            < AddQuestionsIntoModule />
          </ProtectedRoute>

        )

      },
      {

        path: "/courses/:courseId/modules/:moduleId",
        element: (
          <ProtectedRoute>
            < ViewModuleQuestions />
          </ProtectedRoute>


        )

      },
      {

        path: "aboutus",
        element: (< AboutUs />)

      },
      {

        path: "resources",
        element: (< Resources />)

      },
      {
        path: "/admin/questions/:questionId",
        element:
          <ProtectedRoute>
            <AdminQuestionDetail />
          </ProtectedRoute>



      },
      {
        path: "/adminsubmissions/:teacherId/:courseId/:moduleId",
        element: (
          <ProtectedRoute>
            <AdminSubmissions />
          </ProtectedRoute>
        )
      },


    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)