import React, { useState, useEffect, useReducer, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useParams } from 'react-router-dom';
// import { initialState, actions, reducer, setName, setDescription, setModal } from '../../../reducers/formReducer'
// import { createForm, deleteForm } from '../../../apis/form';

//component đã được styled
// import { SearchIconWrapper, Search, StyledInputBase } from './searchBar';
import { modalStyle } from '../home.page';
import CircleButton from '../../../components/custom-button/circleButton';
import AcceptButton from '../../../components/custom-button/acceptButton';
import CancelButton from '../../../components/custom-button/cancelButton';
import LoadingPage from '../../../components/loading-page/loading';
import Error404 from '../../../components/error-page/404';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function UserManage() {
    const [forms, setForms] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    // Page Pagination
    const [currentPage, setCurrentPage] = React.useState<number | undefined>(1);
    function handleChangePagination(event: React.ChangeEvent<unknown>, value: number) {
        setCurrentPage(value);
    }

    //Search Input
    const [keyword, setKeyword] = React.useState("");

    //API GET: fetch forms by UserId
    useEffect(() => {
        fetch(`http://localhost:8080/forms/${JSON.parse(localStorage.getItem('token') as string)?.user.ID}?name=${keyword}&page=${currentPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
            }
        })
        .then(response => {
            if (!response.ok) {
                setLoading(false);
                setNotFound(true);
                // throw new Error('Server returned ' + response.status);
            }
            return response.json();
        })
            .then(forms => {
                setForms(forms);
                setLoading(false);
            })
    }, [currentPage, keyword])

    if (loading) {
        return <LoadingPage />
    }

    if (notFound) {
        return <Error404 />
    }

    return (
        <Box>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", paddingTop: '5px' }}>
                <Typography sx={{ color: '#364F6B', padding: '15px', fontWeight: 600 }} variant="h6" noWrap component="div">
                    QUẢN LÝ NGƯỜI DÙNG
                </Typography>
                <Divider />

                <Divider />
                <Box sx={{ minHeight: 420 }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell sx={{ padding: 1, width: '5%', paddingLeft: 5, fontWeight: 800, fontSize: '1rem' }} align="left">STT</TableCell>
                                    <TableCell sx={{ padding: 1, width: '20%', fontWeight: 800, fontSize: '1rem' }} align="left">Người dùng</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="center">Form sở hữu</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="center">Form đã điền</TableCell>
                                    <TableCell sx={{ padding: 1, width: '15%', fontWeight: 800, fontSize: '1rem' }} align="center">Tình trạng</TableCell>
                                    <TableCell sx={{ padding: 1, width: '15%', fontWeight: 800, fontSize: '1rem' }} align="center">Thao tác</TableCell>
                                </TableRow >
                            </TableHead>
                            <TableBody>
                                {forms && forms.map((form, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ padding: 1, paddingLeft: 5, fontWeight: 500, fontSize: '1.05rem' }} component="th" scope="row" align="left">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{form.name}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">
                                            {form.owner === JSON.parse(localStorage.getItem('token') as string)?.user.ID ? 'tôi' : 'tôi'}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">{form.AnswersCounter}</TableCell>
                                        <TableCell sx={{ padding: 1 }} align="center">
                                            {form.formState ?
                                                <Button sx={{
                                                    backgroundColor: '#176B87',
                                                    margin: '10px',
                                                }} disabled>
                                                    <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                        Đang mở
                                                    </Typography>
                                                </Button>
                                                :
                                                <Button sx={{
                                                    backgroundColor: '#FF6969',
                                                    margin: '10px',
                                                }} disabled>
                                                    <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                        Đã đóng
                                                    </Typography>
                                                </Button>}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1 }} align="center">
                                            {/* <CircleButton tooltip='Chỉnh sửa' onClick={editForm(form.id, "ViewEdit")} children={<EditIcon />} />

                                            <CircleButton tooltip='Xem phản hồi' onClick={editForm(form.id, "ViewResponses")} children={<VisibilityIcon />} />

                                            <CircleButton tooltip='Xóa biểu mẫu' onClick={openModalDelete(form.id)} children={<DeleteIcon />} /> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', m: 2 }}>
                    <Stack spacing={2}>
                        <Pagination count={5} page={currentPage} onChange={handleChangePagination} color="primary" />
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default UserManage
