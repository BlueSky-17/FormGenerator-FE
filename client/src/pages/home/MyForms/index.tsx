import React, { useState } from 'react'
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

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

function MyForms() {

    //Page Pagination
    const [itemsPerPage, setItemsPerPage] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setItemsPerPage(event.target.value);
    };

    return (
        <div>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE" }}>
                <Typography sx={{ color: '#364F6B', padding: '15px', fontWeight: 600 }} variant="h6" noWrap component="div">
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
                        <Typography sx={{ fontWeight: 500, color: 'white', paddingX: '10px', paddingY: '4px' }} variant="body2" noWrap component="div">
                            Thêm Form
                        </Typography>
                    </Button>
                </Box>

                <Divider />
                <Box sx={{ margin: '15px' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }} align="left">STT</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }} align="left">Tên Form</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }} align="center">Chủ sở hữu</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }} align="center">Phản hồi</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }} align="center">Chi tiết form</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '1rem' }} align="center">Tình trạng</TableCell>
                                </TableRow >
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ fontWeight: 500, fontSize: '1.05rem' }} component="th" scope="row" align="left">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 400, fontSize: '1.05rem' }} align="left">{row.name}</TableCell>
                                        <TableCell sx={{ fontWeight: 400, fontSize: '1.05rem' }} align="center">{row.owner}</TableCell>
                                        <TableCell sx={{ fontWeight: 400, fontSize: '1.05rem' }} align="center">{row.response}</TableCell>
                                        <TableCell align="center">
                                            <Link to="/detail">
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
                                            </Link>
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
        </div>
    )
}

export default MyForms
