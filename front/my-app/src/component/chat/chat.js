// import React, { useEffect, useState } from 'react'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import io from "socket.io-client";
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const socket = io("localhost:5000", { transports: ["websocket"] });
const Chat = () => {

    const location = useLocation();

    const myToken = location.state.token
    const roomID = location.state.roomID


    console.log(myToken)
    const [myEmail, setMyEmail] = useState('')
    const [roomMes, setRoomMes] = useState([])
    const [showMes, setShowMes] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [mesInput, setMesInput] = useState('')

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

    const handleInputChange = (event) => {
        event.preventDefault(0)
        setInputValue(event.target.value);
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
            messageError(true, "welcome" + res.data + "to room " + roomID)
            fetchChat(res.data)

        }
        catch (e) {
            console.log(e)
            messageError(false, e)
        }
    }
    const fetchChat = async (Mail) => {
        console.log('Fetching chat messages...');
        console.log(Mail)
        const myInput = {
            roomID: roomID,
            myEmail: Mail,
        };
        try {
            const queryParams = new URLSearchParams(myInput);

            const res = await axios.post(`http://localhost:5000/api/v1/mes/readmessageByRoom?` + queryParams.toString(), {

            },
                {
                    "headers": {

                        "content-type": "application/json",

                    },
                },
            )


            if (res.data != null) {
                setRoomMes(res)
                setShowMes(true)
            }
            console.log(res.data)


        }
        catch (e) {
            console.log(e)
        }
    };


    useEffect(() => {
        console.log('Connected to Socket.IO server');

        socket.on('connect', () => {
            socket.emit('join room', roomID);
            checkToken();
        });

        socket.on('message', (message) => {
            // setoomMes((prevChatMessages) => [...prevChatMessages, message]);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });


    }, []);

    const handleSubmit = (event) => {
        // console.log(event)
        event.preventDefault();
        // const message = event.target.elements.chatInput.value;
        // if (myEmail != null) {

        socket.emit('message', inputValue);
        sendChat(inputValue);
        // }

    };

    const sendChat = async (myPayload) => {
        console.log('Sending message to server...');

        try {
            const body = {
                roomID: roomID,
                payload: myPayload,
                writedBy: myEmail,
            };

            const queryParams = new URLSearchParams(body);

            const res = await axios.post(`http://localhost:5000/api/v1/mes/sendmessageByRoom?` + queryParams.toString(), {

            },
                {
                    "headers": {

                        "content-type": "application/json",

                    },
                },
            )
            console.log("yee", res)

        }
        catch (e) {
            console.log(e)
        }
    };



    return (
        <div>
            <script src="/socket.io/socket.io.js"></script>
            <ToastContainer />
            {/* <div id="chat-messages">
                {chatMessages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div> */}

            {showMes &&
                roomMes.data.map((mes) => {
                    return <h3><div key={mes.messageID} style={{ "textAlign": "center" }}>
                        <nav>
                            <h4>
                                {mes.payload}
                            </h4>

                            <h5>
                                writeBy :{mes.writedBy}
                            </h5>
                        </nav>
                    </div>
                    </h3>
                })}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chat;