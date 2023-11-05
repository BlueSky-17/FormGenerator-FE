import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';

import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NotesIcon from '@mui/icons-material/Notes';
import ClearIcon from '@mui/icons-material/Clear';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EventIcon from '@mui/icons-material/Event';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ChangeEvent } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams, GridRowModel, } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import jsonData from '../../../assets/i18n/vi.json'

import { Question, ShortText, MultiChoice, Date, LinkedData } from './interface';
import * as XLSX from 'xlsx'
import { MainModal } from './mainmodal';
import { SubModal } from './submodal';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function DetailForm() {
    const [formDetail, setFormDetail] = useState<any>({})

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;

    const UpdateFormAPI_URL = `http://localhost:8080/update-form/${useParams()?.formID}`;

    //API GET: Get detail of form
    useEffect(() => {
        console.log(FormDetailAPI_URL);

        fetch(FormDetailAPI_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            }
        })
            .then(data => data.json())
            .then(formDetail => {
                setFormDetail(formDetail);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //API PUT: Update form 
    const updateObjectInDatabase = async (updateData) => {
        try {
            const response = await fetch(UpdateFormAPI_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
                },
                body: JSON.stringify(updateData),
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

    // Đóng/Mở Modal edit form
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    // Set type of question
    const [type, setType] = React.useState('');
    const handleChangeType = (event: SelectChangeEvent) => setType(event.target.value as string);

    // Đóng/Mở Submodal edit form (using with linked-data type)
    const [subopen, setSubOpen] = React.useState('');
    const handleSubOpen = (e) => {
        if (type === 'linkedData') {
            setSubOpen('linkedData')

            // Lấy mảng các field (keys) 
            const rest = Object.keys(excelData[0])
            const lastElement = rest.pop(); //Xóa property id ở cuối mảng
            console.log(rest.length)

            for (let i = 0; i < rest.length; ++i) {
                columns.push({
                    field: rest[i],
                    headerName: rest[i],
                    width: 150,
                    editable: true,
                })
            }

            setFields(rest); // fields: ['Tính','Huyện','Xã']
            // setColumn(rest);
        }
        else if (type === 'dropDown') {
            setSubOpen('dropDown')
            solveTextInDropDown(textInDropdown);
        }
    }
    const handleSubClose = () => {
        setSubOpen('');
        setColumn([]);
    }

    // Xử lý linkedData
    const [excelData, setExcelData] = useState<{ id: number }[]>([]);
    const [fields, setFields] = useState<string[]>([]);
    const [columns, setColumn] = useState<GridColDef[]>([])
    const [myObject, setMyObject] = useState({});
    const handleSaveLinkedData = () => {
        setSubOpen('');

        const arr = Object.keys(excelData[0])[0]; //['Tính']

        //Trả về mảng different value của field đầu tiên ['Nghệ An','Hà Tĩnh', 'TP.HCM']
        const uniqueValues = excelData.reduce((accumulator: string[], row) => {
            // Check if the name is not already in the accumulator
            if (!accumulator.includes(row[arr])) {
                accumulator.push(row[arr])
            }
            return accumulator;
        }, []);

        console.log(uniqueValues); //['Nghệ An', 'Hà Tĩnh', 'TP.HCM']

        const tempObject = {};

        uniqueValues.forEach(item => {
            tempObject[item] = {}
        });

        const arr2 = Object.keys(excelData[0])[1]; //['Huyện']

        const uniqueValues2 = excelData.reduce((accumulator: string[], row) => {
            // Check if the name is not already in the accumulator
            if (!accumulator.includes(row[arr2])) {
                accumulator.push(row[arr2])
            }
            return accumulator;
        }, []);

        console.log(uniqueValues2); //['Thanh Chương', 'Nghi Lộc', 'Can Lộc', 'Quận 7']

        uniqueValues2.forEach(item => {
            excelData.forEach(item2 => {
                if (item2[arr2] === item) tempObject[item2[arr]][item] = {};
            }
            )
        });

        const arr3 = Object.keys(excelData[0])[2]; //['Xã']

        const uniqueValues3 = excelData.reduce((accumulator: string[], row) => {
            // Check if the name is not already in the accumulator
            if (!accumulator.includes(row[arr3])) {
                accumulator.push(row[arr3])
            }
            return accumulator;
        }, []);

        console.log(uniqueValues3); //['Thị Trấn', 'Thanh Đồng', 'Ngọc Sơn', 'Đông Tây']

        uniqueValues3.forEach(item => {
            excelData.forEach(item3 => {
                if (item3[arr3] === item) tempObject[item3[arr]][item3[arr2]] = item;
            }
            )
        });

        setMyObject(tempObject);
    }
    const handleProcessRowUpdate = (updatedRow, originalRow) => {
        // Find the index of the row that was edited
        const rowIndex = excelData.findIndex((row) => row.id === updatedRow.id);

        // Replace the old row with the updated row
        const updatedRows = [...excelData];
        updatedRows[rowIndex] = updatedRow;

        // Update the state with the new rows
        setExcelData(updatedRows);

        // Return the updated row to update the internal state of the DataGrid
        return updatedRow;
    };

    const [textInDropdown, setTextInDropdown] = useState('');
    const handleTextInDropdown = (e) => {
        setTextInDropdown(e.target.value)
    }

    const [optionInDropDown, setOptionInDropdown] = useState<string[]>([]);
    const solveTextInDropDown = (textInDropDown: string) => {
        const myDropdown = textInDropDown.split('\n');
        setOptionInDropdown(myDropdown);
    }

    console.log(formDetail);

    // Delete question in a form 
    const [deleted, setDelete] = React.useState(false);
    const deleteQuestion = (index: string) => (event: any) => {
        // Xóa 1 phần tử ở vị trí index
        formDetail.Questions.splice(index, 1)

        // Lọc mảng các num mà khác index, chỉnh lại cho các num
        formDetail.QuestionOrder = formDetail.QuestionOrder.filter(num => num !== index);
        formDetail.QuestionOrder = formDetail.QuestionOrder.map((num) => {
            if (num > index)
                return --num;
            else
                return num;
        })

        if (deleted === true) setDelete(false);
        else setDelete(true);
        updateObjectInDatabase({
            "questionOrder": formDetail.QuestionOrder,
            "questions": formDetail.Questions
        })
    };

    // Navigate to view form page
    const navigate = useNavigate();

    const viewForm = () => {
        navigate('/form/' + formDetail.id + '/view');
    };

    const [duplicated, setDuplicate] = React.useState('');

    // const handleDuplicate = (id_: string, index: number) => (event: any) => {
    //     // console.log(rows, id_, index);
    //     let temp = rows.filter(row => row.id === id_);
    //     let result = temp[0];
    //     temp = [];
    //     // console.log(result);
    //     rows.splice(index + 1, 0, createData(uuid(), result.title, result.type, result.note, result.isHead, false));
    //     setDuplicate(rows[index].id);
    // }

    const [swaped, setSwap] = React.useState('');

    function swapElements<T>(arr: T[], index: number): T[] {
        // Kiểm tra xem index có hợp lệ không
        if (index < 0 || index >= arr.length - 1) {
            console.error("Invalid index for swapping elements.");
            return arr; // Trả về mảng ban đầu nếu index không hợp lệ
        }

        // Hoán đổi vị trí của hai phần tử liên tiếp
        const temp = arr[index];
        arr[index] = arr[index + 1];
        arr[index + 1] = temp;

        return arr;
    }

    // const handleSwap = (id_: string, index: number) => (event: any) => {
    //     rows = swapElements(rows, index);
    //     console.log(rows[index].title)
    //     setSwap(rows[index].id);
    // }

    // Tùy chỉnh nút Settings
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseSetting = () => {
        setAnchorEl(null);
    };
    const open_settings = Boolean(anchorEl);

    console.log(formDetail.Questions);

    return (
        <Box>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white' }}>

                {/*Header of Form: Title, Save Form and Settings*/}
                <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ color: '#364F6B', padding: '12px', fontWeight: 600 }} variant="h4" noWrap component="div">
                        {Object.keys(formDetail).length !== 0 ? formDetail.header.Title : null}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton
                        onClick={handleClick}
                        sx={{
                            color: '#364F6B',
                            backgroundColor: 'white',
                            margin: '5px',
                            marginY: '15px',
                        }}>
                        <SettingsIcon />
                    </IconButton>
                    <Popover
                        open={open_settings}
                        anchorEl={anchorEl}
                        onClose={handleCloseSetting}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <Button
                            onClick={viewForm}
                            sx={{ p: 2, fontWeight: 500, color: 'black', textTransform: 'initial', fontSize: '15px' }}
                        >
                            Xem trước
                        </Button>
                        <Divider />
                        <Button sx={{ p: 2, fontWeight: 500, color: 'black', textTransform: 'initial', fontSize: '15px' }}>Sửa chủ đề</Button>
                        <Divider />
                        <Button sx={{ p: 2, fontWeight: 500, color: 'black', textTransform: 'initial', fontSize: '15px' }}>Đóng Form</Button>
                    </Popover>
                </Box>

                <Divider />

                {/*Header of Form: Chỉnh sửa & Xem phản hồi*/}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px', borderBottom: "10px solid #364F6B" }}>
                    <Button sx={{
                        color: 'white',
                        border: '2px solid #364F6B',
                        backgroundColor: '#364F6B',
                        borderRadius: '10px',
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
                        borderRadius: '10px',
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

                {/*Header of Form: Description*/}
                <Box sx={{ display: 'flex', alignContent: 'center', margin: '15px' }}>
                    {/* Form Description */}
                    <Typography sx={{}} variant='body1' component="div">
                        {Object.keys(formDetail).length !== 0 ? formDetail.header.Description : null}
                    </Typography>
                </Box>

                <Divider />

                {/* Body of Form */}
                <Box sx={{ margin: '15px' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="left">STT</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="left">Tiêu đề</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="left">Dạng</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="left">Ghi chú</TableCell>
                                    <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="center">Chỉnh sửa</TableCell>
                                </TableRow >
                            </TableHead>
                            <TableBody>
                                {formDetail.Questions !== undefined ? formDetail.QuestionOrder.map((ques, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ padding: 1, fontWeight: 500, fontSize: '1.05rem' }} component="th" scope="row" align="left">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{formDetail.Questions[ques].Question}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{jsonData[formDetail.Questions[ques].Type]}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{formDetail.Questions[ques].Description}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">
                                            <IconButton
                                                onClick={handleOpen}
                                                sx={{
                                                    backgroundColor: '#364F6B',
                                                    color: 'white',
                                                    margin: '5px',
                                                    '&:hover': {
                                                        backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                    },
                                                }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                // onClick={handleDuplicate(row.id, index)}
                                                sx={{
                                                    backgroundColor: '#364F6B',
                                                    color: 'white',
                                                    margin: '5px',
                                                    '&:hover': {
                                                        backgroundColor: '#176B87', // Màu nền thay đổi khi hover
                                                    },
                                                }}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                            <IconButton
                                                // onClick={handleSwap(row.id, index)}
                                                sx={{
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
                                            <IconButton
                                                onClick={deleteQuestion(ques)}
                                                sx={{
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
                                )) : null
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            onClick={handleOpen}
                            sx={{
                                color: 'white',
                                backgroundColor: '#364F6B',
                                borderRadius: '15px',
                                paddingX: '15px',
                                margin: '15px',
                                '&:hover': {
                                    backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                },
                            }}>
                            <AddCircleOutlineIcon sx={{ marginRight: '8px' }} />
                            Thêm mới
                        </Button>
                    </Box>
                </Box>
            </Box >

            <MainModal
                open={open}
                setOpen={setOpen}
                formDetail={formDetail}
                excelData={excelData}
                setExcelData={setExcelData}
                fields={fields}
                type={type}
                setType={setType}
                handleChangeType={handleChangeType}
                myObject={myObject}
                handleSubOpen={handleSubOpen}
            />

            <SubModal
                subopen={subopen}
                handleSubClose={handleSubClose}
                excelData={excelData}
                setExcelData={setExcelData}
                optionInDropDown={optionInDropDown}
                handleProcessRowUpdate={handleProcessRowUpdate}
                columns={columns}
                handleSaveLinkedData={handleSaveLinkedData}
            />

        </Box >
    )
}

export default DetailForm
