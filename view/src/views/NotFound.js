// import Head from 'next/head';
// import NextLink from 'next/link';
// material-ui
// import { useTheme } from '@mui/material/styles';
// import img from "../assets/images/not_found.png"
import img from "../assets/images/page_not_found.svg"

import {
    Box,
    Button,
    Container,
    Typography,
    Grid,
    // Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
// project imports
import AuthWrapper1 from './pages/authentication/AuthWrapper1';


const NotFound = () =>
(

    <AuthWrapper1>
        {/* <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}> */}
        {/* <Grid item xs={12}> */}
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 300px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                <Box
                    component="main"
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexGrow: 1,
                        minHeight: '100%',
                        backgroundColor: 'background.paper',
                        padding: 8,
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '20px',
                    }}
                >

                    <Container maxWidth="md">
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography
                                align="center"
                                color="textPrimary"
                                variant="h1"
                            >
                                404 Not Found
                            </Typography>
                            <Typography
                                align="center"
                                color="textPrimary"
                                variant='h4'                                    >
                                You either tried some shady route or you came here by mistake.
                                Whichever it is, try using the navigation
                            </Typography>
                            <Box sx={{ textAlign: 'center' }}>
                                <img
                                    alt="Under development"
                                    src={img}
                                    style={{
                                        marginTop: 50,
                                        display: 'inline-block',
                                        maxWidth: '100%',
                                        width: 400
                                    }}
                                />
                            </Box>
                            <Link
                                to="/dashboard"
                            >
                                <Button
                                    component="a"
                                    startIcon={(<ArrowBackIcon fontSize="small" />)}
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                >
                                    Go back to dashboard
                                </Button>
                            </Link>
                        </Box>
                    </Container>
                </Box>
                {/* </Grid> */}
                {/* </Grid> */}
            </Grid>
        </Grid>
    </AuthWrapper1>
);


export default NotFound;
