// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Typography,
    useMediaQuery,
    MenuItem,
    Select,
    CircularProgress
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { useAuth } from 'AuthProvider'
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { addPersonalWork, updatePersonalWork } from 'api/personalWorkAPI';

// ======================|| New PersonalWork Form ||======================== //

const PersonalWorkForm = ({ title, setOpen, setLoading, isDialogClosed, setDialogClosed, isEdit, personalWork, deviceid }) => {
    const theme = useTheme();
    // Authentication
    const auth = useAuth();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
   
    const buttonText = isEdit ? 'Update' : 'Add';

    if (isEdit) {
        personalWork.submit = null;
    }

    const initialValues = isEdit ? personalWork :
        {
            name: '',
            copyright: '',
            category: '',
            submit: null
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
                    copyright: Yup.string().max(40, 'Copyright is too long'),
                    category: Yup.string().max(20, 'Category text is too long'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    // e.preventDefault();
                    try {
                        console.log("Form values");
                        console.log(values);
                        let response;
                        if (isEdit) {
                            response = await updatePersonalWork(auth.userInfo.token, values);
                        } else {
                            values.deviceid = deviceid
                            response = await addPersonalWork(auth.userInfo.token, values);
                        }
                        // console.log("response from server")
                        // console.log(response)
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
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (

                    <form noValidate onSubmit={handleSubmit}>
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

                        {/* Price */}
                        <Grid container spacing={matchDownSM ? 0 : 3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.copyright && errors.copyright)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-copyright">Copyright</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-copyright"
                                        type="text"
                                        value={values.copyright ?? 0}
                                        name="copyright"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.copyright && errors.copyright && (
                                        <FormHelperText error id="standard-weight-helper-text--copyright">
                                            {errors.copyright}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.category && errors.category)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-category">Category</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-category"
                                        type="text"
                                        value={values.category ?? 0}
                                        name="category"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.category && errors.category && (
                                        <FormHelperText error id="standard-weight-helper-text--category">
                                            {errors.category}
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
                                >
                                    {/* Add */}
                                    {isSubmitting ? <CircularProgress color="inherit" /> : buttonText}
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default PersonalWorkForm;