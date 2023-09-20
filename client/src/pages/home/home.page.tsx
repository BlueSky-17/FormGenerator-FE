import React, { useState } from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';

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
import SearchIcon from '@mui/icons-material/Search';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import avatarimage from "../../assets/avatar.jpg"
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
const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

//Setting for Search Input
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function createData(
    name: string,
    owner: string,
    response: number,
    isOpen: boolean
) {
    return { name, owner, response, isOpen };
}

const rows = [
    createData('KHẢO SÁT CHẤT LƯỢNG SINH VIÊN K22', 'Tôi', 124, true),
    createData('KHẢO SÁT ỨNG DỤNG ĐẶT MÓN ĂN', 'Tôi', 15, false),
    createData('KHẢO SÁT ĐĂNG KÝ VỀ QUÊ NGHỈ LỄ 2/9', 'Tôi', 10, false),
    createData('KHẢO SÁT TỶ LỆ SINH VIÊN ĐI XE GẮN MÁY', 'Tôi', 5, false),
    createData('ĐÁNH GIÁ HỆ THỐNG QUẢN LÝ NHÂN VIÊN', 'Tôi', 14, false),
];

function HomePage() {

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    //Page Pagination
    const [itemsPerPage, setItemsPerPage] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setItemsPerPage(event.target.value);
    };

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
                        <Typography variant="subtitle1" color="black" noWrap component="div">
                            Thành Đặng
                        </Typography>
                        <Typography sx={{ color: '#364F6B' }} variant="body2" noWrap component="div">
                            Khoa Khoa học và Kỹ thuật Máy tính
                        </Typography>
                    </Box>

                    <IconButton sx={{ paddingRight: '15px' }}>
                        <Badge badgeContent={4} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton>
                        <Avatar src={avatarimage} />
                    </IconButton>
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
                        <Typography sx={{ color: 'white', marginRight: '40px' }} variant="h5" noWrap component="div">
                            My  Logo
                        </Typography>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{ color: 'white' }} /> : <ChevronRightIcon sx={{ color: 'white' }} />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {['Trang  chủ', 'Thông  tin cá nhân', 'Trang của tôi'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index === 0 ? <HomeIcon sx={{ color: 'white' }} /> : ''}
                                        {index === 1 ? <InfoIcon sx={{ color: 'white' }} /> : ''}
                                        {index === 2 ? <ArticleIcon sx={{ color: 'white' }} /> : ''}
                                    </ListItemIcon>
                                    <ListItemText sx={{ color: 'white' }} primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />

                    <Box sx={{ flexGrow: 1 }} />

                    <List sx={{ backgroundColor: '#364F6B', alignItems: 'center', display: 'flex', justifyContent: 'center' }} >
                        <Button>
                            <Typography sx={{ color: 'white' }} variant="body2" noWrap component="div">
                                Đăng xuất
                            </Typography>
                        </Button>
                    </List>
                </Box>
            </Drawer>

            <Main sx={{ backgroundColor: '#EBEBEB' }} open={open}>
                <DrawerHeader />
                <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE" }}>
                    <Typography sx={{ color: '#364F6B', padding: '15px' }} variant="h6" noWrap component="div">
                        FORMS CỦA TÔI
                    </Typography>
                    <Divider />

                    <Box sx={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                        <Search sx={{ border: '2px solid #DEDEDE' }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Tìm kiếm…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography>
                            Số lượng/Trang:
                        </Typography>
                        <FormControl sx={{ m: 2, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Số lượng</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={itemsPerPage}
                                label="ItemsPerPage"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                            </Select>
                        </FormControl>

                        <Button sx={{
                            backgroundColor: '#364F6B',
                            margin: '10px',
                            '&:hover': {
                                backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                            },
                        }}>
                            <Typography sx={{ color: 'white', paddingX: '10px', paddingY: '4px' }} variant="body2" noWrap component="div">
                                Thêm Form
                            </Typography>
                        </Button>
                    </Box>

                    <Divider />
                    <Box sx={{ margin: '15px' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">STT</TableCell>
                                        <TableCell align="center">Tên Form</TableCell>
                                        <TableCell align="center">Chủ sở hữu</TableCell>
                                        <TableCell align="center">Phản hồi</TableCell>
                                        <TableCell align="center">Chi tiết form</TableCell>
                                        <TableCell align="center">Tình trạng</TableCell>
                                    </TableRow >
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{row.owner}</TableCell>
                                            <TableCell align="center">{row.response}</TableCell>
                                            <TableCell align="center">
                                                <Button sx={{
                                                    backgroundColor: '#364F6B',
                                                    margin: '10px',
                                                    '&:hover': {
                                                        backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                    },
                                                }}>
                                                    <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                        Xem chi tiết
                                                    </Typography>
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.isOpen ?
                                                    <Button sx={{
                                                        backgroundColor: '#176B87',
                                                        margin: '10px',
                                                        '&:hover': {
                                                            backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                        },
                                                    }}>
                                                        <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                            Đang mở
                                                        </Typography>
                                                    </Button>
                                                    :
                                                    <Button sx={{
                                                        backgroundColor: '#FF6969',
                                                        margin: '10px',
                                                        '&:hover': {
                                                            backgroundColor: '#FF6969', // Màu nền thay đổi khi hover
                                                        },
                                                    }}>
                                                        <Typography sx={{ color: 'white', paddingX: '10px', paddingY: '4px' }} variant="body2" noWrap component="div">
                                                            Đã đóng
                                                        </Typography>
                                                    </Button>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Main>
        </Box >
    );
}

export default HomePage;
