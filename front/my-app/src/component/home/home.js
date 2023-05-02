// <!DOCTYPE html>
// <h1>This is home page</h1>

// <li><a href="/api/v1/user/register">Sign up!!</a></li>
// <li><a href="/api/v1/user/login">Login</a></li>
// <li><a href="/api/v1/user/logout">Logout</a></li>


import { Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import React, { useEffect, useState } from "react";



const Home = () => {



    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post("/api/v1/user/logout");
            console.log(response.data);
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleMenu}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                >
                    <MenuItem component={Link} to="/register">
                        Sign up!!
                    </MenuItem>
                    <MenuItem component={Link} to="/login">
                        Login
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My App
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
}
export default Home