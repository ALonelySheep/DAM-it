import { IconPlus, IconEdit, IconTrash } from '@tabler/icons';
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
} from '@mui/material';
import { useState, useEffect, lazy } from 'react';
import { useAuth } from 'AuthProvider'

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import Loadable from 'ui-component/Loadable';
import { gridSpacing } from 'store/constant';

// API
import { deletePaidContent, getAllPaidContents } from 'api/paidContentAPI';
import { getAllApps } from 'api/appAPI';

// =================|| Dialog Components ||================== //
import DeleteConfirmation from 'views/utilities/DeleteConfirmation';

const PaidContentForm = Loadable(lazy(() => import('views/utilities/PaidContentForm')));
const AppForm = Loadable(lazy(() => import('views/utilities/AppForm')));

// =====================|| Auxilary ||======================= //
const groupBy = (array, key) => array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
}, {}); // empty object is the initial value for result object

const preprocessData = (apps, PC) => {
    // Group Subs by Appid
    // console.log('preprocessing...')
    // console.log(subs);
    const PCGrouped = groupBy(PC, 'appid');
    for (let i = 0; i < apps.length; i += 1) {
        if (!PCGrouped[apps[i].appid])
            PCGrouped[apps[i].appid] = [];
    }
    return PCGrouped;
}

// ==============================|| Main Component ||=============================== //
//* Same as Subscription.js


