// src/routes/router.js
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';

import App from '../App';
const router = createBrowserRouter([
    {
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
        ],
    },
]);

export default router;
