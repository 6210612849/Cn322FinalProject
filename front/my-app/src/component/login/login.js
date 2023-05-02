

import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [token, setToken] = useState(null);
    const [loginDisable, setLoginDisable] = useState(false)

    const messageError = (status, data) => {

        if (status) {
            toast.success('Login Success' + data, {
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

    const handleSubmit = async (event) => {

        event.preventDefault();
        setLoginDisable(true)


        console.log(token, email, password)
        // const response = await axios.post('http://localhost:5000/api/v1/user/register', formData);
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/user/login`, {
                password: password,
                email: email,
                token: token

            },
                {
                    "headers": {

                        "content-type": "application/json",

                    },
                },
            )
            console.log(res)
            messageError(true, "welcome")
            navigate('/room', { state: { token: res.data } });
        }
        catch (e) {
            console.log(e)
            setLoginDisable(false)
            messageError(false, e.response.data)

        }




        // axios
        //     .post('localhost:5000/api/v1/user/login', { email, password, token })
        //     .then((response) => {
        //         alert('Login successful');
        //         window.location.href = '/secret';
        //     })
        //     .catch((error) => {
        //         alert(error.response.data);
        //     });
    };

    return (
        <div>
            <ToastContainer />
            <h1>2FA Authentication Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="token">Token:</label>
                    <input type="text" id="token" name="token" value={token} onChange={(e) => setToken(e.target.value)} />
                </div>
                <button type="submit" disabled={loginDisable} >Login</button>
            </form>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        </div>
    );
}


export default Login;

