import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

//CSS for Search Input
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

//CSS for Search Input
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

//CSS for Search Input
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

function MyForms() {

    // const nav: any = useNavigate()

    // if (loginState) {
    //   nav('/home')
    // };

    //Page Pagination
    const [itemsPerPage, setItemsPerPage] = useState('');
    const [forms, setForms] = useState<any[]>([])

    const CreateFormAPI_URL = `http://localhost:8080/form/`;

    //API GET: getForms by UserId
    useEffect(() => {
        fetch(`http://localhost:8080/forms/${JSON.parse(sessionStorage.getItem('token') as string)?.user.ID}`, {
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
    }, [])

    //API POST: create a new response
    const createForm = async (data) => {
        try {
            const response = await fetch(CreateFormAPI_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken,
                },
                body: JSON.stringify(data)
            });

            console.log(response);

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const dataFromServer = await response.json();
            // Xử lý dữ liệu từ máy chủ (nếu cần)
            console.log(dataFromServer);
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };

    const createNewForm = () => {
        createForm(
            {
                "name": "Form Đăng ký Online",
                "header": {
                    "Title": "ĐĂNG KÝ THAM GIA ĐƯỜNG CHẠY VÌ CỘNG ĐỒNG UPRACE 2022",
                    "Description": "[UpRace 2022 - Cột Mốc 5 Năm Vì Cộng Đồng]",
                    "ImagePath": ""
                },
                "owner": "651c23cd42c2093b0ae518ba",
                "answersCounter": 0,
                "latestModified": "2023-10-14T12:34:56Z",
                "createDate": "2023-10-14T12:34:56Z"
            }
        )
    }

    console.log(forms);

    const handleChange = (event: SelectChangeEvent) => {
        setItemsPerPage(event.target.value);
    };

    // Navigate when click edit form
    const navigate = useNavigate();

    const editForm = (id: string) => (event: any) => {
        navigate('/form/' + id);
    };

    return (
        <Box>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", height: '100%' }}>
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

                    <Button
                        onClick={createNewForm}
                        sx={{
                            backgroundColor: '#364F6B',
                            margin: '10px',
                            '&:hover': {
                                backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                            },
                        }}>
                        <Typography sx={{ fontWeight: 500, color: 'white', paddingX: '10px', paddingY: '4px' }} variant="body2" noWrap component="div">
                            Tạo Form
                        </Typography>
                    </Button>
                </Box>

                <Divider />
                <Box sx={{ margin: '15px', minHeight: 480 }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell sx={{ padding: 2, fontWeight: 800, fontSize: '1rem' }} align="left">STT</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="left">Tên Form</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="center">Quyền truy cập</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="center">Phản hồi</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="center">Tình trạng</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="center">Thao tác</TableCell>
                                </TableRow >
                            </TableHead>
                            <TableBody>
                                {forms.map((form, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ padding: 2, fontWeight: 500, fontSize: '1.05rem' }} component="th" scope="row" align="left">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{form.name}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">
                                            {/* {form.Editors[0]} */}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">{form.AnswersCounter}</TableCell>
                                        <TableCell sx={{ padding: 1 }} align="center">
                                            {form.formState ?
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
                                        <TableCell sx={{ padding: 1 }} align="center">
                                            {/* <Button sx={{
                                                    backgroundColor: '#364F6B',
                                                    margin: '10px',
                                                    '&:hover': {
                                                        backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                    },
                                                }}>
                                                    <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                        Chỉnh sửa
                                                    </Typography>
                                                </Button> */}
                                            <Tooltip title="Chỉnh sửa" placement="left">
                                                <IconButton
                                                    onClick={editForm(form.id)}
                                                    sx={{
                                                        backgroundColor: '#364F6B',
                                                        color: 'white',
                                                        margin: '5px',
                                                        '&:hover': {
                                                            backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                        },
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Link to="/detail">
                                                {/* <Button sx={{
                                                    backgroundColor: '#364F6B',
                                                    margin: '10px',
                                                    '&:hover': {
                                                        backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                    },
                                                }}>
                                                    <Typography sx={{ color: 'white', paddingX: '5px', paddingY: '2px' }} variant="body2" noWrap component="div">
                                                        Xem phản hồi
                                                    </Typography>
                                                </Button> */}
                                                <Tooltip title="Xem phản hồi" placement="right">
                                                    <IconButton
                                                        sx={{
                                                            backgroundColor: '#364F6B',
                                                            color: 'white',
                                                            margin: '5px',
                                                            '&:hover': {
                                                                backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                            },
                                                        }}>
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
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
                    <Stack spacing={2}>
                        <Pagination count={10} color="primary" />
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default MyForms
