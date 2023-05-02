// import { useState, forwardRef } from "react";
// import { Modal, Backdrop, Fade, makeStyles } from '@material-ui/core';





// const EmailVerificationModal = forwardRef((props, ref) => {




//     const useStyles = makeStyles((theme) => ({
//         modal: {
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//         },
//         paper: {
//             backgroundColor: theme.palette.background.paper,
//             boxShadow: theme.shadows[5],
//             padding: theme.spacing(2, 4, 3),
//         },
//     }));

//     const classes = useStyles();
//     const [open, setOpen] = useState(false);

//     const handleOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         // TODO: submit the form data using axios
//         handleClose();
//     };

//     return (
//         <>
//             <button type="button" onClick={handleOpen}>
//                 Verify Email
//             </button>
//             <Modal
//                 className={classes.modal}
//                 open={open}
//                 onClose={handleClose}
//                 closeAfterTransition
//                 BackdropComponent={Backdrop}
//                 BackdropProps={{
//                     timeout: 500,
//                 }}
//             >
//                 <Fade in={open}>
//                     <div className={classes.paper}>
//                         <h2>Email Verification</h2>
//                         <form onSubmit={handleSubmit}>
//                             <label htmlFor="email">Email:</label>
//                             <input type="email" id="email" name="email" required />
//                             <br />
//                             <label htmlFor="otp">OTP:</label>
//                             <input type="text" id="otp" name="otp" required />
//                             <br />
//                             <button type="submit">Verify Email</button>
//                         </form>
//                     </div>
//                 </Fade>
//             </Modal>
//         </>
//     );
// }
// )
// export default EmailVerificationModal;