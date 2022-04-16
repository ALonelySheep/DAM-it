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

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { addPaidContent, updatePaidContent } from 'api/paidContentAPI';
import { useAuth } from 'AuthProvider'

// ======================|| New PaidContent Form ||======================== //

const PaidContentForm = ({ title, setOpen, setLoading, isDialogClosed, setDialogClosed, isEdit, paidContent, appid }) => {
    const theme = useTheme();
    // Authentication
    const auth = useAuth();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const monetaryUnitList = [
        'CNY', 'USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CAD', 'NZD', 'MOP', 'HKD', 'TWD', 'KRW', 'RUB']

    const buttonText = isEdit ? 'Update' : 'Add';

    if (isEdit) {
        paidContent.submit = null;
        paidContent.monetaryUnit = paidContent.monetaryunit;
    }

    const initialValues = isEdit ? paidContent :
        {
            name: '',
            price: 0,
            monetaryUnit: 'CNY',
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
                    price: Yup.number().min(0, "Price can't be negative").lessThan(10000, "Price can't be that high").required(),
                    name: Yup.string().max(255).required('Name is required'),
                    monetaryUnit: Yup.string().required('Monetary unit is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    // e.preventDefault();
                    try {
                        console.log("Form values");
                        console.log(values);
                        let response;
                        if (isEdit) {
                            response = await updatePaidContent(auth.userInfo.token,values);
                        } else {
                            values.appid = appid
                            response = await addPaidContent(auth.userInfo.token,values);
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
                                        id="outlined-adornment-app-name"
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
                                    error={Boolean(touched.price && errors.price)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-price">Price</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-price"
                                        type="number"
                                        value={values.price ?? 0}
                                        name="price"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.price && errors.price && (
                                        <FormHelperText error id="standard-weight-helper-text--price">
                                            {errors.price}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {/* Monetary Unit */}
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    sx={{
                                        marginTop: 1,
                                        marginBottom: 1,
                                        padding: '0 !important',
                                    }}
                                >
                                    <InputLabel id="monetary-unit-select-label">Monetary Unit</InputLabel>
                                    <Select
                                        labelId="monetary-unit-select-label"
                                        id="monetary-unit-select"
                                        name="monetaryUnit"
                                        label="Monetary Unit"
                                        value={values.monetaryUnit ?? ''}
                                        onChange={handleChange}
                                    >
                                        {monetaryUnitList.map((item) => (
                                            <MenuItem
                                                key={item}
                                                value={item ?? ''}
                                            >{item}</MenuItem>
                                        ))}
                                    </Select>
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

export default PaidContentForm;