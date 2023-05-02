import React, { useEffect, useState } from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './component/home/home';
import Secrect from './component/secrect/secrect';
import Login from './component/login/login';
// import QrCode from './component/qrCode/qrCode';
import Chat from './component/chat/chat';
import Room from './component/room/room';
// import Verify from './component/register/verify';
import Register from './component/register/register';
// const initialState = { name: '', description: '' }
const App = () => {
  return (

    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/secrect" element={<Secrect />} />
        <Route exact path="/login" element={<Login />} />
        {/* <Route exact path="/in2room" element={ } /> */}
        {/* <Route exact path='/qrCode' element={<QrCode />} /> */}
        <Route exact path='/chat' element={<Chat />} />
        <Route exact path='/room' element={<Room />} />
        {/* <Route exact path='/verify' element={<Verify />} /> */}
        <Route exact path='/register' element={<Register />} />
      </Routes>
    </Router >

  );
}

export default App;
