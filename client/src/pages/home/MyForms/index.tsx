import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// MUI COMPONENTs
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, Divider } from '@mui/material'
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// APIs
import { deleteForm } from '../../../apis/form';

// REDUX
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setModal } from '../../../redux/reducers/form.reducer';

// ICONs
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

// COMPONENTs
import { SearchIconWrapper, Search, StyledInputBase } from './searchBar';
import CircleButton from '../../../components/custom-button/circleButton';
import AcceptButton from '../../../components/custom-button/acceptButton';
import LoadingPage from '../../../components/loading-page/loading';
import Error404 from '../../../components/error-page/404';
import ModalAdd from './modalAdd';

function MyForms() {
    const [forms, setForms] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    const formState = useAppSelector((state) => state.formReducer)
    const dispatch = useAppDispatch()

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
                }
                return response.json();
            })
            .then(forms => {
                if (forms !== null) setForms(forms);
                setLoading(false);
            })
    }, [currentPage, keyword])

    // Temp: get Form.length to page pagination (not affect the number of renders)
    const [formsLength, setFormsLength] = useState([])
    useEffect(() => {
        fetch(`http://localhost:8080/forms/${JSON.parse(localStorage.getItem('token') as string)?.user.ID}`, {
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
                }
                return response.json();
            })
            .then(formsLength => {
                if (formsLength !== null) setFormsLength(formsLength);
                setLoading(false);
            })
    }, [])

    const handleDeleteForm = async () => {
        // Close modal
        dispatch(setModal({ modal: '', isOpen: false }))

        setForms((prevData) => prevData.filter((item) => item.id !== formID))

        // Call API DELETE form by ID
        await deleteForm(formID);
    }

    // Modal ADD + DELETE Form
    const [formID, setFormID] = useState(''); // Get formID to delete form

    const openModalAdd = () => dispatch(setModal({ modal: 'select', isOpen: true }))
    const openModalDelete = (formID: string) => (e) => {
        dispatch(setModal({ modal: 'delete', isOpen: true }))
        setFormID(formID);
    }

    // Navigate when click edit form
    const navigate = useNavigate();
    const editForm = (id: string, typeView: string) => (event: any) => {
        navigate('/form/' + id, { state: typeView });
    };

    if (loading) {
        return <LoadingPage />
    }

    if (notFound) {
        return <Error404 />
    }

    return (
        <Box style={{ height: '100%', display: 'flex', width: '100%', paddingTop: '70px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', border: "2px solid #DEDEDE", height: '100%', width: '100%' }}>
                <Typography sx={{ color: '#364F6B', padding: '15px', fontWeight: 600 }} variant="h6" noWrap component="div">
                    BIỂU MẪU CỦA TÔI
                </Typography>
                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'center', padding: '5px', paddingLeft: '15px' }}>
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
                <Box sx={{ height: '100%' }}>
                    {forms.length === 0 ?
                        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ color: '#364F6B', fontWeight: 500 }}>Bạn hiện chưa sở hữu biểu mẫu nào.</Typography>
                        </Box> :
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
                                    {forms.map((form, index) => (
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
                                                <CircleButton tooltip='Chỉnh sửa' onClick={editForm(form.id, "ViewEdit")} children={<EditIcon />} />

                                                <CircleButton tooltip='Xem phản hồi' onClick={editForm(form.id, "ViewResponses")} children={<VisibilityIcon />} />

                                                <CircleButton tooltip='Xóa biểu mẫu' onClick={openModalDelete(form.id)} children={<DeleteIcon />} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', m: 2 }}>
                    <Stack spacing={2}>
                        <Pagination count={Math.ceil(formsLength.length / 5)} page={currentPage} onChange={handleChangePagination} color="primary" />
                    </Stack>
                </Box>
            </Box>

            {/* Modal create form */}
            <ModalAdd
                handleDeleteForm={handleDeleteForm}
            >
            </ModalAdd>
            {/* <Modal
                open={isOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    {
                        modal === 'add' ?
                            <Box sx={modalStyle}>
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
                            <Box sx={{ ...modalStyle }}>
                                <Typography variant='h5'><b>Xác nhận xóa form?</b></Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }} >
                                    <AcceptButton title='Xác nhận' onClick={handleDeleteForm} />
                                    <CancelButton title='Hủy' onClick={handleCloseModal} />
                                </Box>
                            </Box>
                            : null
                    }
                </Box>
            </Modal> */}
        </Box>
    )
}

export default MyForms