const PaidContents = () => {
    // data
    const [apps, setApps] = useState([]);
    const [paidContents, setPaidContents] = useState([]);

    let paidContentsPerApp
    let appList

    // display state control
    const [isLoading, setLoading] = useState(true);
    const [isDialogClosed, setDialogClosed] = useState(false);
    const [isDeleteMode, setDeleteMode] = useState(false);
    // Authentication
    const auth = useAuth();

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            // console.log('I\'m only supposed to show at first render!');

            // Get data from backend
            appList = await getAllApps(auth.userInfo.token);
            paidContentsPerApp = await getAllPaidContents(auth.userInfo.token)
            console.log("Raw Data From Backend???");
            console.log(paidContentsPerApp);
            console.log(appList);

            // preprocess data(Group Subs by Appid)
            paidContentsPerApp = preprocessData(appList, paidContentsPerApp)

            console.log("Preprocessed data: ")
            console.log(paidContentsPerApp);
            console.log(appList);

            // setPaidContents(paidContentsPerApp)
            // setApps(appList)

            // store data in state
            if (isMounted) {
                setApps(prevState => Object.assign(prevState, appList));
                setPaidContents(prevState => Object.assign(prevState, paidContentsPerApp));
            }

            // finish loading
            setLoading(false);
        }
        fetchData();
        return () => { isMounted = false };
    }, []);
    // useEffect(() => { console.log('rerendered') })
    useEffect(() => {
        // console.log('I\'m supposed to show every time the dialog closes!');
        let isMounted = true;

        async function fetchData() {
            if (!isLoading) {
                appList = await getAllApps(auth.userInfo.token)
                paidContentsPerApp = await getAllPaidContents(auth.userInfo.token)

                paidContentsPerApp = preprocessData(appList, paidContentsPerApp)

                console.log("Preprocessed data: ")
                console.log(appList);
                console.log(paidContentsPerApp);

                if (isMounted) {
                    setApps(appList)
                    setPaidContents(paidContentsPerApp)
                }
                // ????????????????????????????????????????????????
                // setPaidContents(prevState => Object.assign(prevState, paidContentsPerApp));
                // setApps(prevState => Object.assign(prevState, appList));
                // setPaidContents(prevState => ({ ...prevState, ...paidContentsPerApp }));
                // setApps(prevState => ({ ...prevState, ...appList }));
                setLoading(false);
            }
        }
        fetchData();
        return () => { isMounted = false };
    }, [isDialogClosed]);


    const SubBox = ({ paidContent }) => {
        const [open, setOpen] = useState(false);
        const darkColorText = false;
        // Props
        const { name, price, monetaryunit } = paidContent;
        // Preprocessing: price
        const priceString = (Number(price) === 0) ? 'Free' : `${price} ${monetaryunit}`;

        // Auxilary functions
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
                    // Dialog ??????????????????????????????fullwidth?????????maxwidth?????????
                    fullWidth
                    maxWidth='sm'
                    open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        {isDeleteMode ?
                            <DeleteConfirmation
                                target={paidContent}
                                setOpen={setOpen}
                                setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} API={deletePaidContent} /> :
                            <PaidContentForm
                                title={name}
                                setOpen={setOpen}
                                setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} isEdit
                                paidContent={paidContent} />}
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
                                bgcolor: "secondary.main",
                                // ?????????????????????????????????????????????, ??????????????????
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
                    (priceString) && (
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
                                    {priceString}
                                </Typography>
                            </Grid>
                            {/* <Grid item>
                                <Typography variant="subtitle2">{billingCycleString}</Typography>
                            </Grid> */}
                        </Grid>
                    )
                }
            </>
        )
    };

    const NewPaidContent = (props) => {
        const { app } = props;

        const newPCTitle = `New PaidContent for ${app.name}`;
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
                    maxWidth='sm'
                    open={!isDeleteMode && open}
                    onClose={handleClose}>
                    <DialogContent>
                        <PaidContentForm
                            title={newPCTitle}
                            setOpen={setOpen}
                            setLoading={setLoading}
                            setDialogClosed={setDialogClosed}
                            isDialogClosed={isDialogClosed}
                            isEdit={false}
                            appid={app.appid} />
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
                                // ?????????????????????????????????????????????, ??????????????????
                                color: darkColorText ? 'grey.800' : '#ffffff',
                                paddingBottom: '28px'
                            }}
                        >
                            <Typography variant="subtitle1" color="inherit">
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
                    maxWidth='sm'
                    open={!isDeleteMode && open}
                    onClose={handleClose}>
                    <DialogContent>
                        <AppForm
                            title={title}
                            setOpen={setOpen}
                            setLoading={setLoading}
                            setDialogClosed={setDialogClosed}
                            isDialogClosed={isDialogClosed}
                            isEdit={false} />
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
                                // ?????????????????????????????????????????????, ??????????????????
                                color: darkColorText ? 'grey.800' : '#ffffff',
                                paddingBottom: '28px'
                            }}
                        >
                            <Typography variant="subtitle1" color="inherit">
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
        const dialogTitle = title||`New App`;
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


    const makeGridForSub = (paidContent) => (
        <Grid key={`${paidContent.id}-${paidContent.name}`} item xs={12} sm={6} md={4} lg={3}>
            {/* ?????????xs????????????Breakpoints, ??????????????????????????????,??????box????????????????????????????????? ?????????????????????, ??????box?????????????????????, ???????????????????????????, ??????box??????????????????2/12=???????????? */}
            <SubBox
                // {...paidContent}
                paidContent={paidContent}
                key={`${paidContent.id}-${paidContent.name}`}
            />
        </Grid>
    )

    const makeGridForApp = (app, paidContents) => (
        <Grid key={`${app.id}-${app.date}`} item xs={12}>
            <SubCard key={`${app.id}-${app.date}`} title={app.name} secondary={<EditAppButton app={app} title={`Edit ${app.name}`} icon={<IconEdit />} />}>
                <Grid key={`${app.id}-${app.date}`} container spacing={gridSpacing}>
                    {paidContents.map(makeGridForSub)}
                    <Grid key="New" item xs={12} sm={6} md={4} lg={3}>
                        <NewPaidContent app={app} />
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
            title="PaidContents"
            secondary={<DeleteModeButton title='Delete PaidContents' icon={<IconTrash />} />}
        >
            <Grid container spacing={gridSpacing}>
                {
                    apps.map((app) => (makeGridForApp(app, paidContents[app.appid])))
                }
                <Grid key='NewApp' item xs={12}>
                    <NewApp />
                </Grid>
            </Grid>
        </MainCard>
    );

};

export default PaidContents;