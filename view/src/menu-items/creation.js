// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill,  IconBrush } from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,

    IconBrush
};

// ==============================|| Creations MENU ITEMS ||============================== //

const creations = {
    id: 'creations',
    title: 'Creations',
    type: 'group',
    children: [
        
        {
            id: 'personal-works',
            title: 'Personal Works',
            type: 'item',
            url: '/personal-work',
            icon: icons.IconBrush,
            breadcrumbs: false
        },
        // {
        //     id: 'util-typography',
        //     title: 'Typography',
        //     type: 'item',
        //     url: '/utils/util-typography',
        //     icon: icons.IconTypography,
        //     breadcrumbs: false
        // },
        // {
        //     id: 'util-color',
        //     title: 'Color',
        //     type: 'item',
        //     url: '/utils/util-color',
        //     icon: icons.IconPalette,
        //     breadcrumbs: false
        // },
        // {
        //     id: 'util-shadow',
        //     title: 'Shadow',
        //     type: 'item',
        //     url: '/utils/util-shadow',
        //     icon: icons.IconShadow,
        //     breadcrumbs: false
        // },
        // {
        //     id: 'icons',
        //     title: 'Icons',
        //     type: 'collapse',
        //     icon: icons.IconWindmill,
        //     children: [
        //         {
        //             id: 'tabler-icons',
        //             title: 'Tabler Icons',
        //             type: 'item',
        //             url: '/icons/tabler-icons',
        //             breadcrumbs: false
        //         },
        //         {
        //             id: 'material-icons',
        //             title: 'Material Icons',
        //             type: 'item',
        //             url: '/icons/material-icons',
        //             breadcrumbs: false
        //         }
        //     ]
        // },
    ]
};

export default creations;
