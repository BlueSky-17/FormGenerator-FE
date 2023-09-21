import React from 'react'
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import DeleteIcon from '@mui/icons-material/Delete';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function createData(
    title: string,
    type: string,
    note: string,
    isHead: boolean,
    isTail: boolean
) {
    return { title, type, note, isHead };
}

const rows = [
    createData('Họ và tên', 'Điền ngắn', 'K', true, false),
    createData('Giới tính', 'Trắc nghiệm', 'Nam | Nữ', false, false),
    createData('Ngày sinh', 'Lựa chọn', 'Ngày | Tháng | Năm', false, false),
    createData('Nơi sinh', 'Lựa chọn', 'Xã | Huyện | Tỉnh', false, false),
    createData('Ảnh', 'Ảnh', '4x6 cm', false, true),
];

const style = {
    position: 'absolute' as 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

function DetailForm() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [type, setType] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    return (
        <div>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE" }}>
                <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ color: '#364F6B', padding: '15px' }} variant="h6" noWrap component="div">
                        FORMS CỦA TÔI
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button sx={{
                        color: '#364F6B',
                        backgroundColor: 'white',
                        border: '2px solid #364F6B',
                        borderRadius: '50px',
                        marginY: '10px',
                        '&:hover': {
                            backgroundColor: '#364F6B', // Màu nền thay đổi khi hover
                            color: 'white'
                        },
                    }}>
                        Xem trước
                    </Button>
                    <Button sx={{
                        color: '#364F6B',
                        backgroundColor: 'white',
                        border: '2px solid #364F6B',
                        borderRadius: '50px',
                        margin: '10px',
                        paddingX: '15px',
                        '&:hover': {
                            backgroundColor: '#364F6B', // Màu nền thay đổi khi hover
                            color: 'white'
                        },
                    }}>
                        Chủ đề
                    </Button>
                </Box>

                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px', borderBottom: "10px solid #364F6B" }}>
                    <Button sx={{
                        color: 'white',
                        border: '2px solid #364F6B',
                        backgroundColor: '#364F6B',
                        borderRadius: '50px',
                        marginY: '10px',
                        paddingX: '15px',
                        '&:hover': {
                            backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                        },
                    }}>
                        Chỉnh sửa
                    </Button>
                    <Button sx={{
                        color: '#364F6B',
                        backgroundColor: 'white',
                        border: '2px solid #364F6B',
                        borderRadius: '50px',
                        margin: '10px',
                        paddingX: '15px',
                        '&:hover': {
                            backgroundColor: '#364F6B', // Màu nền thay đổi khi hover
                            color: 'white'
                        },
                    }}>
                        Xem phản hồi
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignContent: 'center', margin: '15px' }}>
                    <Box sx={{ display: 'flex', alignContent: 'center', flexDirection: 'column' }}>
                        <Typography variant='h4' component="div">Tiêu đề biểu mẫu</Typography>
                        <Typography variant='inherit' component="div">Mô tả biểu mẫu</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        onClick={handleOpen}
                        sx={{
                            color: 'white',
                            backgroundColor: '#364F6B',
                            borderRadius: '50px',
                            margin: '10px',
                            '&:hover': {
                                backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                            },
                        }}>
                        Chỉnh sửa
                    </Button>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={{ ...style, width: 400 }}>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography variant='h6' component="div">
                                        Chỉnh sửa câu hỏi
                                    </Typography>

                                    <Box sx={{ marginY: '10px', display: 'flex', alignItems: 'center' }}>
                                        <TextField sx={{ marginRight: '10px', width: '100%' }} id="outlined-basic" variant="outlined" placeholder='Nhập nội dung câu hỏi...' />
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Dạng</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={type}
                                                label="Dạng"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={'Trắc nghiệm'}>Trắc nghiệm</MenuItem>
                                                <MenuItem value={'Lựa chọn'}>Lựa chọn</MenuItem>
                                                <MenuItem value={'Điền ngắn'}>Điền ngắn</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <FormControl>
                                        {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="female"
                                            name="radio-buttons-group"
                                        >
                                            <FormControlLabel value="female" control={<Radio />} label="Nam" />
                                            <FormControlLabel value="male" control={<Radio />} label="Nữ" />
                                            <FormControlLabel value="other" control={<Radio />} label="Khác" />
                                        </RadioGroup>
                                    </FormControl>
                                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                                        <Button onClick={handleClose}>Lưu</Button>
                                        <Button onClick={handleClose}>Hủy</Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>
                    </Modal>
                </Box>

                <Divider />
                <Box sx={{ margin: '15px' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Tiêu đề</TableCell>
                                    <TableCell align="center">Dạng</TableCell>
                                    <TableCell align="center">Ghi chú</TableCell>
                                    <TableCell align="center">Chỉnh sửa</TableCell>
                                </TableRow >
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow
                                        key={row.title}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">{row.title}</TableCell>
                                        <TableCell align="center">{row.type}</TableCell>
                                        <TableCell align="center">{row.note}</TableCell>
                                        <TableCell align="center">
                                            <IconButton sx={{
                                                backgroundColor: '#364F6B',
                                                color: 'white',
                                                margin: '5px',
                                                '&:hover': {
                                                    backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                },
                                            }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton sx={{
                                                backgroundColor: '#364F6B',
                                                color: 'white',
                                                margin: '5px',
                                                '&:hover': {
                                                    backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                },
                                            }}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                            <IconButton sx={{
                                                backgroundColor: '#364F6B',
                                                color: 'white',
                                                margin: '5px',
                                                '&:hover': {
                                                    backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                },
                                            }}>
                                                <ArrowCircleDownIcon />
                                            </IconButton>
                                            <IconButton sx={{
                                                backgroundColor: '#364F6B',
                                                color: 'white',
                                                margin: '5px',
                                                '&:hover': {
                                                    backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                },
                                            }}>
                                                <ArrowCircleUpIcon />
                                            </IconButton>
                                            <IconButton sx={{
                                                backgroundColor: '#364F6B',
                                                color: 'white',
                                                margin: '5px',
                                                '&:hover': {
                                                    backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                },
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            onClick={handleOpen}
                            sx={{
                                color: 'white',
                                backgroundColor: '#364F6B',
                                borderRadius: '20px',
                                paddingX: '20px',
                                margin: '15px',
                                '&:hover': {
                                    backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                },
                            }}>
                            Thêm mới
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default DetailForm
