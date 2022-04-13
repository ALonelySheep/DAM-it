// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    CircularProgress,
    // Checkbox,
    // FormControlLabel,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Typography,
    useMediaQuery,
    MenuItem,
    Select,
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useAuth } from 'AuthProvider'
// project imports
// import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { addDevice, updateDevice, deleteDevice } from 'api/deviceAPI';
// ======================|| New Device Form ||======================== //

const DeviceForm = ({ title, setOpen, setLoading, isDialogClosed, setDialogClosed, isEdit, device }) => {
    const theme = useTheme();
    // const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    // Authentication
    const auth = useAuth();
    const buttonText = isEdit ? 'Update' : 'Add';

    if (isEdit) {
        device.submit = null;
        device.isDelete = false;
    }
    // console.log('isEdit', isEdit)

    const initialValues = isEdit ? device :
        {
            name: '',
            model: '',
            storage: 256,
            submit: null,
            isDelete: false,
        }

    return (
        <>
            {/* title */}
            <Grid item xs={12} container alignItems="center" justifyContent="center">
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h3">{title}</Typography>
                </Box>
            </Grid>

            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(255).required('Name is required'),
                    storage: Yup.number().min(0, "Storage can't be negative").lessThan(10000, "Price can't be that high").required(),
                    model: Yup.string().max(40, "Model can't be that long"),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    // e.preventDefault();
                    try {
                        // console.log("Form values");
                        // console.log(values);
                        // console.log("is Delete");
                        // console.log(values.isDelete);
                        let response;
                        if (isEdit) {
                            if (values.isDelete)
                                response = await deleteDevice(auth.userInfo.token, values.id);
                            else
                                response = await updateDevice(auth.userInfo.token, values);
                        } else {
                            response = await addDevice(auth.userInfo.token, values);
                        }
                        console.log("response from server")
                        console.log(response)
                        setOpen(false)
                        setSubmitting(false);
                        setStatus({ success: true });
                        setDialogClosed(!isDialogClosed) // 这个一定要放在最后！！！！ 关闭之后马上就开始useEffect了，而在useEffect里面的动作开始之前，必须Form要unMount，否则会冲突。
                        setLoading(true)
                    } catch (err) {
                        console.error(err);
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                    <form noValidate >
                        {/* Name */}
                        {/* {console.log(values)} */}
                        <Grid container>
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.name && errors.name)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-device-name"
                                        type="text"
                                        value={values.name ?? ''}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text--name">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={matchDownSM ? 0 : 3}>
                            {/* Model */}
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel id="model-select-label">Model</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-mdoel"
                                        type="text"
                                        value={values.model ?? 0}
                                        name="model"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.model && errors.model && (
                                        <FormHelperText error id="standard-weight-helper-text--mdoel">
                                            {errors.model}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Storage */}

                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.storage && errors.storage)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-storage">Storage (GB)</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-storage"
                                        type="number"
                                        value={values.storage ?? 0}
                                        name="storage"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.storage && errors.storage && (
                                        <FormHelperText error id="standard-weight-helper-text--storage">
                                            {errors.storage}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                        </Grid>


                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    value="submit"
                                    onClick={(e) => {
                                        setFieldValue('isDelete', false)
                                        handleSubmit(e);
                                    }}
                                >
                                    {/* Add */}
                                    {isSubmitting ? <CircularProgress color="inherit" /> : buttonText}
                                </Button>
                            </AnimateButton>
                        </Box>
                        {isEdit && <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="error"
                                    onClick={(e) => {
                                        setFieldValue('isDelete', true)
                                        handleSubmit(e);
                                    }}
                                >
                                    {/* Add */}
                                    {isSubmitting ? <CircularProgress color="inherit" /> : 'Delete'}
                                </Button>
                            </AnimateButton>
                        </Box>}
                    </form>

                )}
            </Formik>
        </>
    );
};

export default DeviceForm;