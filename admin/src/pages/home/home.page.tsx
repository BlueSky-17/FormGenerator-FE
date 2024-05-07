import React, { useState, ReactNode } from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import { Link, useNavigate } from 'react-router-dom';
import Popover from '@mui/material/Popover';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import ArticleIcon from '@mui/icons-material/Article';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import avatarimage from "../../assets/avatar.jpg"
import logodrawer from "../../assets/logo.png"
// import TempDrawer from './TempDrawer'

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

export const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

//Setting for Drawer
const drawerWidth = 300;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));
interface LayoutProps {
    children: ReactNode;
}

function HomePage({ children }: LayoutProps) {

    const tokenString = localStorage.getItem('token')
    const userToken = JSON.parse(tokenString as string);

    // if (localStorage.getItem('token')) {
    //     const tokenString = localStorage.getItem('token')

    //     if (tokenString) {
    //         const userToken = JSON.parse(tokenString as string);
    //         console.log(userToken)
    //     }
    // }
    // JSON.parse(localStorage.getItem('token'))

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const open_avatar = Boolean(anchorEl);
    const id = open_avatar ? 'simple-popover' : undefined;

    const navigate: any = useNavigate();

    const handleLogout = () => {
        // Clear the token from localStorage or perform any other logout actions
        localStorage.removeItem('token');

        // Redirect the user to the login page (you can change the path)
        navigate('/signin');
    }

    const navSideBar = (path: string) => (e: any) => {
        navigate(path);
    }

    return (
        <Box sx={{ display: 'flex', witdh: '100vw' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar sx={{ backgroundColor: 'white' }}>
                    <IconButton
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, color: '#364F6B', ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ marginRight: '15px' }}>
                        <Typography sx={{ fontWeight: 700, color: '#364F6B' }} variant="subtitle1" color="black" noWrap component="div">
                            {userToken.user.FirstName} {userToken.user.LastName}
                        </Typography>
                    </Box>

                    <IconButton size='small' aria-describedby={id} onClick={handleClick}>
                        {userToken.user.AvatarPath ?
                            <img style={{ borderRadius: '100%', height: '45px' }} alt='Avatar' src={userToken.user.AvatarPath} referrerPolicy="no-referrer" /> :
                            <img style={{ borderRadius: '100%', height: '45px' }} alt='Avatar' src={avatarimage} referrerPolicy="no-referrer" />}
                    </IconButton>
                    <Popover
                        id={id}
                        open={open_avatar}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <Button
                            onClick={handleLogout}
                            sx={{ p: 2, fontWeight: 500, color: 'black' }}
                        >
                            Đăng xuất
                        </Button>
                    </Popover>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: "#364F6B", height: '100%' }}>
                    <DrawerHeader sx={{ backgroundColor: '#364F6B' }}>
                        <Box sx={{ backgroundColor: '#364F6B', width: "100%", display: "grid", justifyItems: 'center', paddingTop: '4px' }}>
                            <Link to="/">
                                <img src={logodrawer} alt="no_img" height={55} />
                            </Link>
                        </Box>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{ color: 'white' }} /> : <ChevronRightIcon sx={{ color: 'white' }} />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {[{ id: 1, text: 'Quản lý người dùng', path: '/' }].map((item) => (
                            <ListItem key={item.id} onClick={navSideBar(item.path)} sx={{ paddingY: '5px' }} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon sx={{ marginLeft: '25px' }}>
                                        {item.id === 1 ? <PeopleAltIcon sx={{ color: 'white' }} /> : ''}
                                        {/* {item.id === 2 ? <ArticleIcon sx={{ color: 'white' }} /> : ''}
                                        {item.id === 3 ? <HistoryIcon sx={{ color: 'white' }} /> : ''} */}
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={{ fontWeight: 400, fontSize: '1.1rem', color: 'white' }}>
                                            {item.text}
                                        </Typography>
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer >

            <Main sx={{display:'flex', backgroundColor: '#EBEBEB', height:'100dvh' }} open={open}>
                {children}
            </Main>
        </Box >
    );
}

export default HomePage;
