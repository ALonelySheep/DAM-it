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
import { deletePersonalWork, getAllPersonalWorks } from 'api/personalWorkAPI';
import { getAllDevices } from 'api/deviceAPI';

// =================|| Dialog Components ||================== //
import DeleteConfirmation from 'views/utilities/DeleteConfirmation';

const PersonalWorkForm = Loadable(lazy(() => import('views/utilities/PersonalWorkForm')));
const DeviceForm = Loadable(lazy(() => import('views/utilities/DeviceForm')));

// =====================|| Auxilary ||======================= //
const groupBy = (array, key) => array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
}, {}); // empty object is the initial value for result object

const preprocessData = (devices, subs) => {
    // Group Subs by Deviceid
    // console.log('preprocessing...')
    // console.log(subs);
    const subsGrouped = groupBy(subs, 'deviceid');
    for (let i = 0; i < devices.length; i += 1) {
        if (!subsGrouped[devices[i].id])
            subsGrouped[devices[i].id] = [];
    }
    return subsGrouped;
}

// ==============================|| Main Component ||=============================== //
//* Add dynamic category for personal work


const PersonalWorks = () => {
    // data
    const [devices, setDevices] = useState([]);
    const [personalWorks, setPersonalWorks] = useState([]);

    let personalWorksPerDevice
    let deviceList

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
            deviceList = await getAllDevices(auth.userInfo.token);
            personalWorksPerDevice = await getAllPersonalWorks(auth.userInfo.token)
            console.log("Raw Data From Backend：");
            console.log(personalWorksPerDevice);
            console.log(deviceList);

            // preprocess data(Group Subs by Deviceid)
            personalWorksPerDevice = preprocessData(deviceList, personalWorksPerDevice)

            console.log("Preprocessed data: ")
            console.log(personalWorksPerDevice);
            console.log(deviceList);

            // setPersonalWorks(personalWorksPerDevice)
            // setDevices(deviceList)

            // store data in state
            if (isMounted) {
                setDevices(prevState => Object.assign(prevState, deviceList));
                setPersonalWorks(prevState => Object.assign(prevState, personalWorksPerDevice));
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
                deviceList = await getAllDevices(auth.userInfo.token)
                personalWorksPerDevice = await getAllPersonalWorks(auth.userInfo.token)

                personalWorksPerDevice = preprocessData(deviceList, personalWorksPerDevice)

                // console.log("Preprocessed data: ")
                // console.log(deviceList);
                // console.log(personalWorksPerDevice);

                if (isMounted) {
                    setDevices(deviceList)
                    setPersonalWorks(personalWorksPerDevice)
                }
                // 下面的更新方式会导致显示更新延迟
                // setPersonalWorks(prevState => Object.assign(prevState, personalWorksPerDevice));
                // setDevices(prevState => Object.assign(prevState, deviceList));
                // setPersonalWorks(prevState => ({ ...prevState, ...personalWorksPerDevice }));
                // setDevices(prevState => ({ ...prevState, ...deviceList }));
                setLoading(false);
            }
        }
        fetchData();
        return () => { isMounted = false };
    }, [isDialogClosed]);


    const SubBox = ({ personalWork }) => {
        const [open, setOpen] = useState(false);
        const darkColorText = false;
        // Props
        const { name, copyright, category } = personalWork;
        const copyrightString = (copyright === null) ? 'Not Specified' : copyright;
        const categoryString = (category === null) ? 'Not Specified' : category;

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
                    // Dialog 调整大小的方式是允许fullwidth再设置maxwidth的大小
                    fullWidth
                    // fullScreen={fullScreen}
                    maxWidth='sm'
                    open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        {isDeleteMode ?
                            <DeleteConfirmation
                                target={personalWork}
                                setOpen={setOpen}
                                setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} API={deletePersonalWork} /> :
                            <PersonalWorkForm
                                title={name}
                                setOpen={setOpen}
                                setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} isEdit
                                personalWork={personalWork} />}
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
                                bgcolor: "orange.dark",
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
                    (copyrightString || categoryString) && (
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
                                    {copyrightString}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">{categoryString}</Typography>
                            </Grid>
                        </Grid>
                    )
                }
            </>
        )
    };

    const NewPersonalWork = (props) => {
        const { device } = props;

        const newSubTitle = `New Work in ${device.name}`;
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
        };

        return (
            <>
                <Dialog
                    fullWidth
                    maxWidth='sm'
                    open={!isDeleteMode && open}
                    onClose={handleClose}>
                    <DialogContent>
                        <PersonalWorkForm
                            title={newSubTitle}
                            setOpen={setOpen}
                            setLoading={setLoading}
                            setDialogClosed={setDialogClosed}
                            isDialogClosed={isDialogClosed}
                            isEdit={false}
                            deviceid={device.id} />
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

    const NewDevice = () => {
        const title = `New Device`;
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
                        <DeviceForm
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
                                // 这个是根据背景色改变字体颜色的, 防止字看不清
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

    const EditDeviceButton = ({ title, icon, device }) => {
        const dialogTitle = `New Device`;
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
                        <DeviceForm title={dialogTitle} setOpen={setOpen} setLoading={setLoading} setDialogClosed={setDialogClosed} isDialogClosed={isDialogClosed} device={device} isEdit />
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


    const makeGridForSub = (personalWork) => (
        <Grid key={personalWork.id} item xs={12} sm={6} md={4} >
            {/* 上面的xs等等都是Breakpoints, 意思是在不同的情况下,一个box占的屏幕比例是不一样的 比如在小屏幕时, 一个box会占满整个屏幕, 而在大屏幕的的时候, 一个box只占用屏幕的2/12=六分之一 */}
            <SubBox
                // {...personalWork}
                personalWork={personalWork}
                key={personalWork.id}
            />
        </Grid>
    )

    const makeGridForDevice = (device, personalWorks) => (
        <Grid key={device.id} item xs={12}>
            <SubCard key={device.id} title={device.name} secondary={<EditDeviceButton device={device} title='Edit this device' icon={<IconEdit />} />}>
                <Grid key={device.id} container spacing={gridSpacing}>
                    {personalWorks.map(makeGridForSub)}
                    <Grid key="New" item xs={12} sm={6} md={4}>
                        <NewPersonalWork device={device} />
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
            title="PersonalWorks"
            secondary={<DeleteModeButton title='Delete PersonalWorks' icon={<IconTrash />} />}
        >
            <Grid container spacing={gridSpacing}>
                {
                    devices.map((device) => (makeGridForDevice(device, personalWorks[device.id])))
                }
                <Grid key='NewDevice' item xs={12}>
                    <NewDevice />
                </Grid>
            </Grid>
        </MainCard>
    );

};

export default PersonalWorks;