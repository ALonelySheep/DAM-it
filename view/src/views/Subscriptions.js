// import PropTypes from 'prop-types';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons';
// material-ui
import {
    Box,
    Card,
    Grid,
    Typography,
    CardActionArea,
    Stack,
    CircularProgress,
    DialogContent,
    Dialog,
    IconButton,
    Tooltip,
    // useTheme,
    // DialogContentText,
} from '@mui/material';

import { useState, useEffect, lazy } from 'react';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import Loadable from 'ui-component/Loadable';
import { gridSpacing } from 'store/constant';

import { deleteSubscription, getAllSubscriptions } from 'api/subscriptionAPI';
import { getAllApps } from 'api/appAPI';

import DeleteConfirmation from 'views/utilities/DeleteConfirmation';

// =============================|| Lazy Load ||=============================== //
const SubscriptionForm = Loadable(lazy(() => import('views/utilities/SubscriptionForm')));
const AppForm = Loadable(lazy(() => import('views/utilities/AppForm')));

// =============================|| Auxilary ||=============================== //
// Accepts the array and key
const groupBy = (array, key) => array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
}, {}); // empty object is the initial value for result object

const preprocessData = (apps, subs) => {
    // Group Subs by Appid
    // console.log('preprocessing...')
    // console.log(subs);
    const subsGrouped = groupBy(subs, 'appid');
    for (let i = 0; i < apps.length; i += 1) {
        if (!subsGrouped[apps[i].id])
            subsGrouped[apps[i].id] = [];
    }
    return subsGrouped;
}

// ==============================|| Main Component ||=============================== //
//* Haven't figure out how to only rerender the affected components
//* Add more color for subscriptions


