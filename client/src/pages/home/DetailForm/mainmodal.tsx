import React, { useState, useEffect, useLayoutEffect } from 'react'

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import Button from '@mui/material/Button';

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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DateRangeIcon from '@mui/icons-material/DateRange';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useParams } from 'react-router-dom';
import Alert, { AlertProps } from '@mui/material/Alert';

import { Question, ShortText, MultiChoice, Date, LinkedData, File } from './interface';
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

const typeOfFile = ['Tài liệu', 'Bảng tính', 'PDF', 'Hình ảnh', 'Video'];

const myRecordType: Record<string, string> = {
    //Đuôi docx
    "Tài liệu": 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //Đuôi .xlsx
    "Bảng tính": 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //Đuôi .pdf
    "PDF": 'application/pdf',
    //Đuối .png và .jpg
    "Hình ảnh": 'image/png',
    //Đuôi .mp4
    "Video": 'video/mp4',
};

export function MainModal(props) {
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

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const dataFromServer = await response.json();
            // Xử lý dữ liệu từ máy chủ (nếu cần)
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };

    const [error, setError] = useState<Boolean>(false)

    // Add question to a form 
    // addQuestion(editQues): nếu editQues = -1 => tạo ques mới
    // nếu editQues >= 0 thì: ghi đè content lên ques cũ (vì đổi type)
    const addQuestion = async () => {
        if (props.type === '' || props.titleQuestion === '') {
            setError(true);
        }
        else if (props.type === 'file' && props.fileType.length === 0) {
            setTypeError('Vui lòng chọn các loại file được cho phép')
        }
        else {
            const newQuestion: Question = {
                Question: props.titleQuestion,
                Description: "",
                Required: props.required,
                ImagePath: "",
                Type: props.type,
                Content: {}
            };

            let ques = props.quesEdit;

            if (props.quesEdit === -1) {
                // Tạo một Question có 5 trường: Question, Description, Required, ImagePath, Type, Content
                props.formDetail.Questions.push(newQuestion);

                // Push index vào QuestionOrder
                const newIndex = props.formDetail.Questions.length - 1;
                props.formDetail.QuestionOrder.push(newIndex);

                ques = newIndex;
            }

            // Lấy Object: Options có chứa Option[] và ImportedData
            if (props.type === "multi-choice" || props.type === "checkbox" || props.type === "dropdown") {
                const updateMultiChoice: MultiChoice = {
                    MultiChoice: {
                        Options: props.optionList,
                        Constraint: props.constraint,
                        MaxOptions: props.maxOptions
                    }
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateMultiChoice);
            }
            else if (props.type === "shortText") {
                const updateShortText: ShortText = {
                    shortText: true
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateShortText);
            }
            else if (props.type === "date-single" || props.type === "date-range") {
                const updateDate: Date = {
                    date: dateNum
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateDate);
            }
            else if (props.type === "file") {
                const updateFile: File = {
                    File: {
                        MaxFileSize: props.maxFileSize,
                        FileType: props.fileType,
                        MaxFileAmount: props.maxFileAmount,
                    }
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateFile);
            }
            else if (props.type === "linkedData") {
                const updateLinkedData: LinkedData = {
                    LinkedData: {
                        ImportedLink: props.fields,
                        ListOfOptions: props.myObject,
                    }
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateLinkedData);
            }

            updateObjectInDatabase({
                "questionOrder": props.formDetail.QuestionOrder,
                "questions": props.formDetail.Questions
            })

            setError(false);
            handleClose();
        }
    };

    // Save question after Edit
    const saveQuestion = () => {
        props.formDetail.Questions[props.quesEdit].Type = props.type;
        props.formDetail.Questions[props.quesEdit].Question = props.titleQuestion;
        props.formDetail.Questions[props.quesEdit].Required = props.required;

        // Nếu có đổi type => gọi addQuestion
        if (props.tempType === props.type) {
            if (props.type === "multi-choice" || props.type === "checkbox" || props.type === "dropdown") {
                props.formDetail.Questions[props.quesEdit].Content.MultiChoice.Options = props.optionList;

                if (props.type === "checkbox") {
                    props.formDetail.Questions[props.quesEdit].Content.MultiChoice.Constraint = props.constraint;
                    if (props.constraint === 'at-most')
                        props.formDetail.Questions[props.quesEdit].Content.MultiChoice.MaxOptions = props.maxOptions;
                }
            }
            else if (props.type === 'file') {
                props.formDetail.Questions[props.quesEdit].Content.File.MaxFileSize = props.maxFileSize;
                props.formDetail.Questions[props.quesEdit].Content.File.FileType = props.fileType;
                props.formDetail.Questions[props.quesEdit].Content.File.MaxFileAmount = props.maxFileAmount;
            }

            updateObjectInDatabase({
                "questionOrder": props.formDetail.QuestionOrder,
                "questions": props.formDetail.Questions
            })

            handleClose();
        } else {
            addQuestion();
        }
    }

    // Close MainModal Edit
    const handleClose = () => {
        props.setOpen(false);

        // return default value when open modal: type and title
        props.setType('');
        props.setTitleQuestion('');
        props.setRequired(false);
        setError(false);

        // return default value when open modal: multi-choice TYPE
        if (props.type === "multi-choice" || props.type === "checkbox" || props.type === "dropdown") {
            props.setOptionList(['']);
            setActive(-1);
            if (props.type === "checkbox") {
                props.setConstraint('no-limit')
                props.setMaxOptions(2)
            }
        }
        else if (props.type === "file") {
            props.setMaxFileSize(10240);
            props.setFileType([]);
            props.setMaxFileAmount(1);
        }
        else if (props.type === "linkedData") {
            setFile('');
            props.setExcelData([]);
        }
        else if (props.type === "date-single" || props.type === "date-range") {
            setDateNum(-1);
        }
        props.setQuesEdit(-1)
    }

    // Get Type of question
    const handleChangeType = (event: SelectChangeEvent) => {
        props.setType(event.target.value as string);

        if (props.type === 'date-single') {
            if (dateNum === 1) setDateNum(5);
            else if (dateNum === 2) setDateNum(6);
            else if (dateNum === 3) setDateNum(7);
            else if (dateNum === 4) setDateNum(8);
        }
        else if (props.type === 'date-range') {
            if (dateNum === 5) setDateNum(1);
            else if (dateNum === 6) setDateNum(2);
            else if (dateNum === 7) setDateNum(3);
            else if (dateNum === 8) setDateNum(4);
        }
    }

    // Get Title of question 
    const handleTitleQuestion = (e) => {
        props.setTitleQuestion(e.target.value);
        if (props.type !== '') setError(false);
    }

    // Get question isRequired or not
    const handleChangeRequired = (e) => props.setRequired(!props.required);

    // convert Multi-choice <-> Checkbox
    const convertType = (e) => {
        if (props.type === 'multi-choice') props.setType('checkbox');
        else if (props.type === 'checkbox') props.setType('multi-choice');
        else if (props.type === 'date-single') {
            props.setType('date-range');

            if (dateNum === 1) setDateNum(5);
            else if (dateNum === 2) setDateNum(6);
            else if (dateNum === 3) setDateNum(7);
            else if (dateNum === 4) setDateNum(8);
        }
        else if (props.type === 'date-range') {
            props.setType('date-single');

            if (dateNum === 5) setDateNum(1);
            else if (dateNum === 6) setDateNum(2);
            else if (dateNum === 7) setDateNum(3);
            else if (dateNum === 8) setDateNum(4);
        }
    }

    // Xử lý câu hỏi multi-choice và checkbox
    const [optionValue, setOptionValue] = useState(''); //Lưu value của option
    const handleOptionChange = (e) => {
        setOptionValue(e.target.value);
    };

    // active === index thì value của TextField sẽ thay đổi
    const [active, setActive] = useState<number>(-1);
    const handleActive = (index: number) => (e) => {
        setActive(index);
        setOptionValue(props.optionList[index]);
    }

    // Khi onBlur thì sẽ lưu value vào mảng options[]
    const saveOption = (index: number) => (e) => props.optionList[index] = optionValue;

    // Thêm option trống 
    const handleOption = () => props.setOptionList([...props.optionList, ''])

    //Handle type of file
    const handleChangeCheckbox = (e) => {
        if (e.target.checked) {
            switch (e.target.value) {
                case 'Tài liệu': //File docx
                    props.setFileType([...props.fileType, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                    break;
                case 'Bảng tính': // File Excel (.xlsx)
                    props.setFileType([...props.fileType, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
                    break;
                case 'PDF': //File pdf
                    props.setFileType([...props.fileType, 'application/pdf']);
                    break;
                case 'Hình ảnh': //File jpg và png
                    props.setFileType([...props.fileType, 'image/png', 'image/jpeg']);
                    break;
                case 'Video':
                    props.setFileType([...props.fileType, 'video/mp4']);
                    break;
                default:
                    break;
            }
            setTypeError('');
        }
        else {
            switch (e.target.value) {
                case 'Tài liệu': //File docx
                    let array = props.fileType.filter(item => item !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                    props.setFileType(array);
                    break;
                case 'Bảng tính': // File Excel (.xlsx)
                    let array2 = props.fileType.filter(item => item !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    props.setFileType(array2);
                    break;
                case 'PDF': //File pdf
                    let array3 = props.fileType.filter(item => item !== 'application/pdf');
                    props.setFileType(array3);
                    break;
                case 'Hình ảnh': //File jpg và png
                    let array4 = props.fileType.filter(item => item !== 'image/jpeg');
                    let array5 = array4.filter(item => item !== 'image/png')
                    props.setFileType(array5);
                    break;
                case 'Video':
                    let array6 = props.fileType.filter(item => item !== 'video/mp4');
                    props.setFileType(array6);
                    break;
                default:
                    break;
            }
            // if (props.fileType.length === 0) setTypeError('Vui lòng chọn loại file được cho phép');
        }
    };
    console.log(props.fileType)

    // Process file -> linkedData
    const [file, setFile] = useState<string>('');
    const handleFileChange = (e) => {
        let fileType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        let selectedFile = e.target.files[0];

        if (selectedFile) {
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
    const [typeError, setTypeError] = useState<string>(''); //Display error when upload invalid file

    //number: 0-5 with 6 type
    const [dateNum, setDateNum] = useState<number>(-1)
    const handleDateNum = (e) => {
        setDateNum(e.target.value);
    }

    console.log(props.formDetail)

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

                    <Box component="form" sx={{ mt: '10px', mb: '5px', display: 'flex', alignItems: 'center' }}>
                        <TextField
                            required
                            value={props.titleQuestion}
                            onChange={handleTitleQuestion}
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
                                onChange={handleChangeType}
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
                                <MenuItem value={'dropdown'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <ArrowDropDownCircleIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Menu thả xuống
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'date-single'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <EventIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Mốc thời gian
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'date-range'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <DateRangeIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            Khoảng thời gian
                                        </ListItemText>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'file'}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <AttachFileIcon sx={{ marginRight: '10px', color: '#6D7073' }} />
                                        <ListItemText>
                                            File
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
                    {props.type === 'multi-choice' || props.type === 'checkbox' || props.type === 'dropdown' ?
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                {
                                    props.optionList.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                            {props.type === 'multi-choice' && <RadioButtonUncheckedIcon
                                                sx={{ color: 'gray', marginRight: '10px' }}
                                            />}
                                            {props.type === 'checkbox' && <CheckBoxOutlineBlankIcon
                                                sx={{ color: 'gray', marginRight: '10px' }}
                                            />}
                                            {props.type === 'dropdown' &&
                                                <Typography sx={{ color: 'gray', marginRight: '10px' }}>
                                                    {index + 1}.
                                                </Typography>
                                            }
                                            <TextField
                                                value={index === active ? optionValue : props.optionList[index]}
                                                onChange={handleOptionChange}
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
                            </Box>
                            <Box>
                                <Button
                                    sx={{ width: '30%', fontSize: '1.1rem', color: '#364F6B', paddingY: '10px', marginBottom: '10px', textTransform: 'initial', borderRadius: '20px' }}
                                    onClick={handleOption}
                                >
                                    <AddIcon />
                                    Thêm lựa chọn
                                </Button>
                                <Button
                                    sx={{ width: '40%', fontSize: '1.1rem', color: '#364F6B', paddingY: '10px', marginBottom: '10px', textTransform: 'initial', borderRadius: '20px' }}
                                    onClick={props.handleSubOpen}
                                >
                                    <AddIcon />
                                    Thêm nhiều lựa chọn
                                </Button>
                            </Box>
                            {props.type === 'checkbox' ?
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '15px' }}>
                                    <Typography sx={{ paddingRight: '10px', fontWeight: 'bold' }}>Chọn tổng số lựa chọn:</Typography>
                                    <FormControl sx={{ width: '30%', paddingRight: '10px' }}>
                                        <Select
                                            value={props.constraint}
                                            onChange={props.handleConstraint}
                                        >
                                            <MenuItem disabled={props.optionList < 2} value={'no-limit'}> Không giới hạn </MenuItem>
                                            <MenuItem disabled={props.optionList < 2} value={'at-most'}> Tối đa </MenuItem>
                                        </Select>
                                    </FormControl>
                                    {props.constraint === 'at-most' ? <FormControl sx={{ width: '10%' }}>
                                        <Select
                                            value={props.maxOptions}
                                            onChange={props.handleMaxOptions}
                                        >
                                            {props.optionList.slice(1).map((item, index) => (
                                                <MenuItem key={index} value={index + 2}> {index + 2} </MenuItem>
                                            ))
                                            }
                                        </Select>
                                    </FormControl>
                                        : null}
                                </Box>
                                : null}
                        </Box >
                        : null
                    }
                    {props.type === 'shortText' ?
                        <TextField disabled sx={{ width: '100%' }} id="standard-basic" label="Nhập câu trả lời" variant="standard" />
                        : null
                    }
                    {props.type === 'date-single' || props.type === 'date-range' ?
                        <Box sx={{ margin: '5px' }}>
                            <Typography sx={{ width: '100%', marginY: '10px', color: 'gray' }}><b>Chọn định dạng</b></Typography>
                            <FormControl sx={{ width: '50%' }}>
                                <Select
                                    value={dateNum}
                                    onChange={handleDateNum}
                                >
                                    <MenuItem value={props.type === 'date-single' ? 1 : 5}> Ngày/Tháng/Năm </MenuItem>
                                    <MenuItem value={props.type === 'date-single' ? 2 : 6}> Tháng/Năm </MenuItem>
                                    <MenuItem value={props.type === 'date-single' ? 3 : 7}> Năm </MenuItem>
                                    <MenuItem value={props.type === 'date-single' ? 4 : 8}> Giờ </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        : null
                    }
                    {props.type === 'file' ?
                        <Grid container spacing={1}>
                            <Grid item xs={6} sx={{ marginBottom: '5px' }}>
                                <Typography sx={{ marginY: '10px', color: 'gray' }}>Số lượng tệp tối đa</Typography>
                                <FormControl sx={{ width: '100%' }}>
                                    <Select
                                        value={props.maxFileAmount}
                                        onChange={props.handleMaxFileAmount}
                                    >
                                        <MenuItem value={1}> 1 </MenuItem>
                                        <MenuItem value={5}> 5 </MenuItem>
                                        <MenuItem value={10}> 10 </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ marginY: '10px', color: 'gray' }}>Kích thước tệp tối đa</Typography>
                                <FormControl sx={{ width: '100%' }}>
                                    <Select
                                        value={props.maxFileSize}
                                        onChange={props.handleMaxFileSize}
                                    >
                                        <MenuItem value={1024}> 1 MB</MenuItem>
                                        <MenuItem value={10240}> 10 MB</MenuItem>
                                        <MenuItem value={100000}> 100 MB</MenuItem>
                                        <MenuItem value={1048576}> 1 GB</MenuItem>
                                        <MenuItem value={10240000}> 10 GB</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{ color: 'gray', paddingBottom: '10px' }}>Vui lòng chọn các loại file cụ thể</Typography>
                                <FormGroup>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            {typeOfFile.map((item, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    onChange={handleChangeCheckbox}
                                                    // onBlur={checkErrCheckbox(ques)}
                                                    checked={props.fileType.includes(myRecordType[item])}
                                                    value={item}
                                                    control={<Checkbox />}
                                                    label={item}
                                                />
                                            ))}
                                        </Grid>
                                    </Grid>
                                </FormGroup>
                                {typeError !== '' ? <Alert severity="error">{typeError}</Alert> : null}
                            </Grid>
                        </Grid>
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
                                    {typeError !== '' ? <Alert severity="error">{typeError}</Alert> : null}
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
                                <FormControlLabel control={<Switch checked={props.required}
                                    onChange={handleChangeRequired} />} label="Bắt buộc"
                                />
                                {props.type === 'multi-choice' &&
                                    <FormControlLabel control={<Switch defaultChecked={false}
                                        onChange={convertType}
                                    />} label="Nhiều lựa chọn"
                                    />
                                }
                                {props.type === 'checkbox' &&
                                    <FormControlLabel control={<Switch defaultChecked={true}
                                        onChange={convertType}
                                    />} label="Nhiều lựa chọn"
                                    />
                                }
                                {props.type === 'date-range' &&
                                    <FormControlLabel control={<Switch defaultChecked={true}
                                        onChange={convertType}
                                    />} label="Khoảng thời gian"
                                    />
                                }
                                {props.type === 'date-single' &&
                                    <FormControlLabel control={<Switch defaultChecked={false}
                                        onChange={convertType}
                                    />} label="Khoảng thời gian"
                                    />
                                }
                            </FormGroup>
                        </Box>
                    }
                    {error && <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Vui lòng điền tiêu đề và lựa chọn dạng câu hỏi</Alert>}
                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                        {props.quesEdit === -1 ? <Button
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
                            Thêm
                        </Button> :
                            <Button
                                onClick={saveQuestion}
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
                            </Button>}
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
        </div >
    )
}

