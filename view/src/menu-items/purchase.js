// assets
import { IconKey, IconRss, IconNews, } from '@tabler/icons';

// constant
const icons = {
    IconKey,
    IconRss,
    IconNews,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Purchase',
    // caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'subscriptions',
            title: 'Subscriptions',
            type: 'item',
            url: '/subscription',
            icon: icons.IconRss,
            breadcrumbs: false
        },
        {
            id: 'paied-contents',
            title: 'Paid Contents',
            type: 'item',
            url: '/paid-content',
            icon: icons.IconNews,
            breadcrumbs: false
        },
        // {
        //     id: 'authentication',
        //     title: 'Authentication',
        //     type: 'collapse',
        //     icon: icons.IconKey,
        //     children: [
        //         {
        //             id: 'login3',
        //             title: 'Login',
        //             type: 'item',
        //             url: '/login-sample',
        //             target: true
        //         },
        //         {
        //             id: 'register3',
        //             title: 'Register',
        //             type: 'item',
        //             url: '/register-sample',
        //             target: true
        //         }
        //     ]
        // }
    ]
};

export default pages;
