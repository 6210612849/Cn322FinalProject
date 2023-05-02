

import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import QrCode from '../qrCode/qrCode';
import EmailVerificationModal from './verify';
import { Modal, Box, Typography, Container } from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './register.css'

const Register = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showData, setShowData] = useState(false);
    const [responseData, setResponseData] = useState("");
    const [notidata, setNotidata] = useState("")

    // const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [openQr, setOpenQr] = useState(false);

    const messageError = (status, data) => {

        if (status) {
            toast.success('Register success Success', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else {
            toast.warn(data, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            name: name,
            email: email,
            password: password
        };

        try {
            console.log(name, email, password)
            // const response = await axios.post('http://localhost:5000/api/v1/user/register', formData);
            axios.post(`http://localhost:5000/api/v1/user/register`, {
                name: name,
                email: email,
                password: password
            },
                {
                    "headers": {

                        "content-type": "application/json",

                    },
                },
            ).then((data) => {

                setResponseData(data.data);

            }).then(setOpenQr(true))




            // do something with the response data
        } catch (error) {
            console.error(error);
            // handle the error
        }
    }


    const handleSubmitVerify = async (e) => {
        e.preventDefault();


        try {
            console.log(name, email, password)
            // const response = await axios.post('http://localhost:5000/api/v1/user/register', formData);
            const res = await axios.post(`http://localhost:5000/api/v1/email_verification/verify`, {
                otp: otp,
                email: email,

            },
                {
                    "headers": {

                        "content-type": "application/json",

                    },
                },
            )
            // .then((data) => {
            //     setOpenQr(false)
            //     setNotidata(data.data);

            // }).then(() => {
            //     notify(notidata)
            // }
            // )
            console.log(res)
            setOpen(false)
            messageError(true, "Otp pass")

            navigate("/login");


            // do something with the response data
        } catch (error) {
            console.error(error);
            // handle the error
        }
    }



    const handleOpen = () => {
        setOpenQr(false);
        setOpen(true)
    };

    const handleQrClose = () => {
        setOpenQr(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlemodalSubmit = (event) => {
        event.preventDefault();
        // TODO: submit the form data using axios
        handleClose();
    };


    return (
        <div>
            <ToastContainer />

            <div>
                <h1> Sign up form </h1>
                <div>

                    {/* <Fade in={open}>
                    <div className={classes.paper}>
                        <h2>Email Verification</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" required />
                            <br />
                            <label htmlFor="otp">OTP:</label>
                            <input type="text" id="otp" name="otp" required />
                            <br />
                            <button type="submit">Verify Email</button>
                        </form>
                    </div>
                </Fade> */}

                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" value={name} placeholder="username" onChange={(e) => setName(e.target.value)} />
                    <input type="email" name="email" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" name="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Submit</button>
                    <div class="login-box">
                        <p>You have an account?</p>
                        <a href="/login">Login here</a>
                    </div>
                </form>











                {responseData && (
                    <Modal sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                        open={openQr}
                        onClose={handleQrClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >

                        <Box sx={{


                            justifyContent: 'center',
                            alignItems: 'center',

                            backgroundColor: 'white',



                        }}
                        >

                            <div style={{ "display": "flex", "justifyContent": "center", "alignItems": "center", "height": "auto" }}>
                                <img src={responseData} style={{ "display": "block", "maxWidth": "100%", "maxHeight": "100%" }} />
                                <div style={{ "marginRight": "20px" }}>
                                    <p>scan this qr code by google authenticatior app</p>
                                    <h5>if you done then verify your email</h5>
                                    <button onClick={handleOpen}>Next</button>
                                </div>



                            </div>
                        </Box>
                    </Modal>
                )
                }






                {/* <Button onClick={handleOpen}>Open modal</Button> */}
                <Modal sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >





                    <div style={{ "display": "inline-block" }}>

                        <form onSubmit={handleSubmitVerify}>

                            <h3 style={{ "textAlign": "center" }} >Email Verification</h3>

                            <label htmlFor="email">Email:</label>
                            {/* <input type="email" id="email" name="email" required  /> */}
                            {email}
                            <br />

                            <div>
                                <h2 style={{ "textAlign": "center" }}>
                                    OTP
                                </h2>
                                <input type="text" id="otp" name="otp" required onChange={(e) => setOtp(e.target.value)} />
                            </div>
                            <br />
                            <button type="submit">Verify Email</button>
                        </form>
                    </div>




                </Modal>

            </div >
        </div >
    )
}


{/* 

            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            > */}
{/* <Fade in={open}>
                        <div className={classes.paper}>
                            <h2>Email Verification</h2>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" required />
                                <br />
                                <label htmlFor="otp">OTP:</label>
                                <input type="text" id="otp" name="otp" required />
                                <br />
                                <button type="submit">Verify Email</button>
                            </form>
                        </div>
                    </Fade> */}











export default Register;

