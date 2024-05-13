import React, { useState, useEffect, useReducer, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
import { SearchIconWrapper, Search, StyledInputBase } from './searchBar';
import { modalStyle } from '../home.page';
import CircleButton from '../../../components/custom-button/circleButton';
import AcceptButton from '../../../components/custom-button/acceptButton';
import CancelButton from '../../../components/custom-button/cancelButton';
import LoadingPage from '../../../components/loading-page/loading';
import Error404 from '../../../components/error-page/404';
import SettingsIcon from '@mui/icons-material/Settings';
import EditModal from './editmodal';

function UserManage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    const [open, setOpen] = useState(false)
    const [selectID, setSelectID] = useState('')

    const handleOpenEditUser = (id: string) => {
        setOpen(true)
        setSelectID(id)
    }

    // Page Pagination
    const [currentPage, setCurrentPage] = React.useState<number | undefined>(1);
    function handleChangePagination(event: React.ChangeEvent<unknown>, value: number) {
        setCurrentPage(value);
    }

    //Search Input
    const [keyword, setKeyword] = React.useState("");

    //API GET: fetch forms by UserId
    useEffect(() => {
        fetch(process.env.REACT_APP_ROOT_URL + `user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken,
                'Role': JSON.parse(localStorage.getItem('token') as string)?.user.Role
            }
        })
            .then(response => {
                if (!response.ok) {
                    setLoading(false);
                    setNotFound(true);

                    console.log(response)
                    // throw new Error('Server returned ' + response.status);
                }
                return response.json();
            })
            .then(users => {
                setUsers(users);
                setLoading(false);
            })
    }, [])

    if (loading) {
        return <LoadingPage />
    }

    if (notFound) {
        return <Error404 />
    }

    console.log(users)

    return (
        <Box style={{ height: '100%', display: 'flex', width: '100%', paddingTop: '70px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', border: "2px solid #DEDEDE", height: '100%', width: '100%' }}>
                <Typography sx={{ color: '#364F6B', fontWeight: 600, padding: '10px', paddingLeft: '15px' }} variant="h6">
                    QUẢN LÝ NGƯỜI DÙNG
                </Typography>
                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', marginRight: '20px', paddingLeft: '15px' }}>
                    <Search sx={{ border: '2px solid #DEDEDE' }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            onChange={(e) => {
                                setKeyword(e.target.value)
                            }}
                            placeholder="Tìm kiếm…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />

                    <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}> Tổng số người dùng: <b style={{ fontSize: '24px' }}>{users.length}</b></Typography>

                    {/* <AcceptButton title='Tạo Biểu mẫu' onClick={openModalAdd} /> */}
                </Box>

                <Divider />
                <Box sx={{ height: '100%', backgroundColor:'blue', overflow:'hidden' }}>
                    <TableContainer sx={{ height: '100%', display: 'flex', overflowX: 'hidden', overflowY:'scroll' }} component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell sx={{ padding: 1, width: '5%', paddingLeft: 5, fontWeight: 800, fontSize: '1rem' }} align="left">STT</TableCell>
                                    <TableCell sx={{ padding: 1, width: '20%', fontWeight: 800, fontSize: '1rem' }} align="left">Tài khoản</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="left">Họ tên</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="center">Form sở hữu</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="center">Form đã điền</TableCell>
                                    <TableCell sx={{ padding: 1, width: '15%', fontWeight: 800, fontSize: '1rem' }} align="center">Tình trạng</TableCell>
                                    <TableCell sx={{ padding: 1, width: '15%', fontWeight: 800, fontSize: '1rem' }} align="center">Thao tác</TableCell>
                                </TableRow >
                            </TableHead>
                            <TableBody>
                                {users && users.map((user, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ padding: 1, paddingLeft: 5, fontWeight: 500, fontSize: '1.05rem' }} component="th" scope="row" align="left">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{user.UserName}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{user.FirstName} {user.LastName}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">15</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">8</TableCell>
                                        <TableCell sx={{ padding: 1 }} align="center">
                                            {!user.Disabled ?
                                                <Button sx={{
                                                    backgroundColor: '#176B87',
                                                    margin: '10px',
                                                }} disabled>
                                                    <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                        HOẠT ĐỘNG
                                                    </Typography>
                                                </Button>
                                                :
                                                <Button sx={{
                                                    backgroundColor: '#FF6969',
                                                    margin: '10px',
                                                }} disabled>
                                                    <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                        NGƯNG HOẠT ĐỘNG
                                                    </Typography>
                                                </Button>}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1 }} align="center">
                                            <CircleButton tooltip='Chỉnh sửa' onClick={(event) => handleOpenEditUser(user.ID)} children={<EditIcon />} />
                                            {!user.Disable ? <CircleButton tooltip='Vô hiệu hóa' onClick={() => { }} children={<VisibilityOffIcon />} /> :
                                                <CircleButton tooltip='Hồi phục' onClick={() => { }} children={<VisibilityIcon />} />
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                
                <EditModal
                    open={open}
                    setOpen={setOpen}
                    users={users}
                    selectID={selectID}
                // formDetail={formDetail}
                // updateObjectInDatabase={updateObjectInDatabase}
                // setRender={setRender}
                // render={render}
                />
            </Box>
        </Box>
    )
}

export default UserManage
