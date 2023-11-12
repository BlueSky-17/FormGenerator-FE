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

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef, GridValueGetterParams, GridRowModel, } from '@mui/x-data-grid';
import jsonData from '../../../assets/i18n/vi.json'

import { MainModal } from './mainmodal';
import { SubModal } from './submodal';
import Responses from '../Responses';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

async function getNewToken(refreshToken, user) {
    const refreshTokenEndpoint = 'http://localhost:8080/refresh';

    try {
        const response = await fetch(refreshTokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: refreshToken,
            }),
        });

        // Kiểm tra xem yêu cầu có thành công hay không
        if (response.ok) {
            // Đọc nội dung của Response và chuyển đổi thành JSON
            const data = await response.json();
            data.user = user;
            return data;
        } else {
            console.error('Failed to refresh access token');
            return null;
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null;
    }
}

function DetailForm({ getToken }) {
    // render: use to re-render after create or delete form
    const [render, setRender] = useState(false);

    const [formDetail, setFormDetail] = useState<any>({})

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;

    const UpdateFormAPI_URL = `http://localhost:8080/update-form/${useParams()?.formID}`;

    // API GET: Get detail of form
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(FormDetailAPI_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
                    }
                });

                if (!response.ok) {
                    // Handle non-OK responses (e.g., 401 Unauthorized)
                    if (response.status === 401) {
                        const refreshToken = getToken().refreshToken;
                        const user = getToken().user;
                        console.log(refreshToken, user);
                        const newToken = await getNewToken(refreshToken, user);
                        console.log(newToken);
                        sessionStorage.setItem('token', JSON.stringify(newToken));
                        // You might want to trigger the useEffect again to retry the fetch
                        setRender(prev => !prev);
                    } else {
                        // Handle other non-OK responses
                        console.error(`HTTP error! Status: ${response.status}`);
                    }
                    return;
                }

                const formDetail = await response.json();
                // console.log(forms);
                setFormDetail(formDetail);
            } catch (error) {
                // Handle fetch errors (e.g., network issues)
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[render]);

    // API PUT: Update form 
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

    // Navigate to view form page
    const navigate = useNavigate();
    const viewForm = () => {
        navigate('/form/' + formDetail.id + '/view');
    };

    // View Edit-Page or Responses
    const [typeView, setTypeView] = useState('ViewEdit'); //ViewEdit or ViewResponses
    const changeToViewEdit = () => setTypeView('ViewEdit')
    const changeToViewResponses = () => setTypeView('ViewResponses')

    // Set type, title, required of question
    const [type, setType] = React.useState('');
    const [titleQuestion, setTitleQuestion] = useState('');
    const [required, setRequired] = useState(false);

    // Close/Open Main Modal 
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    // Close/Open Sub Modal
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
            convertTextToOptionList(inputText);
        }
        else if (type === 'multi-choice' || type === 'checkbox') setSubOpen('multi-choice')
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

    // Get text in InputBox (include '\n')
    const [inputText, setInputText] = useState('');
    const handleInputText = (e) => {
        setInputText(e.target.value)
    }

    // Option List
    const [optionList, setOptionList] = useState<string[]>(['']); //Mảng lưu value các option
    const convertTextToOptionList = (inputText: string) => {
        const myDropdown = inputText.split('\n');
        setOptionList(myDropdown)
        setSubOpen('')
    }

    console.log(formDetail);

    // Delete Question 
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

    // Duplicate Question
    const [duplicated, setDuplicate] = React.useState(true);
    const handleDuplicate = (ques: string, index: number) => (event: any) => {
        // Push index vào QuestionOrder
        const newIndex = formDetail.Questions.length;

        formDetail.QuestionOrder.splice(index + 1, 0, newIndex);

        formDetail.Questions.splice(newIndex, 0, formDetail.Questions[ques])

        if (duplicated === true) setDuplicate(false);
        else setDuplicate(true);
        updateObjectInDatabase({
            "questionOrder": formDetail.QuestionOrder,
            "questions": formDetail.Questions
        })
    }

    // Swap Question
    const [swaped, setSwap] = React.useState(true);
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
    const handleSwapDown = (ques: string, index: number) => (event: any) => {
        formDetail.QuestionOrder = swapElements(formDetail.QuestionOrder, index);
        // console.log(formDetail.QuestionOrder)
        if (swaped === true) setSwap(false);
        else setSwap(true);
        updateObjectInDatabase({
            "questionOrder": formDetail.QuestionOrder,
            "questions": formDetail.Questions
        })
    }
    const handleSwapUp = (ques: string, index: number) => (event: any) => {
        console.log(formDetail.QuestionOrder)
        formDetail.QuestionOrder = swapElements(formDetail.QuestionOrder, index - 1);
        console.log(formDetail.QuestionOrder)
        if (swaped === true) setSwap(false);
        else setSwap(true);
        updateObjectInDatabase({
            "questionOrder": formDetail.QuestionOrder,
            "questions": formDetail.Questions
        })
    }

    // Edit Question
    const [quesEdit, setQuesEdit] = React.useState('-1');
    const editQuestion = (ques: string, index: string) => (event: any) => {
        setOpen(true);
        setType(formDetail.Questions[ques].Type);
        setTitleQuestion(formDetail.Questions[ques].Question)
        setRequired(formDetail.Questions[ques].Required);

        if (formDetail.Questions[ques].Type === 'multi-choice' || formDetail.Questions[ques].Type === 'checkbox')
            setOptionList(formDetail.Questions[ques].Content.MultiChoice.Options)

        setQuesEdit(ques);
    }

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
            <Box sx={{ backgroundColor: 'white', borderRadius: '15px' }}>

                {/*Header of Form: Title & Settings*/}
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

                {/*Tabs: Chỉnh sửa & Xem phản hồi*/}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3px', borderBottom: "10px solid #364F6B" }}>
                    {typeView === 'ViewEdit' &&
                        <Button
                            sx={{
                                backgroundColor: '#364F6B', color: 'white', border: '2px solid #364F6B', borderRadius: '10px', margin: '7px', paddingX: '15px',
                                '&:hover': {
                                    backgroundColor: '#364F6B', // Màu nền thay đổi khi hover
                                    color: 'white'
                                },
                            }}
                        >
                            Chỉnh sửa
                        </Button>}
                    {typeView === 'ViewResponses' &&
                        <Button
                            sx={{
                                color: '#364F6B', backgroundColor: 'white', border: '2px solid #364F6B', borderRadius: '10px', margin: '7px', paddingX: '15px',
                            }}
                            onClick={changeToViewEdit}
                        >
                            Chỉnh sửa
                        </Button>}
                    {typeView === 'ViewEdit' &&
                        <Button
                            sx={{
                                color: '#364F6B', backgroundColor: 'white', border: '2px solid #364F6B', borderRadius: '10px', margin: '7px', paddingX: '15px'
                            }}
                            onClick={changeToViewResponses}
                        >
                            Xem phản hồi
                        </Button>}
                    {typeView === 'ViewResponses' &&
                        <Button
                            sx={{
                                backgroundColor: '#364F6B', color: 'white', border: '2px solid #364F6B', borderRadius: '10px', margin: '7px', paddingX: '15px',
                                '&:hover': {
                                    backgroundColor: '#364F6B', // Màu nền thay đổi khi hover
                                    color: 'white'
                                },
                            }}
                        >
                            Xem phản hồi
                        </Button>}
                </Box>

                {/* Body of Form */}
                {typeView === 'ViewEdit' &&
                    <Box sx={{ margin: '15px' }}>

                        {/* Form Description */}
                        <Typography sx={{ marginBottom: '10px' }} variant='body1' component="div">
                            {Object.keys(formDetail).length !== 0 ? formDetail.header.Description : null}
                        </Typography>

                        <Divider />

                        <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
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
                                                    onClick={editQuestion(ques, index)}
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
                                                    onClick={handleDuplicate(ques, index)}
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
                                                    onClick={handleSwapUp(ques, index)}
                                                    sx={{
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
                                                    onClick={handleSwapDown(ques, index)}
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
                    </Box>}
            </Box >

            {typeView === 'ViewResponses' &&
                <Responses />
            }

            <MainModal
                open={open}
                setOpen={setOpen}
                formDetail={formDetail}
                type={type}
                setType={setType}
                titleQuestion={titleQuestion}
                setTitleQuestion={setTitleQuestion}
                required={required}
                setRequired={setRequired}

                excelData={excelData}
                setExcelData={setExcelData}
                fields={fields}
                myObject={myObject}
                handleSubOpen={handleSubOpen}
                optionList={optionList}
                setOptionList={setOptionList}
                quesEdit={quesEdit}
            />

            <SubModal
                subopen={subopen}
                handleSubClose={handleSubClose}
                excelData={excelData}
                setExcelData={setExcelData}
                handleProcessRowUpdate={handleProcessRowUpdate}
                columns={columns}
                handleSaveLinkedData={handleSaveLinkedData}
                inputText={inputText}
                setInputText={setInputText}
                handleInputText={handleInputText}
                convertTextToOptionList={convertTextToOptionList}
            />

        </Box >
    )
}

export default DetailForm
