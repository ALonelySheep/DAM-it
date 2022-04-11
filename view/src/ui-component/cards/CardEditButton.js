// import PropTypes from 'prop-types';
// import { IconButton, Button, ButtonBase, Link, Tooltip, Typography } from '@mui/material';
// import { useState } from 'react';

// // ==============================|| CARD SECONDARY ACTION ||============================== //

// const CardEditButton = ({ title, icon, onClick }) => {
//     const [clicked, setClicked] = useState(false);

//     return (
//         <>
//             <Tooltip title={title || 'Edit'} placement="left">
//                 <IconButton
//                     aria-label={title || 'Edit'}
//                     color={clicked ? 'error' : 'primary'}
//                     size="medium"
//                     sx={{
//                         color: clicked ? 'error' : 'primary',
//                         border: '2px solid',
//                         borderColor: clicked ? 'error' : 'primary',
//                         borderRadius: 8,
//                     }}
//                     onClick={() => {
//                         onClick();
//                         setClicked(!clicked);
//                     }}>
//                     {icon}
//                     <Typography variant="subtitle1" color="inherit">
//                         {clicked && 'Editing'}
//                     </Typography>
//                 </IconButton>
//             </Tooltip >

//         </>
//     );
// };

// // CardEditButton.propTypes = {
// //     icon: PropTypes.node,
// //     title: PropTypes.string
// // };

// export default CardEditButton;
