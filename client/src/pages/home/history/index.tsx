import React, { useState, useEffect, useReducer, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography, TextField, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import COLORS from '../../../constants/colors';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { SearchIconWrapper, Search, StyledInputBase } from '../MyForms/searchBar';

import SearchIcon from '@mui/icons-material/Search';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function History() {
    const [history, setHistory] = useState<any>([])

    const GetHistoryAPI_URL = process.env.REACT_APP_ROOT_URL + `get-all-response/${JSON.parse(localStorage.getItem('token') as string)?.user.ID}`;

    useEffect(() => {
        fetch(GetHistoryAPI_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
            }
        })
            .then(data => data.json())
            .then(history => {
                setHistory(history);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Navigate when click edit form
    const navigate = useNavigate();
    const editForm = (id: string, typeView: string) => (event: any) => {
        navigate('/form/' + id, { state: typeView });
    };

    const goToDetail = (formID: string, id: string) => (e) => {
        navigate('/history/' + id, { state: formID });
    }

    return (
        <Box>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", paddingTop: '5px' }}>
                <Typography sx={{ color: '#364F6B', padding: '15px', fontWeight: 600 }} variant="h6" noWrap component="div">
                    LỊCH SỬ ĐIỀN FORM
                </Typography>
                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'center', padding: '5px', marginTop: '10px', marginBottom: '10px' }}>
                    <Search sx={{ border: '2px solid #DEDEDE' }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            onChange={(e) => {
                                // setKeyword(e.target.value)
                            }}
                            placeholder="Tìm kiếm…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    {/* <Box sx={{ flexGrow: 1 }} /> */}

                    {/* <AcceptButton title='Tạo Biểu mẫu' onClick={openModalAdd} /> */}
                </Box>

                <Divider />

                <Box sx={{ minHeight: 420 }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell sx={{ padding: 1, width: '5%', paddingLeft: 5, fontWeight: 800, fontSize: '1rem' }} align="left">STT</TableCell>
                                    <TableCell sx={{ padding: 1, width: '20%', fontWeight: 800, fontSize: '1rem' }} align="left">Tên biểu mẫu</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="center">Thời gian điền</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="center">Thao tác</TableCell>
                                </TableRow >
                            </TableHead>
                            <TableBody>
                                {history && history.map((form, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ padding: 1, paddingLeft: 5, fontWeight: 500, fontSize: '1.05rem' }} component="th" scope="row" align="left">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{form.FormName}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">{new Date(form.SubmitTime).toLocaleTimeString('vi-VN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })} {new Date(form.SubmitTime).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                        <TableCell sx={{ padding: 1 }} align="center">
                                            <Button
                                                onClick={goToDetail(form.FormID, form.id)}
                                                sx={{
                                                    backgroundColor: '#176B87',
                                                    margin: '10px',
                                                    '&:hover': {
                                                        backgroundColor: '#176B87',
                                                    },
                                                }}>
                                                <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                    Xem chi tiết
                                                </Typography>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    )
}

export default History
