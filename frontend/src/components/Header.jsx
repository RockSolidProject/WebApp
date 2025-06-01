import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, Box, IconButton, Container
} from '@mui/material';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("token") && localStorage.getItem("user");
    const user = isLoggedIn ? JSON.parse(localStorage.getItem("user")) : null;
    const image = user ? backendUrl + user.avatar : "";

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAnchorEl(null);
        navigate("/");
    }

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Container>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography
                            variant="h5"
                            component={Link}
                            to="/"
                            sx={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            PlezanjeSlovenija
                        </Typography>
                        <Button component={Link} to="/groups" color="black"   
                            sx={{
                                fontWeight: 550,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                px: 2,
                                borderRadius: 2,
                                backgroundColor: 'grey.200',
                                '&:hover': {
                                backgroundColor: 'grey.50', 
                                }
                        }}>
                            Skupine
                        </Button>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        {isLoggedIn ? (
                            <>
                                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                                    <Avatar src={image} alt={user.username} />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                                        Profil
                                    </MenuItem>
                                    <MenuItem onClick={() => { navigate("/userGroups"); handleMenuClose(); }}>
                                        Moje skupine
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Typography color="error">Odjava</Typography>
                                    </MenuItem>
                                </Menu>
                        </>
                        ) : (
                            <>
                                <Button component={Link} to="/login" variant="outlined" color="primary">
                                    Prijava
                                </Button>
                                <Button component={Link} to="/register" variant="contained" color="primary">
                                    Registracija
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
