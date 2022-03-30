import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

import { useRoutes } from 'react-router-dom';
import config from 'config';

// login option 3 routing
const LoginAuth = Loadable(lazy(() => import('views/pages/authentication/authentication3/LoginAuth')));


// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthRoutesComponents = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <LoginAuth />
        }
    ]
};

export default function AuthenticationRoutes() {
    return useRoutes([AuthRoutesComponents], config.basename);
}
