import React, { useState, useEffect, useLayoutEffect } from 'react'

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import Button from '@mui/material/Button';

import ClearIcon from '@mui/icons-material/Clear';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useParams } from 'react-router-dom';
import Alert, { AlertProps } from '@mui/material/Alert';

import { Question, ShortText, MultiChoice, Date, LinkedData, File, Table, SpecialText, OTPInput } from './interface';
import * as XLSX from 'xlsx'
import { LensBlur } from '@mui/icons-material';
import AcceptButton from '../../../components/custom-button/acceptButton';
import CancelButton from '../../../components/custom-button/cancelButton';

import { typeOfFile, myRecordType } from '../../../constants/typeOfFile';
import { modalStyle } from '../home.page';
import SelectType from '../../../components/select-type/select-type';
import SwitchType from '../../../components/custom-switch/switch-type';

export function MainModal(props) {
    //API to get type of a question by Random Forest
    const getType = async (sentence) => {
        const API_URL: string = `http://localhost:5000/predict`;
        const sentenceJson = {
            sentence: sentence
        };
        let label: any;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sentenceJson)
            });


            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            label = data.label[0];
            console.log('Label:', label);

            changeType(label);

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
            else if (props.type === "shortText" || props.type === 'longText') {
                const updateShortText: ShortText = {
                    shortText: props.type === "shortText" ? true : false
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateShortText);
            }
            else if (props.type === "email" || props.type === 'phone') {
                const updateSpecialText: SpecialText = {
                    specialText: props.type
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateSpecialText);
            }
            else if (props.type === "OTPInput") {
                const updateOTPInput: OTPInput = {
                    OtpInput: props.OTPNumber as number
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateOTPInput);
            }
            else if (props.type === "date-single" || props.type === "date-range") {
                const updateDate: Date = {
                    Date: props.dateNum
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
            else if (props.type === "table") {
                const updateTable: Table = {
                    Table: {
                        ListOfColumn: props.columnList
                    }
                };

                props.formDetail.Questions[ques].Content = {};
                Object.assign(props.formDetail.Questions[ques].Content, updateTable);
            }

            props.setHasChange(true);

            setActive(-1);
            setActiveType(-1);

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
            else if (props.type === 'date-single' || props.type === 'date-range') {
                props.formDetail.Questions[props.quesEdit].Content.Date = props.dateNum;
            }
            else if (props.type === 'table') {
                props.formDetail.Questions[props.quesEdit].Content.Table.ListOfColumn = props.columnList;
            }
            else if (props.type === 'OTPInput') {
                props.formDetail.Questions[props.quesEdit].Content.OtpInput = Number(props.OTPNumber);
                console.log(typeof(props.formDetail.Questions[props.quesEdit].Content.OtpInput))
            }

            props.setHasChange(true);
            setActive(-1);
            setActiveType(-1);

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
            props.setDateNum(-1);
        }
        else if (props.type === "table") {
            props.setColumnList([
                {
                    ColumnName: '',
                    Type: '',
                    Content: {}
                }
            ])
            setColumnName('');
            props.setColumnType('')
        }
        props.setQuesEdit(-1)
    }

    // Get Type of question
    const handleChangeType = (event: SelectChangeEvent) => {
        props.setType(event.target.value as string);

        if (props.type === 'date-single') {
            if (props.dateNum === 1) props.setDateNum(5);
            else if (props.dateNum === 2) props.setDateNum(6);
            else if (props.dateNum === 3) props.setDateNum(7);
            else if (props.dateNum === 4) props.setDateNum(8);
        }
        else if (props.type === 'date-range') {
            if (props.dateNum === 5) props.setDateNum(1);
            else if (props.dateNum === 6) props.setDateNum(2);
            else if (props.dateNum === 7) props.setDateNum(3);
            else if (props.dateNum === 8) props.setDateNum(4);
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
        switch (props.type) {
            case 'shortText':
                props.setType('longText');
                break;
            case 'longText':
                props.setType('shortText');
                break;
            case 'multi-choice':
                props.setType('checkbox');
                break;
            case 'checkbox':
                props.setType('multi-choice');
                break;
            case 'date-single':
                props.setType('date-range');
                switch (props.dateNum) {
                    case 1:
                        props.setDateNum(5);
                        break;
                    case 2:
                        props.setDateNum(6);
                        break;
                    case 3:
                        props.setDateNum(7);
                        break;
                    case 4:
                        props.setDateNum(8);
                        break;
                    default:
                        break;
                }
                break;
            case 'date-range':
                props.setType('date-single');
                switch (props.dateNum) {
                    case 5:
                        props.setDateNum(1);
                        break;
                    case 6:
                        props.setDateNum(2);
                        break;
                    case 7:
                        props.setDateNum(3);
                        break;
                    case 8:
                        props.setDateNum(4);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    // Xử lý câu hỏi multi-choice và checkbox
    const [optionValue, setOptionValue] = useState(''); //Lưu value của option
    const handleOptionChange = (e) => {
        setOptionValue(e.target.value);
    };

    const [columnName, setColumnName] = useState(''); //Lưu value của option
    const handleColumnName = (e) => {
        setColumnName(e.target.value);
    };

    // active === index thì value của TextField sẽ thay đổi
    const [active, setActive] = useState<number>(-1);
    const [activeType, setActiveType] = useState<number>(-1);
    const handleActive = (index: number, op: string) => (e) => { //op is handle 'option' or handle 'columnName'
        setActive(index);
        if (op === 'option') setOptionValue(props.optionList[index]);
        else if (op === 'columnName') setColumnName(props.columnList[index].ColumnName)
    }

    const handleActiveType = (index: number) => (e) => setActiveType(index);

    const [dateNum, setDateNum] = useState()
    const [activeDate, setActiveDate] = useState<number>(1);
    const handleActiveDate = (index: number) => (e) => {
        setActiveDate(index)
        setDateNum(e.target.value)
        props.columnList[index].Content.Date = e.target.value
    }

    // Khi onBlur thì sẽ lưu value vào mảng options[]
    const saveOption = (index: number) => (e) => props.optionList[index] = optionValue;
    const saveColumnName = (index: number) => (e) => props.columnList[index].ColumnName = columnName;

    // Thêm option trống 
    const handleOption = () => props.setOptionList([...props.optionList, ''])

    const deleteOption = (index: number) => (e) => {
        const newArray = [...props.optionList];
        newArray.splice(index, 1);
        props.setOptionList([...newArray]);
    }

    const addColumnTable = () => {
        props.setColumnList([...props.columnList, {
            ColumnName: '',
            Type: '',
            Content: {}
        }])
    }

    const handleOptionTable = (index: string) => (e) => {
        props.handleSubOpen()
        props.setIndexOptionTable(index)

        console.log(index);
    }

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

    //Recommend type
    const recommendType = (event) => {
        if (event.key === 'Enter') {
            getType(props.titleQuestion)
        }
    };

    const changeType = (label) => {
        if (label == '0') {
            props.setType('shortText')
        }
        else if (label == '1') {
            props.setType('multi-choice')
        }
        else if (label == '2') {
            props.setType('checkbox')
        }
        else if (label == '3') {
            props.setType('table')
        }
        else if (label == '4') {
            props.setType('linkedData')
        }
        else if (label == '5') {
            props.setType('date-single')
        }
        else if (label == '6') {
            props.setType('file')
        }
    }

    const handleOTPNumber = (event) => {
        props.setOTPNumber(event.target.value);
    }

    console.log(props.type)
    console.log(props.OTPNumber)

    return (
        <div>
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography variant='h6' component="div">
                        Chỉnh sửa câu hỏi
                    </Typography>

                    <Box component="form" sx={{ mt: '10px', mb: '5px', display: 'flex', alignItems: 'center' }}>
                        {/* Input Form Name */}
                        <TextField
                            required
                            value={props.titleQuestion}
                            onChange={handleTitleQuestion}
                            sx={{ marginRight: '10px', width: '100%' }}
                            id="outlined-basic"
                            variant="outlined"
                            placeholder='Nhập nội dung câu hỏi...'
                            onKeyDown={recommendType}
                        />

                        {/* Select-Type Component */}
                        <SelectType value={props.type} handleFunction={handleChangeType} />
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
                                                onClick={handleActive(index, 'option')}
                                                sx={{ marginRight: '10px', width: '100%' }}
                                                // id={index.toString()}
                                                variant="standard"
                                            />
                                            <IconButton
                                                onClick={deleteOption(index)}
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
                    {props.type === 'longText' ?
                        <TextField disabled multiline rows={4} sx={{ width: '100%' }} id="standard-basic" label="Nhập câu trả lời" variant="standard" />
                        : null
                    }
                    {props.type === 'date-single' || props.type === 'date-range' ?
                        <Box sx={{ margin: '5px' }}>
                            <Typography sx={{ width: '100%', marginY: '10px', color: 'gray' }}><b>Chọn định dạng</b></Typography>
                            <FormControl sx={{ width: '50%' }}>
                                <Select
                                    value={props.dateNum}
                                    onChange={props.handleDateNum}
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
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Button fullWidth href={'https://lvtn-db.s3.ap-southeast-1.amazonaws.com/sample_file.xlsx'}
                                sx={{
                                    color: '#737373',
                                    padding: '10px',
                                    marginBottom: '5px',
                                    background: '#E9F2F4',
                                    borderRadius: '20px',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'left',
                                    textTransform: 'initial',
                                    '&:hover': {
                                        backgroundColor: '#E9F2F4',
                                        color: '#737373'
                                    },
                                }}>
                                Tải file mẫu
                            </Button>
                            <Box sx={{ color: '#6D7073', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px' }}>
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
                    {props.type === 'table' ?
                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: '10px' }}>
                            <Box sx={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                {
                                    props.columnList.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                                                <Typography sx={{ color: 'gray', marginRight: '10px' }}>
                                                    {index + 1}.
                                                </Typography>
                                                <TextField
                                                    value={index === active ? columnName : item.ColumnName}
                                                    onChange={handleColumnName}
                                                    onBlur={saveColumnName(index)}
                                                    onClick={handleActive(index, 'columnName')}
                                                    sx={{ marginRight: '10px', width: '50%' }}
                                                    placeholder='Nhập tên cột'
                                                    // id={index.toString()}
                                                    variant="standard"
                                                />
                                                <FormControl placeholder='Chọn kiểu' sx={{ width: '35%' }}>
                                                    <InputLabel id="demo-simple-select-label">Kiểu</InputLabel>
                                                    <Select
                                                        value={index === activeType ? props.columnType : item.Type}
                                                        onChange={props.handleColumnType(index)}
                                                        onClick={handleActiveType(index)}
                                                        size='small'
                                                        label='Kiểu'
                                                    >
                                                        <MenuItem value={'shortText'}>Điền ngắn</MenuItem>
                                                        <MenuItem value={'dropdown'}>Menu thả xuống</MenuItem>
                                                        <MenuItem value={'date-single'}>Mốc thời gian</MenuItem>
                                                        {/* <MenuItem value={'date-range'}>Khoảng thời gian</MenuItem> */}
                                                    </Select>
                                                </FormControl>
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
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                {item.Type === 'dropdown' ?
                                                    <Box>
                                                        <Button onClick={handleOptionTable(index)} sx={{ color: '#364F6B', textTransform: 'initial', borderRadius: '20px' }}>Nhập các lựa chọn</Button>
                                                    </Box> : null}
                                                {item.Type === 'dropdown' ?
                                                    <Box>
                                                        {item.Content.MultiChoice.Options.length > 0 ?
                                                            <Typography>Đã nhập {item.Content.MultiChoice.Options.length} lựa chọn</Typography> : null}
                                                    </Box> : null}
                                                {item.Type === 'date-single' ?
                                                    <Box sx={{ width: '50%' }}>
                                                        <Typography sx={{ width: '100%', marginBottom: '5px', color: 'gray' }}><b>Chọn định dạng</b></Typography>
                                                        <FormControl fullWidth>
                                                            <Select
                                                                size='small'
                                                                value={item.Content.Date}
                                                                onChange={handleActiveDate(index)}
                                                            >
                                                                <MenuItem value={1}> Ngày/Tháng/Năm </MenuItem>
                                                                <MenuItem value={2}> Tháng/Năm </MenuItem>
                                                                <MenuItem value={3}> Năm </MenuItem>
                                                                <MenuItem value={4}> Giờ </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Box>
                                                    : null
                                                }
                                            </Box>
                                        </Box>
                                    ))
                                }
                            </Box>
                            <Box>
                                <Button
                                    sx={{ width: '30%', fontSize: '1.1rem', color: '#364F6B', paddingY: '10px', marginBottom: '10px', textTransform: 'initial', borderRadius: '20px' }}
                                    onClick={addColumnTable}
                                >
                                    <AddIcon />
                                    Thêm cột
                                </Button>
                            </Box>
                        </Box>
                        : null
                    }
                    {props.type === 'OTPInput' ?
                        <TextField value={props.OTPNumber} onChange={handleOTPNumber} sx={{ width: '100%' }} id="standard-basic" label="Nhập số lượng ô" variant="standard" />
                        : null
                    }
                    {props.type !== '' &&
                        <SwitchType checked={props.required} handleChangeRequired={handleChangeRequired}
                            type={props.type} convertType={convertType}
                        />
                    }
                    {error && <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Vui lòng điền tiêu đề và lựa chọn dạng câu hỏi</Alert>}
                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                        {props.quesEdit === -1 ?
                            <AcceptButton title='Thêm' onClick={addQuestion} />
                            :
                            <AcceptButton title='Lưu' onClick={saveQuestion} />
                        }
                        <CancelButton title='Hủy' onClick={handleClose} />
                    </Box>
                </Box>
            </Modal>
        </div >
    )
}

