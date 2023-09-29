import React, { useState } from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import { Link } from 'react-router-dom';
import Popover from '@mui/material/Popover';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
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
import "./home.style.css";

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

type ParentComponentProps = {
    pageComponent: React.ComponentType;
};

function HomePage({ pageComponent: PageComponent }: ParentComponentProps): JSX.Element {

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open_avatar = Boolean(anchorEl);
    const id = open_avatar ? 'simple-popover' : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
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

                    <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: '5px' }}>
                        <Typography sx={{ fontWeight: 500 }} variant="subtitle1" color="black" noWrap component="div">
                            Thành Đặng
                        </Typography>
                        <Typography sx={{ fontWeight: 'bold', color: '#364F6B' }} variant="body2" noWrap component="div">
                            Khoa Khoa học và Kỹ thuật Máy tính
                        </Typography>
                    </Box>

                    <IconButton sx={{ paddingRight: '15px' }}>
                        <Badge badgeContent={4} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton aria-describedby={id} onClick={handleClick}>
                        <Avatar src={avatarimage} />
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
                        <Typography sx={{ p: 2, fontWeight: 500 }}>Thông tin cá nhân</Typography>
                        <Divider />
                        <Typography sx={{ p: 2, fontWeight: 500  }}>Đăng xuất</Typography>
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
                        {/* <Typography sx={{ color: 'white', marginRight: '40px' }} variant="h5" noWrap component="div">
                            My  Logo
                        </Typography> */}
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{ color: 'white' }} /> : <ChevronRightIcon sx={{ color: 'white' }} />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {[{ id: 1, text: 'Trang chủ', path: '/' }, { id: 2, text: 'Thông tin cá nhân', path: '/' }, { id: 3, text: 'Forms của tôi', path: '/' }].map((item) => (
                            <Link key={item.text} to={item.path}>
                                <ListItem sx={{ paddingY: '5px' }} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ marginLeft: '25px' }}>
                                            {item.id === 1 ? <HomeIcon sx={{ color: 'white' }} /> : ''}
                                            {item.id === 2 ? <InfoIcon sx={{ color: 'white' }} /> : ''}
                                            {item.id === 3 ? <ArticleIcon sx={{ color: 'white' }} /> : ''}
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Typography sx={{ fontWeight: 400, fontSize: '1.1rem', color: 'white' }}>
                                                {item.text}
                                            </Typography>
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                    <Divider />

                    <Box sx={{ flexGrow: 1 }} />

                    <List sx={{ backgroundColor: '#364F6B', alignItems: 'center', display: 'flex', justifyContent: 'center' }} >
                        <Button sx={{
                            color: '#364F6B',
                            backgroundColor: 'white',
                            border: '2px solid #364F6B',
                            borderRadius: '10px',
                            margin: '20px',
                            paddingX: '45px',
                            '&:hover': {
                                backgroundColor: 'white', // Màu nền thay đổi khi hover
                                color: '#364F6B'
                            },
                        }}>
                            <LogoutIcon sx={{ paddingRight: '5px' }} />
                            Đăng xuất
                        </Button>
                    </List>
                </Box>
            </Drawer >

            <Main sx={{ backgroundColor: '#EBEBEB' }} open={open}>
                <PageComponent />
            </Main>
        </Box >
    );
}

export default HomePage;
