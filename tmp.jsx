// assets
const customization = useSelector((state) => state.customization);


import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/icons/social-google.svg';



const aa = () => {
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);
}

<>
    <Grid container direction="column" justifyContent="center" spacing={2}>
        {/* Button with image Example */}
        <Grid item xs={12}>
            <AnimateButton>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={googleHandler}
                    size="large"
                    sx={{
                        color: 'grey.700',
                        backgroundColor: theme.palette.grey[50],
                        borderColor: theme.palette.grey[100]
                    }}
                >
                    <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                        <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                    </Box>
                    Sign up with Google
                </Button>
            </AnimateButton>
        </Grid>
        <Grid item xs={12}>
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                <Button
                    variant="outlined"
                    sx={{
                        cursor: 'unset',
                        m: 2,
                        py: 0.5,
                        px: 7,
                        borderColor: `${theme.palette.grey[100]} !important`,
                        color: `${theme.palette.grey[900]}!important`,
                        fontWeight: 500,
                        borderRadius: `${customization.borderRadius}px`
                    }}
                    disableRipple
                    disabled
                >
                    OR
                </Button>
                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Sign up with Email address</Typography>
            </Box>
        </Grid>
    </Grid>


    <FormControl
        fullWidth
        error={Boolean(touched.password && errors.password)}
        sx={{ ...theme.typography.customInput }}
    >
        <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
        <OutlinedInput
            id="outlined-adornment-password-register"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            name="password"
            label="Password"
            onBlur={handleBlur}
            onChange={(e) => {
                handleChange(e);
                changePassword(e.target.value);
            }}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                    >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            }
            inputProps={{}}
        />
        {touched.password && errors.password && (
            <FormHelperText error id="standard-weight-helper-text-password-register">
                {errors.password}
            </FormHelperText>
        )}
    </FormControl>

    {
        strength !== 0 && (
            <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Box
                                style={{ backgroundColor: level?.color }}
                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" fontSize="0.75rem">
                                {level?.label}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </FormControl>
        )
    }

</>


















<Grid item xs={12} container alignItems="center" justifyContent="center">
<Box sx={{ mb: 2 }}>
    <Typography variant="h3">{`Do you want to delete ${target.name}?`}</Typography>
</Box>
</Grid>
<form noValidate onSubmit={handleSubmit}>
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
            color="error"
        >
            {/* Add */}
            {isSubmitting ? <CircularProgress color="inherit" /> : 'Delete'}
        </Button>
    </AnimateButton>
</Box>
</form>