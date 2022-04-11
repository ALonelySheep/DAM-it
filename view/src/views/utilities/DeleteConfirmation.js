// material-ui
import {
    Box,
    Button,
    CircularProgress,
    FormHelperText,
    Grid,
    Typography,
} from '@mui/material';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useState, useEffect } from 'react';
// ======================|| New Subscription Form ||======================== //

const DeleteConfirmation = ({ target, setOpen, setLoading, isDialogClosed, setDialogClosed, API }) => {
    // const theme = useTheme();
    const [isSubmitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({ submit: false });
    const [status, setStatus] = useState({ success: false });
    // console.log(API)
    // console.log(target)
    useEffect(() => () => {
        setSubmitting({});
        setErrors({});
        setStatus({});
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // console.log(target.id);
            const response = await API(target.id);
            console.log(response)
            setOpen(false)
            setStatus({ success: true });
            setSubmitting(false);
            setDialogClosed(!isDialogClosed)
        } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    }

    return (
        <>
            {/* title */}
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
        </>
    );
};

export default DeleteConfirmation;