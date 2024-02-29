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
import { initialState, actions, reducer, setName, setDescription, setModal } from '../../../reducers/formReducer'
import { createForm, deleteForm } from '../../../apis/form';

//component đã được styled
import { SearchIconWrapper, Search, StyledInputBase } from './searchBar';
import CircleButton from '../../../components/circleButton';
import AcceptButton from '../../../components/acceptButton';
import CancelButton from '../../../components/cancelButton';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

// Style cho modal edit
const style = {
    position: 'absolute' as 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

function MyForms() {
    const [forms, setForms] = useState<any[]>([])

    // Page Pagination
    const [currentPage, setCurrentPage] = React.useState<number | undefined>(1);
    function handleChangePagination(event: React.ChangeEvent<unknown>, value: number) {
        setCurrentPage(value);
    }

    //Search Input
    const [keyword, setKeyword] = React.useState("");

    //API GET: fetch forms by UserId
    useEffect(() => {
        fetch(`http://localhost:8080/forms/${JSON.parse(sessionStorage.getItem('token') as string)?.user.ID}?name=${keyword}&page=${currentPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            }
        })
            .then(data => data.json())
            .then(forms => {
                setForms(forms);
            })
    }, [currentPage, keyword])

    const handleCreateForm = async () => {
        // Close modal
        dispatch(setModal({ modal: '', isOpen: false }))

        // Call API POST to create a new form
        const dataFromServer = await createForm(
            {
                "name": name,
                "header": {
                    "title": name,
                    "description": description,
                    "imagePath": ""
                },
                "owner": JSON.parse(sessionStorage.getItem('token') as string)?.user.ID,
                "answersCounter": 0,
                "latestModified": "2023-10-14T12:34:56Z",
                "createDate": "2023-10-14T12:34:56Z",
                "closedDate": "2023-10-14T12:34:56Z",
                "Questions": [],
                "QuestionOrder": []
            }
        )

        navigate('/form/' + dataFromServer.newID, { state: 'ViewEdit' });

        // Return default value of Create Modal
        dispatch(setName(''));
        dispatch(setDescription(''));
    }

    const handleDeleteForm = async () => {
        // Close modal
        dispatch(setModal({ modal: '', isOpen: false }))

        setForms((prevData) => prevData.filter((item) => item.id !== formID))

        // Call API DELETE form by ID
        await deleteForm(formID);
    }

    // Modal ADD + DELETE Form
    const [state, dispatch] = useReducer(reducer, initialState);
    const { name, description, modal, isOpen } = state;
    const [formID, setFormID] = useState(''); // Get formID to delete form

    const openModalAdd = () => dispatch(setModal({ modal: 'add', isOpen: true }))
    const openModalDelete = (formID: string) => (e) => {
        dispatch(setModal({ modal: 'delete', isOpen: true }))
        setFormID(formID);
    }
    const handleCloseModal = () => dispatch(setModal({ modal: '', isOpen: false }))

    // Navigate when click edit form
    const navigate = useNavigate();
    const editForm = (id: string, typeView: string) => (event: any) => {
        navigate('/form/' + id, { state: typeView });
    };

    return (
        <Box>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", paddingTop: '5px' }}>
                <Typography sx={{ color: '#364F6B', padding: '15px', fontWeight: 600 }} variant="h6" noWrap component="div">
                    BIỂU MẪU CỦA TÔI
                </Typography>
                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
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

                    <AcceptButton title='Tạo Biểu mẫu' onClick={openModalAdd} />
                </Box>

                <Divider />
                <Box sx={{ minHeight: 420 }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell sx={{ padding: 1, width: '5%', paddingLeft: 5, fontWeight: 800, fontSize: '1rem' }} align="left">STT</TableCell>
                                    <TableCell sx={{ padding: 1, width: '20%', fontWeight: 800, fontSize: '1rem' }} align="left">Người biểu mẫu</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="center">Người sở hữu</TableCell>
                                    <TableCell sx={{ padding: 1, width: '10%', fontWeight: 800, fontSize: '1rem' }} align="center">Phản hồi</TableCell>
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
                                            {form.owner === JSON.parse(sessionStorage.getItem('token') as string)?.user.ID ? 'tôi' : 'tôi'}
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
                                            <CircleButton tooltip='Chỉnh sửa' onClick={editForm(form.id, "ViewEdit")} children={<EditIcon />} />

                                            <CircleButton tooltip='Xem phản hồi' onClick={editForm(form.id, "ViewResponses")} children={<VisibilityIcon />} />

                                            <CircleButton tooltip='Xóa biểu mẫu' onClick={openModalDelete(form.id)} children={<DeleteIcon />} />
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

            {/* Modal create form */}
            <Modal
                open={isOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    {
                        modal === 'add' ?
                            <Box sx={style}>
                                <Typography variant='h6' component="div">
                                    Vui lòng điền thông tin form
                                </Typography>

                                <Box component="form" sx={{ marginY: '10px', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant='subtitle1' component="div">
                                        <b>Tên form</b>
                                    </Typography>
                                    <TextField
                                        required
                                        value={name}
                                        onChange={e => { dispatch(setName(e.target.value)) }}
                                        sx={{ margin: '10px', width: '100%' }}
                                        variant="outlined"
                                        placeholder='Tên form'
                                    />
                                    <Typography variant='subtitle1' component="div">
                                        <b>Mô tả</b>
                                    </Typography>
                                    <TextField
                                        required
                                        value={description}
                                        onChange={e => { dispatch(setDescription(e.target.value)) }}
                                        sx={{ margin: '10px', width: '100%' }}
                                        variant="outlined"
                                        placeholder='Mô tả'
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                                    <AcceptButton title='Xác nhận' onClick={handleCreateForm} />
                                    <CancelButton title='Hủy' onClick={handleCloseModal} />
                                </Box>
                            </Box>
                            : null}
                    {
                        modal === 'delete' ?
                            <Box sx={{ ...style }}>
                                <Typography variant='h5'><b>Xác nhận xóa form?</b></Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }} >
                                    <AcceptButton title='Xác nhận' onClick={handleDeleteForm} />
                                    <CancelButton title='Hủy' onClick={handleCloseModal} />
                                </Box>
                            </Box>
                            : null
                    }
                </Box>
            </Modal>
        </Box>
    )
}

export default MyForms
