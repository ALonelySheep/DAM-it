import AuthGate from 'views/pages/authentication/AuthGate';
import config from 'config';

import { lazy } from 'react';

import { useRoutes } from 'react-router-dom';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';


// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// const NotFound = Loadable(lazy(() => import('views/NotFound')));


// ==============================|| MAIN ROUTING ||============================== //



const MainRoutesComponents =
{
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/utils/util-typography',
            element: <UtilsTypography />
        },
        {
            path: '/utils/util-color',
            element: <UtilsColor />
        },
        {
            path: '/utils/util-shadow',
            element: <UtilsShadow />
        },
        {
            path: '/icons/tabler-icons',
            element: <UtilsTablerIcons />
        },
        {
            path: '/icons/material-icons',
            element: <UtilsMaterialIcons />
        },
        {
            path: '/sample-page',
            element: <SamplePage />
        }
    ]
}

const AuthedMainRoutesComponents =
{
    path: '/',
    element: <AuthGate />,
    children: [
        MainRoutesComponents,
        // TODO 加上path: '*', 会出现疯狂报错的问题
        {
            // path: '*',
            // element: <h2>sdsd</h2>
            // element: <NotFound />
        }
    ]
}

export default function MainRoutes() {
    return useRoutes([AuthedMainRoutesComponents], config.basename);
}


