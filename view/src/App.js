import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
// 这里是从routes文件夹里面的index.js里面引入的
import MainRoutes from 'routes/MainRoutes';
import AuthenticationRoutes from 'routes/AuthenticationRoutes';

// defaultTheme
// 同理，这里是从themes/index.js里面引入的
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import {AuthProvider} from 'AuthProvider';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <AuthProvider>
                        <AuthenticationRoutes />
                        <MainRoutes />
                    </AuthProvider>
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
