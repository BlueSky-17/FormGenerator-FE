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

// Style cho modal edit
const style = {
    position: 'fixed',
    top: '15%',
    left: '50%',
    marginLeft: '-350px',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

export function MainModal(props) {

    console.log(props.fields)
    
    const UpdateFormAPI_URL = `http://localhost:8080/update-form/${useParams()?.formID}`;

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

    console.log('re-render: MainModal')

    // Add question to a form 
    const addQuestion = async () => {
        const newQuestion: Question = {
            Question: textFieldValue,
            Description: "",
            Required: required,
            ImagePath: "",
            Type: props.type,
            Content: {}
        };

        // Tạo một Question có 5 trường: Question, Description, Required, ImagePath, Type, Content
        props.formDetail.Questions.push(newQuestion);

        // Push index vào QuestionOrder
        const newIndex = props.formDetail.Questions.length - 1;
        props.formDetail.QuestionOrder.push(newIndex);

        // Lấy Object: Options có chứa Option[] và ImportedData
        if (props.type === "multi-choice") {
            const updateMultiChoice: MultiChoice = {
                MultiChoice: {
                    Options: optionFieldValueArray,
                    ImportedData: ''
                }
            };

            Object.assign(props.formDetail.Questions[newIndex].Content, updateMultiChoice);
        }
        else if (props.type === "shortText") {
            const updateShortText: ShortText = {
                shortText: ''
            };

            Object.assign(props.formDetail.Questions[newIndex].Content, updateShortText);
        }
        else if (props.type === "datePicker") {
            const updateDate: Date = {
                date: ''
            };

            Object.assign(props.formDetail.Questions[newIndex].Content, updateDate);
        }
        else if (props.type === "linkedData") {
            const updateLinkedData: LinkedData = {
                LinkedData: {
                    ImportedLink: props.fields,
                    ListOfOptions: props.myObject,
                }
            };

            Object.assign(props.formDetail.Questions[newIndex].Content, updateLinkedData);
        }

        updateObjectInDatabase({
            "questionOrder": props.formDetail.QuestionOrder,
            "questions": props.formDetail.Questions
        })

        handleClose();
    };

    // Close MainModal Edit
    const handleClose = () => {
        props.setOpen(false);

        // return default value when open modal: type and title
        props.setType('');
        setTextFieldValue('');

        // return default value when open modal: multi-choice TYPE
        if (props.type === "multi-choice" || props.type === "checkbox") {
            setOptionFieldValueArray(['']);
            setActive(-1);
        }
        else if (props.type === "linkedData") {
            setFile('');
            props.setExcelData([]);
        }
    }

    // Set title of question
    const [textFieldValue, setTextFieldValue] = useState('');
    const handleTextFieldChange = (e) => setTextFieldValue(e.target.value);

    // Set question isRequired or not
    const [required, setRequired] = useState(false);
    const handleChangeRequired = (e) => setRequired(!required);

    // Xử lý câu hỏi multi-choice và checkbox
    const [optionFieldValue, setOptionFieldValue] = useState(''); //Lưu value của option
    const [optionFieldValueArray, setOptionFieldValueArray] = useState<string[]>(['']); //Lưu value của mảng các option
    const handleOptionFieldChange = (e) => {
        setOptionFieldValue(e.target.value);
    };

    // active === index thì value của TextField sẽ thay đổi
    const [active, setActive] = useState<number>(-1);
    const handleActive = (index: number) => (e) => {
        setActive(index);
        setOptionFieldValue(optionFieldValueArray[index]);
    }

    // Khi onBlur thì sẽ lưu value vào mảng options[]
    const saveOption = (index: number) => (e) => optionFieldValueArray[index] = optionFieldValue;

    // Thêm option trống 
    const handleOption = () => setOptionFieldValueArray([...optionFieldValueArray, ''])

    //Tùy chỉnh file: onchange state
    const [file, setFile] = useState<string>('');
    const handleFileChange = (e) => {
        let fileType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        let selectedFile = e.target.files[0];
        console.log(e.target.files[0]);

        if (selectedFile) {
            console.log(selectedFile.type);
            if (selectedFile && fileType.includes(selectedFile.type)) {
                setTypeError('');
                setFile(e.target.files[0]);
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target && event.target.result) {
                        const fileContent = event.target.result as ArrayBuffer;

                        // Convert ArrayBuffer to binary string
                        const binaryString = String.fromCharCode.apply(null, Array.from(new Uint8Array(fileContent)));

                        // Read Excel data
                        const workbook = XLSX.read(binaryString, { type: 'binary' });
                        const worksheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[worksheetName];
                        const data: {}[] = XLSX.utils.sheet_to_json(worksheet);

                        const rows = data.map((obj, index) => ({ ...obj, id: index }));

                        props.setExcelData(rows);
                        // setRows(rows); //có id
                        console.log(data);
                    }
                };
                reader.readAsArrayBuffer(selectedFile);
            }
            else {
                setTypeError('Vui lòng lựa chọn dạng file excel');
                setFile('');
            }
        }
        else {
            console.log('Vui lòng chọn file!');
        }

    };
    const [typeError, setTypeError] = useState<string>();
    //submit state

    const [textInDropdown, setTextInDropdown] = useState('');
    const handleTextInDropdown = (e) => {
        setTextInDropdown(e.target.value)
    }

    return (
        <div>
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant='h6' component="div">
                        Chỉnh sửa câu hỏi
                    </Typography>

                    <Box component="form" sx={{ marginY: '10px', display: 'flex', alignItems: 'center' }}>
                        <TextField
                            required
                            value={textFieldValue}
                            onChange={handleTextFieldChange}
                            sx={{ marginRight: '10px', width: '100%' }}
                            id="outlined-basic"
                            variant="outlined"
                            placeholder='Nhập nội dung câu hỏi...'
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Dạng</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={props.type}
                                label="Dạng"
                                onChange={props.handleChangeType}
                            >
                                <MenuItem value={'shortText'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <NotesIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Điền ngắn
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'multi-choice'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <RadioButtonCheckedIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Trắc nghiệm
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'checkbox'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CheckBoxIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Ô đánh dấu
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'dropDown'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <ArrowDropDownCircleIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Menu thả xuống
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'datePicker'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <EventIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Lịch
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'linkedData'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <DatasetLinkedIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Dữ liệu liên kết
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {props.type === 'multi-choice' || props.type === 'checkbox' ?
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {
                                optionFieldValueArray.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                        {props.type === 'multi-choice' && <RadioButtonUncheckedIcon
                                            sx={{ color: 'gray', marginRight: '10px' }}
                                        />}
                                        {props.type === 'checkbox' && <CheckBoxOutlineBlankIcon
                                            sx={{ color: 'gray', marginRight: '10px' }}
                                        />}
                                        <TextField
                                            value={index === active ? optionFieldValue : optionFieldValueArray[index]}
                                            onChange={handleOptionFieldChange}
                                            onBlur={saveOption(index)}
                                            onClick={handleActive(index)}
                                            sx={{ marginRight: '10px', width: '100%' }}
                                            // id={index.toString()}
                                            variant="standard"
                                        />
                                        <IconButton
                                            // onClick={deleteQuestion(ques)}
                                            sx={{
                                                backgroundColor: '#white',
                                                color: '#7B7B7B',
                                                margin: '5px',
                                                '&:hover': {
                                                    backgroundColor: '#EBEBEB', // Màu nền thay đổi khi hover
                                                },
                                            }}>
                                            <ClearIcon />
                                        </IconButton>
                                    </Box>
                                ))
                            }
                            <Button
                                sx={{ width: '30%', fontSize: '1.1rem', color: '#364F6B', paddingY: '10px', marginBottom: '10px', textTransform: 'initial', borderRadius: '20px' }}
                                onClick={handleOption}
                            >
                                <AddIcon />
                                Thêm lựa chọn
                            </Button>
                        </Box >
                        : null
                    }
                    {props.type === 'shortText' ?
                        <TextField disabled sx={{ width: '100%' }} id="standard-basic" label="Nhập câu trả lời" variant="standard" />
                        : null
                    }
                    {props.type === 'dropDown' ?
                        <Box>
                            <Typography sx={{ color: '#6D7073', marginBottom: '15px' }}>Nhập <b>mỗi lựa chọn</b> là <b> một dòng</b></Typography>
                            <TextField
                                value={textInDropdown}
                                onChange={handleTextInDropdown}
                                id="outlined-multiline-flexible"
                                multiline
                                rows={5}
                                sx={{ width: '100%' }}
                            />
                            <Button
                                onClick={props.handleSubOpen}
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#364F6B',
                                    borderRadius: '10px',
                                    paddingY: '10px',
                                    paddingX: '5px',
                                    marginTop: '10px',
                                    width: '100%',
                                    '&:hover': {
                                        backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                    }
                                }}>
                                Xử lý dữ liệu
                            </Button>
                        </Box>
                        : null
                    }
                    {props.type === 'linkedData' ?
                        <Box>
                            <Box sx={{ color: '#6D7073', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ color: '#6D7073', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                    <Typography>Nhập</Typography>
                                    <Button
                                        sx={{ color: '#364F6B', textTransform: 'lowercase', padding: 0, fontSize: '16px', paddingX: '3px' }}
                                        component="label"
                                    >
                                        1 file excel
                                        <input
                                            onChange={handleFileChange}
                                            type="file"
                                            hidden
                                        />
                                    </Button>
                                    <Typography>để thêm trường dữ liệu</Typography>
                                </Box>
                                <Box>
                                    {typeError && <Alert severity="error">{typeError}</Alert>}
                                    {file !== '' && <Alert severity="success">Chọn file thành công!</Alert>}
                                </Box>
                                {/* để thêm trường dữ liệu liên kết */}
                            </Box>
                            {file !== '' && <Button
                                onClick={props.handleSubOpen}
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#364F6B',
                                    borderRadius: '10px',
                                    paddingY: '10px',
                                    paddingX: '5px',
                                    marginTop: '10px',
                                    width: '100%',
                                    textTransform: 'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                    }
                                }}>
                                Xem  | Chỉnh sửa
                            </Button>
                            }
                        </Box>
                        : null
                    }

                    {props.type !== '' &&
                        <Box>
                            <Divider />
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '5px' }}>
                                <FormControlLabel control={<Switch checked={required}
                                    onChange={handleChangeRequired} />} label="Bắt buộc"
                                />
                                {props.type === 'multi-choice' &&
                                    <FormControlLabel control={<Switch defaultChecked={false} />} label="Nhiều lựa chọn"
                                    />
                                }
                                {props.type === 'checkbox' &&
                                    <FormControlLabel control={<Switch defaultChecked={false} />} label="Một lựa chọn"
                                    />
                                }
                            </FormGroup>
                        </Box>
                    }

                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                        <Button
                            onClick={addQuestion}
                            sx={{
                                color: 'white',
                                backgroundColor: '#364F6B',
                                borderRadius: '10px',
                                marginY: '10px',
                                marginX: '5px',
                                '&:hover': {
                                    backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                                },
                            }}>
                            Lưu
                        </Button>
                        <Button
                            onClick={handleClose}
                            sx={{
                                color: '#000000',
                                backgroundColor: '#E7E7E8',
                                borderRadius: '10px',
                                marginY: '10px',
                                marginX: '5px',
                                '&:hover': {
                                    backgroundColor: '#E7E7E7', // Màu nền thay đổi khi hover
                                },
                            }}>
                            Hủy
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

