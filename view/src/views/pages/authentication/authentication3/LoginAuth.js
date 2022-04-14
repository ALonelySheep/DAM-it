import { Guard } from '@authing/react-ui-components';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'AuthProvider';
import addUser from 'api/userAPI';
// import { useEffect, useState } from 'react';

// 引入 css 文件
import '@authing/react-ui-components/lib/index.min.css';

// material-ui
import { Grid } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';


const LoginAuth = () => {
    const auth = useAuth();
    const appId = '623ed2722dbacc824bd2bb0b';

    const OnLogin = (userInfo, authClient) => {
        console.log("Login")
        console.log(userInfo)
        auth.setUser(userInfo);
        auth.setClient(authClient);
    };
    const onRegister = async(userInfo, authClient) => {
        console.log("Register")
        console.log(userInfo.token)
        await addUser(userInfo.token)
        auth.setUser(userInfo);
        auth.setClient(authClient);
    }

    return (auth.userInfo ? <Navigate to="/dashboard" /> :
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <Guard appId={appId} onLogin={OnLogin} onRegister={onRegister} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default LoginAuth;
