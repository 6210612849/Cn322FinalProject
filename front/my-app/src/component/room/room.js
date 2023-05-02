import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import { Container } from "@mui/material";
// const socket = io("localhost:5000", { transports: ["websocket"] });
const Room = () => {


    const navi = useNavigate()
    const location = useLocation();
    const myToken = location.state.token

    const [myEmail, setMyEmail] = useState('')

    const [myAllUser, setMyAllUser] = useState([])
    const [showUser, setShowUser] = useState(false)
    const messageError = (status, data) => {

        if (status) {
            toast.success(data, {
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

    const checkToken = async () => {
        try {
            console.log(myToken)


            const res = await axios.post(`http://localhost:5000/api/v1/user/checkToken`, {
                token: myToken
            },
                {
                    "headers": {

                        "content-type": "application/json",

                    },
                },
            )
            console.log(res)
            setMyEmail(res.data)
            messageError(true, "welcome" + res.data)
            fetchUser()

        }
        catch (e) {
            console.log(e)
            messageError(false, e)
        }
    }


    const fetchUser = async () => {


        try {
            const res = await axios.get(`http://localhost:5000/api/v1/chat/getalluser`, {
            },
                {
                    "headers": {

                        "content-type": "application/json",

                    },
                },
            ).then(async (data) => {
                console.log(data)
                await setMyAllUser(data)
                messageError(true, "fetch User complete",)
                setShowUser(true)
            })

        }
        catch (e) {
            console.log(e)
            messageError(false, e)
        }

    }

    useEffect(() => {
        if (myToken == null) {
            console.log("why")
            navi('/login')
        }
        else {
            checkToken()

        }
    }, [])


    // console.log("socket work")
    // socket.on("connect", () => {
    //     console.log("Connected to Socket.IO server");
    // });

    // socket.on("disconnect", () => {
    //     console.log("Disconnected from Socket.IO server");
    // });

    // socket.on("message", (data) => {
    //     setUserList((prevUserList) => [...prevUserList, data]);
    // });




    async function handleListItemClick(email) {
        const myInput = { email1: myEmail, email2: email };
        console.log("test", myInput)
        const queryParams = new URLSearchParams(myInput);
        try {


            const res = await axios.post(`http://localhost:5000/api/v1/chat/createchat?` + queryParams.toString(), {
            },
                {
                    "headers": {
                        "content-type": "application/json",
                    },
                },
            )
            navi('/chat', { state: { token: myToken, roomID: res.data } });
        }

        catch (e) {
            console.log(e)
        }

        // const rawResponse = await fetch(
        //     "http://localhost:5000/api/v1/chat/createchat?" + queryParams.toString(),
        //     {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     }
        // );

        // if (rawResponse.status == 200) {
        //     const test = await rawResponse.json();
        //     window.location.href = "/api/v1/chat/inroom?roomID=" + test.chatInviteID;
        // }
    }










    return (
        <div>
            <h1>
                My Room
            </h1>
            {/* <script src="/socket.io/socket.io.js"></script> */}
            <ToastContainer />
            <div id="messages">
                <Container>
                    {
                        showUser &&
                        myAllUser.data.map((user) => {
                            return <div key={user.email} onClick={() => handleListItemClick(user.email)}>
                                {user.name}
                            </div>
                        })}
                </Container>
            </div>
        </div>
    )

    // const [userList, setUserList] = useState(null);


    // async function fetchUser() {
    //     console.log("ayo");
    //     const response = await fetch("http://localhost:5000/api/v1/chat/getalluser");
    //     const data = await response.json();
    //     setUserList(data);
    // }

    // async function handleListItemClick(email) {
    //     const myInput = { email1: "test.singup@gmail.com", email2: email };
    //     const queryParams = new URLSearchParams(myInput);

    //     const rawResponse = await fetch(
    //         "http://localhost:5000/api/v1/chat/createchat?" + queryParams.toString(),
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         }
    //     );

    //     if (rawResponse.status == 200) {
    //         const test = await rawResponse.json();
    //         window.location.href = "/api/v1/chat/inroom?roomID=" + test.chatInviteID;
    //     }
    // }

    // return (
    //     <div>
    //         <h1>Socket.IO Example</h1>
    //         <div id="messages">
    //             {userList.map((user) => (
    //                 <div key={user.email} onClick={() => handleListItemClick(user.email)}>
    //                     {user.name}
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
}

export default Room;