const Subscriptions = () => {

    let subscriptionsPerApp
    let appList

    const [isLoading, setLoading] = useState(true);
    const [subscriptions, setSubscriptions] = useState([]);
    const [apps, setApps] = useState([]);
    const [isDialogClosed, setDialogClosed] = useState(false);
    const [isDeleteMode, setDeleteMode] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            console.log('I\'m only supposed to show at first render!');

            subscriptionsPerApp = await getAllSubscriptions()
            appList = await getAllApps();
            // console.log("Raw Data From Backend：");
            // console.log(subscriptionsPerApp);
            // console.log(appList);
            subscriptionsPerApp = preprocessData(appList, subscriptionsPerApp)

            console.log("Preprocessed data: ")
            // console.log(subscriptionsPerApp);
            console.log(appList);

            // setSubscriptions(subscriptionsPerApp)
            // setApps(appList)
            if (isMounted) {
                setSubscriptions(prevState => Object.assign(prevState, subscriptionsPerApp));
                setApps(prevState => Object.assign(prevState, appList));
            }

            setLoading(false);
        }
        fetchData();

        return () => { isMounted = false };
    }, []);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            console.log('I\'m supposed to show every time the dialog closes!');
            if (!isLoading) {
                subscriptionsPerApp = await getAllSubscriptions()
                appList = await getAllApps()

                subscriptionsPerApp = preprocessData(appList, subscriptionsPerApp)

                console.log("Preprocessed data: ")
                console.log(subscriptionsPerApp);
                console.log(appList);

                if (isMounted) {
                    setSubscriptions(subscriptionsPerApp)
                    setApps(appList)
                }
                // 下面的更新方式会导致显示更新延迟
                // setSubscriptions(prevState => Object.assign(prevState, subscriptionsPerApp));
                // setApps(prevState => Object.assign(prevState, appList));
                // setSubscriptions(prevState => ({ ...prevState, ...subscriptionsPerApp }));
                // setApps(prevState => ({ ...prevState, ...appList }));
                setLoading(false);
            }
        }
        fetchData();
        return () => { isMounted = false };
    }, [isDialogClosed]);


    const SubBox = ({ subscription }) => {
        const { name, price, monetaryUnit, billingCycle, billingCycleUnit } = subscription;
        const [open, setOpen] = useState(false);
        // console.log(typeof price)
        const priceString = (Number(price) === 0) ? 'Free' : `${price} ${monetaryUnit}`;
        const tailIndex = billingCycle > 1 ? billingCycleUnit.length : billingCycleUnit.length - 1;
        const billingCycleString = `${billingCycle} ${billingCycleUnit.charAt(0).toUpperCase() + billingCycleUnit.slice(1, tailIndex)} `;


        // TODO Change color based on billing cycle and application
        const darkColorText = false;

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setDialogClosed(!isDialogClosed);
            setOpen(false);
        };

        return (
            <>
                <Dialog
                    // Dialog 调整大小的方式是允许fullwidth再设置maxwidth的大小
                    fullWidth
                    // fullScreen={fullScreen}
                    maxWidth='sm'
                    open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        {isDeleteMode ?
                            <DeleteConfirmation target={subscription} setOpen={setOpen}
                                setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} API={deleteSubscription} /> :
                            <SubscriptionForm title={name} setOpen={setOpen} setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} isEdit subscription={subscription} />}
                    </DialogContent>
                </Dialog>

                <Card sx={{ mb: 3 }}>
                    <CardActionArea onClick={() => {
                        handleClickOpen();
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                py: 4.5,
                                bgcolor: "primary.main",
                                // 这个是根据背景色改变字体颜色的, 防止字看不清
                                color: darkColorText ? 'grey.800' : '#ffffff'
                            }}
                        >
                            {name && (
                                <Typography variant="subtitle1" color="inherit">
                                    {name}
                                </Typography>
                            )}
                            {!name && <Box sx={{ p: 1.15 }} />}
                        </Box>
                    </CardActionArea>
                </Card>
                {
                    (priceString || billingCycleString) && (
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
                                    {priceString}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">{billingCycleString}</Typography>
                            </Grid>
                        </Grid>
                    )
                }
            </>
        )
    };

    const NewSubscription = (props) => {
        const { app } = props;

        const newSubTitle = `New Subscription for ${app.name}`;
        const bgcolor = "grey.100"
        const darkColorText = true
        const [open, setOpen] = useState(false);

        // No Cancel button is displayed if use fullscreen
        // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
            setDialogClosed(!isDialogClosed);
            // console.log('Closed');
        };

        return (
            <>
                <Dialog
                    fullWidth
                    // fullScreen={fullScreen}
                    maxWidth='sm'
                    open={!isDeleteMode && open}
                    onClose={handleClose}>
                    <DialogContent>
                        <SubscriptionForm title={newSubTitle} setOpen={setOpen} setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} isEdit={false} appid={app.id} />
                    </DialogContent>
                </Dialog>

                <Card sx={{ mb: 3 }}>
                    <CardActionArea onClick={() => {
                        handleClickOpen();
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                py: 4.5,
                                bgcolor,
                                // 这个是根据背景色改变字体颜色的, 防止字看不清
                                color: darkColorText ? 'grey.800' : '#ffffff',
                                paddingBottom: '28px'
                            }}
                        ><Typography variant="subtitle1" color="inherit">
                                <IconPlus />
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            </>
        )
    };

    const NewApp = () => {
        const title = `New App`;
        const bgcolor = "grey.100"
        const darkColorText = true
        const [open, setOpen] = useState(false);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
            setDialogClosed(!isDialogClosed);
        };

        return (
            <>
                <Dialog
                    fullWidth
                    // fullScreen={fullScreen}
                    maxWidth='sm'
                    open={!isDeleteMode && open}
                    onClose={handleClose}>
                    <DialogContent>
                        <AppForm title={title} setOpen={setOpen} setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} isEdit={false} />
                    </DialogContent>
                </Dialog>

                <Card sx={{ mb: 3 }}>
                    <CardActionArea onClick={() => {
                        handleClickOpen();
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                py: 4.5,
                                bgcolor,
                                // 这个是根据背景色改变字体颜色的, 防止字看不清
                                color: darkColorText ? 'grey.800' : '#ffffff',
                                paddingBottom: '28px'
                            }}
                        ><Typography variant="subtitle1" color="inherit">
                                <IconPlus />
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            </>
        )
    };

    const DeleteModeButton = ({ title, icon }) => (
        <Tooltip title={title || 'Edit'} placement="left">
            <IconButton
                aria-label={title || 'Edit'}
                color={isDeleteMode ? 'error' : 'primary'}
                size="medium"
                sx={{
                    color: isDeleteMode ? 'error' : 'primary',
                    border: '2px solid',
                    borderColor: isDeleteMode ? 'error' : 'primary',
                    borderRadius: 8,
                }}
                onClick={() => { setDeleteMode(!isDeleteMode); }}>
                {icon}
                <Typography variant="subtitle1" color="inherit">
                    {isDeleteMode && 'Click on an item to delete it'}
                </Typography>
            </IconButton>
        </Tooltip >
    );

    const EditAppButton = ({ title, icon, app }) => {
        const dialogTitle = `New App`;
        const [open, setOpen] = useState(false);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
            setDialogClosed(!isDialogClosed);
        };

        return (
            <>
                <Dialog
                    fullWidth
                    maxWidth='sm'
                    open={!isDeleteMode && open}
                    onClose={handleClose}>
                    <DialogContent>
                        <AppForm title={dialogTitle} setOpen={setOpen} setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} app={app} isEdit />
                    </DialogContent>
                </Dialog>
                <Tooltip title={title || 'Edit'} placement="left">
                    <IconButton
                        aria-label={title || 'Edit'}
                        size="medium"
                        onClick={handleClickOpen}>
                        {icon}
                    </IconButton>
                </Tooltip >
            </>
        );
    }


    const makeGridForSub = (subscription) => (
        <Grid key={subscription.id} item xs={12} sm={6} md={4} lg={3}>
            {/* 上面的xs等等都是Breakpoints, 意思是在不同的情况下,一个box占的屏幕比例是不一样的 比如在小屏幕时, 一个box会占满整个屏幕, 而在大屏幕的的时候, 一个box只占用屏幕的2/12=六分之一 */}
            <SubBox
                // {...subscription}
                subscription={subscription}
                key={subscription.id}
            />
        </Grid>
    )

    const makeGridForApp = (app, subscriptions) => (
        <Grid key={app.id} item xs={12}>
            <SubCard key={app.id} title={app.name} secondary={<EditAppButton app={app} title='Edit this app' icon={<IconEdit />} />}>
                <Grid key={app.id} container spacing={gridSpacing}>
                    {subscriptions.map(makeGridForSub)}
                    <Grid key="New" item xs={12} sm={6} md={4} lg={3}>
                        <NewSubscription app={app} />
                    </Grid>
                </Grid>
            </SubCard>
        </Grid>
    )



    return isLoading ? (
        <MainCard >
            <Stack alignItems="center">
                <CircularProgress color="secondary" />
            </Stack>
        </MainCard>
    ) : (
        <MainCard
            title="Subscriptions"
            secondary={<DeleteModeButton title='Delete Subscriptions' icon={<IconTrash />} />}
        >
            <Grid container spacing={gridSpacing}>
                {
                    apps.map((app) => (makeGridForApp(app, subscriptions[app.id])))
                }
                <Grid key='NewApp' item xs={12}>
                    <NewApp />
                </Grid>
            </Grid>
        </MainCard>
    );

};

export default Subscriptions;