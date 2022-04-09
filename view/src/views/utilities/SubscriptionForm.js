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
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker } from 'formik-mui-lab';

import { addSubscription, updateSubscription } from 'api/subscriptionAPI';
// ======================|| New Subscription Form ||======================== //

const SubscriptionForm = ({ title, setOpen, isDialogClosed, setDialogClosed, isEdit, subscription, appid}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const monetaryUnitList = [
        'CNY', 'USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CAD', 'NZD', 'MOP', 'HKD', 'TWD', 'KRW', 'RUB']
    const timeUnitList = ['Day', 'Week', 'Month', 'Year']; // 'Quarter'

    const buttonText = isEdit ? 'Update' : 'Add';

    if (isEdit) {
        // format subscription for editing
        subscription.submit = null;
        const raw = subscription.billingCycleUnit;
        // ? Capitalize first letter
        subscription.billingCycleUnit = raw.charAt(0).toUpperCase() + raw.slice(1);
        // ? Capitalize first letter & remove 's'
        // subscription.billingCycleUnit = raw.charAt(0).toUpperCase() + raw.slice(1, raw.slice(raw.length - 1, raw.length) === 's' ? raw.length - 1 : raw.length);
    }

    const initialValues = isEdit ? subscription :
        {
            name: '',
            price: 0,
            monetaryUnit: 'CNY',
            startDate: new Date(),
            billingCycle: 1,
            billingCycleUnit: 'Months',
            autoRenewal: true,
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
                    billingCycle: Yup.number().integer("Must be a integer").moreThan(0, "You can't reverse time").lessThan(100, "Please change your time unit").required(),
                    name: Yup.string().max(255).required('Name is required'),
                    monetaryUnit: Yup.string().required('Monetary unit is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        console.log(values);
                        let response;
                        if (isEdit) {
                            response = await updateSubscription(values); 
                        } else {
                            values.appid = appid
                            response = await addSubscription(values);
                        }
                        console.log(response)
                        setOpen(false)
                        setDialogClosed(!isDialogClosed)
                        // if (scriptedRef.current) {
                        setStatus({ success: true });
                        setSubmitting(false);
                        // }
                    } catch (err) {
                        console.error(err);
                        // if (scriptedRef.current) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                        // }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <form noValidate onSubmit={handleSubmit}>
                            {/* Name */}
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
                                            value={values.name}
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
                                            value={values.price}
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
                                            value={values.monetaryUnit}
                                            onChange={handleChange}
                                        >
                                            {monetaryUnitList.map((item) => (
                                                <MenuItem
                                                    key={item}
                                                    value={item}
                                                >{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Duration and Cycle */}
                            <Grid container
                                spacing={matchDownSM ? 3 : 1}
                                alignItems="center" justifyContent="space-between">
                                <Grid item xs={6} sm={4}>
                                    <FormControl
                                        fullWidth
                                        error={Boolean(touched.startDate && errors.startDate)}
                                        sx={{
                                            marginTop: 1,
                                            marginBottom: 1,
                                            padding: '0 !important',
                                        }}
                                    >
                                        <Field component={DatePicker} name="startDate" label="Satrt Date"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm>
                                    <Typography variant="h5" align='center' >
                                        Billed Every &nbsp;
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <FormControl
                                        fullWidth
                                        error={Boolean(touched.billingCycle && errors.billingCycle)}
                                    >
                                        <OutlinedInput
                                            id="outlined-adornment-billingCycle"
                                            type="number"
                                            value={values.billingCycle}
                                            name="billingCycle"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            inputProps={{}}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <FormControl
                                        fullWidth
                                        sx={{
                                            marginTop: 1,
                                            marginBottom: 1,
                                            padding: '0 !important',
                                        }}
                                    >
                                        <InputLabel id="billing-cycle-unit-select-label">Time Unit</InputLabel>
                                        <Select
                                            labelId="billing-cycle-unit-select-label"
                                            id="billing-cycle-unit-select"
                                            name="billingCycleUnit"
                                            label="Time Unit"
                                            value={values.billingCycleUnit}
                                            onChange={handleChange}
                                        >
                                            {timeUnitList.map((item) => (
                                                <MenuItem
                                                    key={item}
                                                    value={`${item}s`}
                                                >{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {touched.billingCycle && errors.billingCycle && (
                                <FormHelperText error id="standard-weight-helper-text--billing-cycle">
                                    {errors.billingCycle}
                                </FormHelperText>
                            )}
                            {/* Auto-renew */}
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.autoRenewal}
                                                onChange={handleChange}
                                                name="autoRenewal"
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <Typography variant="subtitle1">
                                                Auto-renew
                                            </Typography>
                                        }
                                    />
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
                    </LocalizationProvider>
                )}
            </Formik>
        </>
    );
};

export default SubscriptionForm;