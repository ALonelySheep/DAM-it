import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    MenuItem,
    Select
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
// import { strengthColor, strengthIndicator } from 'utils/password-strength';



// ======================|| New Subscription Form ||======================== //

// const SubscriptionForm = ({ ...others }) => {
const SubscriptionForm = ({ data }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [checked, setChecked] = useState(true);
    const monetaryUnitList = [
        'CNY', 'USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CAD', 'NZD', 'MOP', 'HKD', 'TWD', 'KRW', 'RUB']

    return (
        <>
            {/* title */}
            <Grid item xs={12} container alignItems="center" justifyContent="center">
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h3">New Subscription for {data.label}</Typography>
                </Box>
            </Grid>

            <Formik
                initialValues={{
                    name: '',
                    price: 0,
                    monetaryUnit: 'CNY',
                    startDate: new Date(),
                    billingCycle: 1,
                    billingCycleUnit: 'MONTH',
                    autoRenewal: true,
                    remindBeforeRenewal: false,
                    description: null,
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    price: Yup.number().min(0, "Price can't be negative").lessThan(10000, "Price can't be that high").required(),
                    name: Yup.string().max(255).required('Name is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    // <form noValidate onSubmit={handleSubmit} {...others}>
                    <form noValidate onSubmit={handleSubmit}>
                        {/* <Grid container spacing={matchDownSM ? 0 : 2}> */}
                        <Grid container>
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.name && errors.name)}
                                    sx={{ ...theme.typography.customInput }}
                                >

                                    <InputLabel htmlFor="outlined-adornment-email-register">Name</InputLabel>
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
                                        <FormHelperText error id="standard-weight-helper-text--register">
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
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.price}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
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
                                        sx={{
                                            padding: '5px 14px 5px !important'
                                        }}
                                    >
                                        {monetaryUnitList.map((item) => (
                                            <MenuItem
                                            value={item}
                                            >{item}</MenuItem>
                                        ))}
                                        {/* <MenuItem value='CNY'>CNY</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem> */}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {/* Agree with  Terms & Condition. */}
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            Agree with &nbsp;
                                            <Typography variant="subtitle1" component={Link} to="#">
                                                Terms & Condition.
                                            </Typography>
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
                                    Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default SubscriptionForm;