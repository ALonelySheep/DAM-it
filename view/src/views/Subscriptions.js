import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Card,
    Grid,
    Typography,
    Button,
    CardActionArea,
    CardActions,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
// Secondary是右边的一个小图标链接, 暂时不需要
// import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import * as React from 'react';
import TextField from '@mui/material/TextField';

import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

const SubscriptionForm = Loadable(lazy(() => import('views/utilities/SubscriptionForm')));

// ===============================|| COLOR BOX ||=============================== //


const SubBox = ({ bgcolor, title, data, dark }) => {
    const [open, setOpen] = React.useState(false);
    // const [value, setValue] = React.useState('');
    // const theme = useTheme();
    // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCancle = () => {
        setOpen(false);
        console.log('cancle');
    };

    const handleSubmit = () => {
        setOpen(false);
        console.log('submit');
        // console.log('submit: ', value);
    };

    const handleClose = () => {
        setOpen(false);
        console.log('Closed');
    };

    return (
        <>
            <Dialog
                // Dialog 调整大小的方式是允许fullwidth再设置maxwidth的大小
                fullWidth
                maxWidth='sm'
                open={open}
                onClose={handleClose}>
                <DialogContent>
                    <SubscriptionForm data={data} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancle}>Cancel</Button>
                    <Button onClick={handleSubmit}>Subscribe</Button>
                </DialogActions>
            </Dialog>

            <Card sx={{ mb: 3 }}>
                <CardActionArea onClick={() => {
                    console.log("CardActionArea clicked: ", data.label);
                    handleClickOpen();
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 4.5,
                            bgcolor,
                            color: dark ? 'grey.800' : '#ffffff'
                        }}
                    >
                        {title && (
                            <Typography variant="subtitle1" color="inherit">
                                {title}
                            </Typography>
                        )}
                        {!title && <Box sx={{ p: 1.15 }} />}
                    </Box>
                </CardActionArea>
            </Card>
            {
                data && (
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle2">{data.label}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
                                {data.color}
                            </Typography>
                        </Grid>
                    </Grid>
                )
            }
        </>
    )
};

SubBox.propTypes = {
    bgcolor: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.object.isRequired,
    dark: PropTypes.bool
};

// ===============================|| UI COLOR ||=============================== //

const Subscriptions = () => (
    // <MainCard title="Color Palette" secondary={<SecondaryAction link="https://next.material-ui.com/system/palette/" />}> //那个Secondary是右边的一个小图标链接, 暂时不需要
    <MainCard title="Subscriptions">
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubCard title="App Name Here">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            {/* 上面的xs等等都是Breakpoints, 意思是在不同的情况下,一个box占的屏幕比例是不一样的 比如在小屏幕时, 一个box会占满整个屏幕, 而在大屏幕的的时候, 一个box只占用屏幕的2/12=六分之一 */}
                            <SubBox bgcolor="primary.light" data={{ label: 'Blue-50', color: '#E3F2FD' }} title="Subscription A" dark />
                        </Grid>
                        {/* <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="primary.200" data={{ label: 'Blue-200', color: '#90CAF9' }} title="primary[200]" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="primary.main" data={{ label: 'Blue-500', color: '#2196F3' }} title="primary.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="primary.dark" data={{ label: 'Blue-600', color: '#1E88E5' }} title="primary.dark" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="primary.800" data={{ label: 'Blue-800', color: '#1565C0' }} title="primary[800]" />
                        </Grid> */}
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12}>
                <SubCard title="Secondary Color">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox
                                bgcolor="secondary.light"
                                data={{ label: 'DeepPurple-50', color: '#ede7f6' }}
                                title="secondary.light"
                                dark
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox
                                bgcolor="secondary.200"
                                data={{ label: 'DeepPurple-200', color: '#b39ddb' }}
                                title="secondary[200]"
                                dark
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox
                                bgcolor="secondary.main"
                                data={{ label: 'DeepPurple-500', color: '#673ab7' }}
                                title="secondary.main"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox
                                bgcolor="secondary.dark"
                                data={{ label: 'DeepPurple-600', color: '#5e35b1' }}
                                title="secondary.dark"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="secondary.800" data={{ label: 'DeepPurple-800', color: '#4527a0' }} title="secondary[800]" />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12}>
                <SubCard title="Success Color">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="success.light" data={{ label: 'Green-A100', color: '#b9f6ca' }} title="success.light" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="success.main" data={{ label: 'Green-A200', color: '#69f0ae' }} title="success[200]" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="success.main" data={{ label: 'Green-A400', color: '#69f0ae' }} title="success.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="success.dark" data={{ label: 'Green-A700', color: '#00c853' }} title="success.dark" />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12}>
                <SubCard title="Orange Color">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox
                                bgcolor="orange.light"
                                data={{ label: 'DeepOrange-50', color: '#fbe9e7' }}
                                title="orange.light"
                                dark
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="orange.main" data={{ label: 'DeepOrange-200', color: '#ffab91' }} title="orange.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="orange.dark" data={{ label: 'DeepOrange-800', color: '#d84315' }} title="orange.dark" />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12}>
                <SubCard title="Error Color">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="error.light" data={{ label: 'Red-50', color: '#ef9a9a' }} title="error.light" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="error.main" data={{ label: 'Red-200', color: '#f44336' }} title="error.main" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="error.dark" data={{ label: 'Red-800', color: '#c62828' }} title="error.dark" />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12}>
                <SubCard title="Warning Color">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="warning.light" data={{ label: 'Amber-50', color: '#b9f6ca' }} title="warning.light" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="warning.main" data={{ label: 'Amber-100', color: '#ffe57f' }} title="warning.main" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="warning.dark" data={{ label: 'Amber-500', color: '#FFC107' }} title="warning.dark" />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12}>
                <SubCard title="Grey Color">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="grey.50" data={{ label: 'Grey-50', color: '#fafafa' }} title="grey[50]" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="grey.100" data={{ label: 'Grey-100', color: '#f5f5f5' }} title="grey[100]" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="grey.200" data={{ label: 'Grey-200', color: '#eeeeee' }} title="grey[200]" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="grey.300" data={{ label: 'Grey-300', color: '#e0e0e0' }} title="grey[300]" dark />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="grey.500" data={{ label: 'Grey-500', color: '#9e9e9e' }} title="grey[500]" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="grey.700" data={{ label: 'Grey-600', color: '#757575' }} title="grey[600]" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="grey.700" data={{ label: 'Grey-700', color: '#616161' }} title="grey[700]" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="grey.900" data={{ label: 'Grey-900', color: '#212121' }} title="grey[900]" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <SubBox bgcolor="#fff" data={{ label: 'Pure White', color: '#ffffff' }} title="Pure White" dark />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    </MainCard>
);


export default Subscriptions;