import { Outlet, useLocation } from 'react-router-dom';

import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from './components/CustomHeader';

const App = () => {
  const location = useLocation();

  // Define the routes that will use the custom header
  const customHeaderRoutes = [
    '/dashboard',
    '/courses/:courseId',
    '/profile',
    '/questionsdashboard',
    '/addquestion',
    '/question/:id',
    '/teacherdashboard',
    '/teachers/:teacherId',
    '/courses/:courseId/enrolled-students',
    '/course/:courseId/students/:studentId',
    '/addquestionsintomodule/:courseId/:moduleId',
    '/courses/:courseId/modules/:moduleId',
    "/adminsubmissions/:teacherId/:courseId/:moduleId",
  ];

  // Check if the current route matches any of the custom header routes
  const isCustomHeader = customHeaderRoutes.some(route => location.pathname.startsWith(route.split(':')[0]));

  return (
    <div className="min-h-screen bg-gray-100">

      {isCustomHeader ? <CustomHeader /> : <Header />}

      {/* Main Content */}
      <main className="">
        <Outlet />
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
};

export default App;
