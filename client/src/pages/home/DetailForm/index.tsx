import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from "react-router-dom";

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

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef, GridValueGetterParams, GridRowModel, } from '@mui/x-data-grid';
import jsonData from '../../../assets/i18n/vi.json'

import { MainModal } from './mainmodal';
import { SubModal } from './submodal';
import Responses from '../Responses';
import { ShortText, MultiChoice, Date } from './interface';
import EditModal from './editmodal';

import CircleButton from '../../../components/custom-button/circleButton';
import AcceptButton from '../../../components/custom-button/acceptButton';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function DetailForm() {
    const [render, setRender] = useState(false)
    const [formDetail, setFormDetail] = useState<any>({})
    const [formResponses, setFormResponses] = useState<any>({})

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;

    const UpdateFormAPI_URL = `http://localhost:8080/update-form/${useParams()?.formID}`;

    const ResponsesAPI_URL = `http://localhost:8080/get-response/${useParams()?.formID}`;

    const [openEditModal, setOpenEditModal] = useState(false)

    const handleOpenEditModal = () => {
        setOpenEditModal(true);
        handleCloseSetting();
    }

    useEffect(() => {
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
                setFormState(formDetail.formState);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetch(ResponsesAPI_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            }
        })
            .then(data => data.json())
            .then(responses => {
                if (responses === null) setFormResponses([]);
                else setFormResponses(responses);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const dataFromServer = await response.json();
            // Xử lý dữ liệu từ máy chủ (nếu cần)
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };

    // Navigate to view form page
    const navigate = useNavigate();
    const viewForm = () => {
        // navigate('/form/' + formDetail.id + '/view');

        const currentBaseUrl = window.location.origin;

        const path = '/form/' + formDetail.id + '/view';

        const fullUrl = `${currentBaseUrl}${path}`;

        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    };

    const [formState, setFormState] = useState(true)

    const confirmFormState = (state: string) => (e) => {
        setSubOpen(state)
        setAnchorEl(null);
    };

    const handleCloseForm = () => {
        updateObjectInDatabase({
            "formState": false
        })
        setFormState(false);
        setSubOpen("")
    }

    const handleOpenForm = () => {
        updateObjectInDatabase({
            "formState": true
        })
        setFormState(true);
        setSubOpen("")
    }

    // View Edit-Page or Responses
    const location = useLocation();
    const data = location.state;

    const [typeView, setTypeView] = useState(data); //ViewEdit or ViewResponses
    const changeToViewEdit = () => setTypeView('ViewEdit')
    const changeToViewResponses = () => setTypeView('ViewResponses')

    // Set type, title, required of question
    const [type, setType] = React.useState('');
    const [tempType, setTempType] = React.useState('');
    const [titleQuestion, setTitleQuestion] = useState('');
    const [required, setRequired] = useState(false);

    //Set constraint & maxOptions for checkbox question
    const [constraint, setConstraint] = useState<string>('no-limit')
    const handleConstraint = (e) => {
        setConstraint(e.target.value);
    }
    const [maxOptions, setMaxOptions] = useState<number>(2)
    const handleMaxOptions = (e) => {
        setMaxOptions(e.target.value);
    }

    //columnList (Table type)
    const [columnList, setColumnList] = useState<{ ColumnName: string, Type: string, Content: {} }[]>([
        {
            ColumnName: '',
            Type: '',
            Content: {}
        }
    ])
    const [columnType, setColumnType] = useState('');
    const handleColumnType = (index: number) => (e) => {
        setColumnType(e.target.value)
        columnList[index].Type = e.target.value

        if (e.target.value === 'shortText') {
            const updateShortText: ShortText = {
                shortText: true
            };

            columnList[index].Content = {}
            Object.assign(columnList[index].Content, updateShortText);
        }
        else if (e.target.value === 'dropdown') {
            const updateDropdown: MultiChoice = {
                MultiChoice: {
                    Options: [],
                    Constraint: '',
                    MaxOptions: 1
                }
            };

            columnList[index].Content = {}
            Object.assign(columnList[index].Content, updateDropdown);
        }
        else if (e.target.value === 'date-single') {
            const updateDate: Date = {
                Date: 0
            };

            columnList[index].Content = {}
            Object.assign(columnList[index].Content, updateDate);
        }

        console.log(columnList)
    }
    const [indexOptionTable, setIndexOptionTable] = useState('')

    const solveOptionTable = () => {
        const myDropdown = inputText.split('\n');
        columnList[indexOptionTable].Content.MultiChoice.Options = myDropdown;
        console.log(columnList[indexOptionTable].Content.MultiChoice.Options)
        setInputText('')
        setSubOpen('')
    }

    // Close/Open Main Modal 
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setQuesEdit(-1)
        setOpen(true);
    }

    // Close/Open Sub Modal
    const [subopen, setSubOpen] = React.useState('');
    const handleSubOpen = (e) => {
        if (type === 'linkedData') {
            setSubOpen('linkedData')

            // Lấy mảng các field (keys) 
            const rest = Object.keys(excelData[0])
            const lastElement = rest.pop(); //Xóa property id ở cuối mảng
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
        else if (type === 'multi-choice' || type === 'checkbox' || type === 'dropdown' || type === 'table') setSubOpen('multi-choice')
        //When no type => delete question
        else {
            setSubOpen('delete')
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

        console.log(uniqueValues3)

        uniqueValues3.forEach(item => {
            excelData.forEach(item3 => {
                // console.log(Object.is(tempObject[item3[arr]][item3[arr2]],null))
                if (item3[arr3] === item && Object.keys(tempObject[item3[arr]][item3[arr2]]).length === 0) tempObject[item3[arr]][item3[arr2]] = [item];
                else if (item3[arr3] === item && tempObject[item3[arr]][item3[arr2]].length > 0) {
                    tempObject[item3[arr]][item3[arr2]].push(item);
                }
            }
            )
        });

        console.log(tempObject)

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

    //Xử lý file
    const [maxFileAmount, setMaxFileAmount] = useState(1);
    const [maxFileSize, setMaxFileSize] = useState(10240);
    const handleMaxFileAmount = (event: SelectChangeEvent) => {
        // console.log(event)
        const intValue: number = parseInt(event.target.value as string, 10);
        setMaxFileAmount(intValue);
    }
    const handleMaxFileSize = (event: SelectChangeEvent) => {
        setMaxFileSize(parseInt(event.target.value as string, 10));
    }
    const [fileType, setFileType] = useState([]);

    // Delete Question 
    const handleDeleteQuestion = (index: number) => (event: any) => {
        // Create a copy of formDetail to avoid mutating the original state
        const updatedFormDetail = { ...formDetail };

        // Update the Questions array by removing the element at the specified index
        updatedFormDetail.Questions.splice(index, 1);

        // Update the QuestionOrder array
        updatedFormDetail.QuestionOrder = updatedFormDetail.QuestionOrder.filter(num => num !== index);
        updatedFormDetail.QuestionOrder = updatedFormDetail.QuestionOrder.map((num) => {
            if (num > index) {
                return --num;
            } else {
                return num;
            }
        });

        setFormDetail(updatedFormDetail);
        setHasChange(true); //enabled button 'Lưu thay đổi'
    }

    // Duplicate Question
    const handleDuplicate = (ques: string, index: number) => (event: any) => {
        const updatedFormDetail = { ...formDetail };

        // Push index vào QuestionOrder
        const newIndex = updatedFormDetail.Questions.length;

        updatedFormDetail.QuestionOrder.splice(index + 1, 0, newIndex);
        updatedFormDetail.Questions.splice(newIndex, 0, updatedFormDetail.Questions[ques])

        setFormDetail(updatedFormDetail);
        setHasChange(true); //enabled button 'Lưu thay đổi'
    }

    // Swap Question
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
        const updatedFormDetail = { ...formDetail };

        updatedFormDetail.QuestionOrder = swapElements(updatedFormDetail.QuestionOrder, index);

        setFormDetail(updatedFormDetail);
        setHasChange(true); //enabled button 'Lưu thay đổi'
    }
    const handleSwapUp = (ques: string, index: number) => (event: any) => {
        const updatedFormDetail = { ...formDetail };

        updatedFormDetail.QuestionOrder = swapElements(updatedFormDetail.QuestionOrder, index - 1);

        setFormDetail(updatedFormDetail);
        setHasChange(true); //enabled button 'Lưu thay đổi'
    }

    // Edit Question
    const [quesEdit, setQuesEdit] = React.useState(-1);
    const editQuestion = (ques: number, index: string) => (event: any) => {
        setOpen(true);
        setType(formDetail.Questions[ques].Type);
        setTempType(formDetail.Questions[ques].Type);
        setTitleQuestion(formDetail.Questions[ques].Question)
        setRequired(formDetail.Questions[ques].Required);

        if (formDetail.Questions[ques].Type === 'multi-choice' || formDetail.Questions[ques].Type === 'checkbox' || formDetail.Questions[ques].Type === 'dropdown')
            setOptionList(formDetail.Questions[ques].Content.MultiChoice.Options)
        else if (formDetail.Questions[ques].Type === 'file') {
            setMaxFileAmount(formDetail.Questions[ques].Content.File.MaxFileAmount);
            setMaxFileSize(formDetail.Questions[ques].Content.File.MaxFileSize);
            setFileType(formDetail.Questions[ques].Content.File.FileType)
        }
        else if (formDetail.Questions[ques].Type === "date-single" || formDetail.Questions[ques].Type === 'date-range') {
            setDateNum(formDetail.Questions[ques].Content.Date)
        }
        else if (formDetail.Questions[ques].Type === "table") {
            setColumnList(formDetail.Questions[ques].Content.Table.ListOfColumn)
        }
        else if (formDetail.Questions[ques].Type === "OTPInput"){
            setOTPNumber(formDetail.Questions[ques].Content.OtpInput)
        }

        if (formDetail.Questions[ques].Type === 'checkbox') {
            setConstraint(formDetail.Questions[ques].Content.MultiChoice.Constraint)
            setMaxOptions(formDetail.Questions[ques].Content.MultiChoice.MaxOptions)
        }

        setQuesEdit(ques);
        setHasChange(true); //enabled button 'Lưu thay đổi'
    }

    //number: 0-5 with 6 type
    const [dateNum, setDateNum] = useState<number>(-1)
    const handleDateNum = (e) => {
        setDateNum(e.target.value);
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

    const [hasChange, setHasChange] = useState<boolean>(false);

    const confirmSaveChange = () => {
        setSubOpen('save');
    }

    const saveChange = () => {
        updateObjectInDatabase({
            "questionOrder": formDetail.QuestionOrder,
            "questions": formDetail.Questions
        })

        setHasChange(false);
        setSubOpen("")
    }

    const [OTPNumber, setOTPNumber] = useState<number>(12);

    console.log(formDetail);

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
                        <Button
                            onClick={handleOpenEditModal}
                            sx={{ p: 2, fontWeight: 500, color: 'black', textTransform: 'initial', fontSize: '15px' }}>
                            Sửa chủ đề
                        </Button>
                        <Divider />
                        {
                            formState ?
                                <Button
                                    onClick={confirmFormState("closeForm")}
                                    sx={{ p: 2, fontWeight: 500, color: 'black', textTransform: 'initial', fontSize: '15px' }}>Đóng Form
                                </Button> :
                                <Button
                                    onClick={confirmFormState("openForm")}
                                    sx={{ p: 2, fontWeight: 500, color: 'black', textTransform: 'initial', fontSize: '15px' }}>Mở Form
                                </Button>
                        }
                    </Popover>
                </Box>

                <Divider />

                {/* Form Description */}
                <Typography sx={{ marginY: '10px', paddingLeft: '12px', }} variant='body1' component="div">
                    {Object.keys(formDetail).length !== 0 ? formDetail.header.Description : null}
                </Typography>

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
                    <Box>
                        <TableContainer component={Paper} sx={{ marginTop: '10px', height: '50vh', overflowY: 'scroll' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ padding: 1, paddingLeft: 5, fontWeight: 800, fontSize: '1rem' }} align="left">STT</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="left">Tiêu đề</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="left">Dạng</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="left">Ghi chú</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 800, fontSize: '1rem' }} align="center">Thao tác</TableCell>
                                    </TableRow >
                                </TableHead>
                                <TableBody>
                                    {formDetail.Questions !== undefined ? formDetail.QuestionOrder.map((ques, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{ padding: 1, paddingLeft: 5, fontWeight: 500, fontSize: '1.05rem' }} component="th" scope="row" align="left">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{formDetail.Questions[ques].Question}</TableCell>
                                            <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{jsonData[formDetail.Questions[ques].Type]}</TableCell>
                                            <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{formDetail.Questions[ques].Description}</TableCell>
                                            <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">
                                                <CircleButton tooltip='Chỉnh sửa' onClick={editQuestion(ques, index)} children={<EditIcon />} />
                                                <CircleButton tooltip='Sao chép' onClick={handleDuplicate(ques, index)} children={<ContentCopyIcon />} />
                                                <CircleButton tooltip='Di chuyển lên' onClick={handleSwapUp(ques, index)} children={<ArrowCircleUpIcon />} />
                                                <CircleButton tooltip='Di chuyển xuống' onClick={handleSwapDown(ques, index)} children={<ArrowCircleDownIcon />} />
                                                <CircleButton tooltip='Xóa' onClick={handleDeleteQuestion(ques)} children={<DeleteIcon />} />
                                            </TableCell>
                                        </TableRow>
                                    )) : null
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AcceptButton title='Thêm câu hỏi' onClick={handleOpen} style={{ marginTop: '15px' }} />
                            {hasChange ?
                                <AcceptButton title='Lưu thay đổi' onClick={confirmSaveChange} style={{ marginTop: '15px' }} /> :
                                <AcceptButton title='Lưu thay đổi' disabled={true} onClick={confirmSaveChange} style={{ marginTop: '15px', backgroundColor: 'gray' }} />}
                        </Box>
                    </Box>}
            </Box >

            {typeView === 'ViewResponses' &&
                <Responses form={formDetail} responses={formResponses} />
            }

            <MainModal
                open={open}
                setOpen={setOpen}
                formDetail={formDetail}
                type={type}
                setType={setType}
                tempType={tempType}
                setTempType={setTempType}
                titleQuestion={titleQuestion}
                setTitleQuestion={setTitleQuestion}
                required={required}
                setRequired={setRequired}

                constraint={constraint}
                handleConstraint={handleConstraint}
                setConstraint={setConstraint}
                maxOptions={maxOptions}
                handleMaxOptions={handleMaxOptions}
                setMaxOptions={setMaxOptions}

                columnList={columnList}
                setColumnList={setColumnList}
                columnType={columnType}
                setColumnType={setColumnType}
                handleColumnType={handleColumnType}

                maxFileAmount={maxFileAmount}
                setMaxFileAmount={setMaxFileAmount}
                handleMaxFileAmount={handleMaxFileAmount}
                maxFileSize={maxFileSize}
                setMaxFileSize={setMaxFileSize}
                handleMaxFileSize={handleMaxFileSize}
                fileType={fileType}
                setFileType={setFileType}

                dateNum={dateNum}
                setDateNum={setDateNum}
                handleDateNum={handleDateNum}

                excelData={excelData}
                setExcelData={setExcelData}
                fields={fields}
                myObject={myObject}
                handleSubOpen={handleSubOpen}
                optionList={optionList}
                setOptionList={setOptionList}
                quesEdit={quesEdit}
                setQuesEdit={setQuesEdit}

                indexOptionTable={indexOptionTable}
                setIndexOptionTable={setIndexOptionTable}

                setHasChange={setHasChange}

                OTPNumber={OTPNumber}
                setOTPNumber={setOTPNumber}
            />

            <SubModal
                subopen={subopen}
                handleSubClose={handleSubClose}
                excelData={excelData}
                type={type}
                setExcelData={setExcelData}
                handleProcessRowUpdate={handleProcessRowUpdate}
                columns={columns}
                handleSaveLinkedData={handleSaveLinkedData}
                inputText={inputText}
                setInputText={setInputText}
                handleInputText={handleInputText}
                convertTextToOptionList={convertTextToOptionList}

                handleCloseForm={handleCloseForm}
                handleOpenForm={handleOpenForm}

                saveChange={saveChange}

                solveOptionTable={solveOptionTable}
            />

            <EditModal
                openEditModal={openEditModal}
                setOpenEditModal={setOpenEditModal}
                formDetail={formDetail}
                updateObjectInDatabase={updateObjectInDatabase}
                setRender={setRender}
                render={render}
            />

        </Box >
    )
}

export default DetailForm
