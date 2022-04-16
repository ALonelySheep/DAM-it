// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://github.com/ALonelySheep" target="_blank" underline="hover">
            ALonelySheep
        </Typography>
    </Stack>
);

export default AuthFooter;
