import React, { useState, useEffect } from 'react'
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Grid } from '@mui/material'
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import Input from '@mui/material/Input';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';

import { Response, ResultMultiChoice, ResultShortText, ResultDate, ResultLinkedData, ResultFile } from './interface';
import { stringify } from 'querystring';

function Form() {
    // render: use to re-render after create or delete form
    const [render, setRender] = useState(false);

    const [formDetail, setFormDetail] = useState<any>({})
    const [formResponses, setFormResponse] = useState<any[]>([])

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;
    const ResponseAPI_URL = `http://localhost:8080/form-response/${useParams()?.formID}`;

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
            })
    }, [])

    //API POST: create a new response
    const addResponsetoDatabase = async (data) => {
        try {
            const response = await fetch(ResponseAPI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
                },
                body: JSON.stringify(data)
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

    // API DELETE: delete file by fileName
    const deleteFile = async (fileName) => {
        try {
            const response = await fetch('http://localhost:8080/delete-from-s3' + `/${fileName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
                }
            });

            // Kiểm tra nếu yêu cầu thành công (status code 2xx)
            if (response.ok) {
                const responseData = await response.json();
                console.log('Server Response:', responseData);
                return responseData;
            } else {
                // Xử lý lỗi nếu có
                const errorData = await response.json();
                console.error('Server Error:', errorData);
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu DELETE:', error);
        }
    };

    const handleDeleteFile = (fileName: any, ques: number, index: number) => (e) => {
        //Call API to delete file (in aws s3)
        deleteFile(fileName);

        //delete file (in front-end)
        formResponses[ques].content.files.splice(index, 1);

        //re-render UI
        setRender(!render);
    }

    // Initial mảng FormResponses tương ứng với các Question trong Form
    // Vì render lần đâu lấy length bị lỗi -> nên dùng try catch 
    try {
        let i = 0;
        // Tránh push thêm khi re-render component 
        if (formDetail.QuestionOrder.length !== formResponses.length) {
            while (i < formDetail.QuestionOrder.length) {
                const newResponse: Response = {
                    questionName: formDetail.Questions[i].Question,
                    type: formDetail.Questions[i].Type,
                    required: formDetail.Questions[i].Required,
                    index: formDetail.QuestionOrder[i],
                    error: '',
                    content: {}
                };

                if (formDetail.Questions[i].Type === "multi-choice" || formDetail.Questions[i].Type === "checkbox" || formDetail.Questions[i].Type === "dropdown") {
                    let res = new Array(formDetail.Questions[i].Content.MultiChoice.Options.length).fill(false);

                    const result: ResultMultiChoice = {
                        multiChoice: {
                            options: formDetail.Questions[i].Content.MultiChoice.Options,
                            result: res,
                            constraint: formDetail.Questions[i].Content.MultiChoice.Constraint,
                            maxOptions: formDetail.Questions[i].Content.MultiChoice.MaxOptions,
                            disabled: false
                        }
                    };

                    Object.assign(newResponse.content, result)
                }
                else if (formDetail.Questions[i].Type === "shortText") {
                    const result: ResultShortText = {
                        shortText: ""
                    };

                    Object.assign(newResponse.content, result)
                }
                else if (formDetail.Questions[i].Type === "date-single" || formDetail.Questions[i].Type === "date-range") {
                    let dateString: string = "2023-11-16";

                    const result: ResultDate = {
                        date: {
                            single: {
                                dateOnly: new Date(dateString),
                                hour: new Date(dateString),
                                fulltime: new Date(dateString)
                            },
                            range: {
                                from: {
                                    dateOnly: new Date(dateString),
                                    hour: new Date(dateString),
                                    fulltime: new Date(dateString)
                                },
                                to: {
                                    dateOnly: new Date(dateString),
                                    hour: new Date(dateString),
                                    fulltime: new Date(dateString)
                                }
                            }
                        }
                    };

                    Object.assign(newResponse.content, result)
                }
                else if (formDetail.Questions[i].Type === "file") {
                    const result: ResultFile = {
                        files: []
                    };

                    Object.assign(newResponse.content, result)
                }
                else if (formDetail.Questions[i].Type === "linkedData") {
                    const result: ResultLinkedData = {
                        linkedData: []
                    };

                    Object.assign(newResponse.content, result)
                }
                // setFormResponse(formResponses);
                formResponses.push(newResponse);
                i++;
            }
        }
    }
    catch (error) {
        console.log("Error");
    }

    // Lưu giá trị cho các field dạng multi-choice
    const handleChange = (ques: number, index: number) => (e) => {
        //set all options to result 0
        formResponses[ques].content.multiChoice.result.fill(false);

        //set select options to result 1
        formResponses[ques].content.multiChoice.result[index] = true;
    };

    const shouldDisableCheckbox = (ques: number, index: number): boolean => {
        const maxAllowed = formResponses[ques].content.multiChoice.maxOptions; // Set your maximum number of allowed checked boxes
        const phanTuTrue = formResponses[ques].content.multiChoice.result.filter((giaTri) => giaTri === true); //Return array have true value
        return phanTuTrue.length >= maxAllowed;
    }

    // Lưu giá trị cho các field dạng checkbox
    const handleChangeCheckbox = (ques: number, index: number) => (e) => {
        //set select options to result 1
        if (formResponses[ques].content.multiChoice.result[index] === false)
            formResponses[ques].content.multiChoice.result[index] = true;
        else formResponses[ques].content.multiChoice.result[index] = false

        //disabled when select > maxOptions
        if (formResponses[ques].content.multiChoice.constraint === 'at-most') {
            formResponses[ques].content.multiChoice.disabled = shouldDisableCheckbox(ques, index)
            setRender(!render);
        }

        //if required question -> alert error if not fill checkbox
        if (formResponses[ques].required) {
            let checkSelect = formResponses[ques].content.multiChoice.result.some((giaTri) => giaTri === true);

            if (!checkSelect) {
                // checkRequired = false;
                formResponses[ques].error = 'Vui lòng hoàn thành những câu hỏi bắt buộc';
            }
            else {
                formResponses[ques].error = '';
            }
        }
    };

    //Lưu giá trị cho các field dạng shortText
    const [inputValue, setInputValue] = React.useState('');
    const handleChangeInputValue = (e) => {
        setInputValue(e.target.value);
    };
    //Get value of textField after onBlur the field
    const saveInputValue = (ques: number) => (e) => {
        formResponses[ques].content.shortText = inputValue;

        //Return error if active textField but don't fill
        if (inputValue === '') formResponses[ques].error = true
        else formResponses[ques].error = false

        //Render update UI
        setRender(!render)
    };
    const [active, setActive] = useState<number>(-1);
    const handleActive = (ques: number) => (e) => {
        //Nếu field trống thì set inputValue vễ rỗng, còn không rỗng thì set về giá trị cũ
        if (formResponses[ques].content.shortText === '') {
            setInputValue('')
        }
        else {
            setInputValue(formResponses[ques].content.shortText)
        }
        //lưu vị trí field được active
        setActive(ques);
    }

    //Lưu giá trị cho các field dạng Date
    const handleChangeDate = (ques: number) => (e) => {
        formResponses[ques].content.date.single.dateOnly = e.$d;
    };
    const handleChangeHour = (ques: number) => (e) => {
        formResponses[ques].content.date.single.hour = e.$d;
    };

    //Lưu giá trị cho các field dạng dropdown
    const [value, setValue] = useState('');
    const handleChangeDropdown = (ques: number) => (e) => {
        setValue(e.target.value as string);
        //Set all options to result 0
        formResponses[ques].content.multiChoice.result.fill(false);

        //set select options to result 1
        formResponses[ques].content.multiChoice.result[e.target.value] = true;
    };
    const checkErrDropdown = (ques: number) => (e) => {
        if (formResponses[ques].required) {
            //Check result array is checked or not
            let checkSelect = formResponses[ques].content.multiChoice.result.some((giaTri) => giaTri === true);

            if (!checkSelect) {
                // checkRequired = false;
                formResponses[ques].error = 'Vui lòng điền những câu hỏi bắt buộc';
            }
            else {
                formResponses[ques].error = '';
            }
            setRender(!render);
        }
    }

    //Handle submit form
    const [submit, setSubmit] = useState<boolean>();
    const handleSubmitForm = async () => {
        let checkRequired = true;

        formResponses.forEach(async item => {
            if (item.required === true) {
                if (item.type === 'multi-choice' || item.type === 'checkbox' || item.type === 'dropdown') {
                    //Check required
                    //some function: has >=1 true value => true; has no true value => false
                    let checkSelect = item.content.multiChoice.result.some((giaTri) => giaTri === true);
                    if (!checkSelect) {
                        checkRequired = false;
                        item.error = 'Vui lòng hoàn thành những câu hỏi bắt buộc';
                    }
                    else {
                        item.error = '';
                    }
                }
                else if (item.type === 'shortText') {
                    if (item.content.shortText === '') {
                        checkRequired = false;
                        item.error = 'Vui lòng hoàn thành những câu hỏi bắt buộc';
                    }
                    else {
                        item.error = '';
                    }
                }
                else if (item.type === 'file') {
                    if (item.content.files.length === 0) {
                        checkRequired = false;
                        item.error = 'Vui lòng hoàn thành những câu hỏi bắt buộc';
                    }
                    else {
                        item.error = '';
                    }
                }
            }
        });

        console.log(formResponses)

        //Success: Fill correctly required questions 
        if (checkRequired) {
            console.log(formResponses);
            await addResponsetoDatabase({
                "id": "6526518a6b149bcb2510172f",
                "formID": "651dbc9d49502243191371e3",
                "username": formDetail.owner,
                "userID": formDetail.owner,
                "submitTime": "2023-10-11T07:40:58.1078101Z",
                "responses": formResponses
            });
            setSubmit(true)
            setHeight('100vh')
        }
        //Failed: Not fill required questions
        else if (!checkRequired) {
            setSubmit(false)
            setRender(!render)
        }
    }

    const handleFileChange = (ques: number) => async (e) => {
        let selectedFile = e.target.files[0]
        if (selectedFile) {
            let fileSize = selectedFile.size / 1024;

            let numOfFile = formResponses[ques].content.files.length;

            let totalFileSize = formResponses[ques].content.files.reduce((total, obj) => total + obj.size, 0) / 24;

            //Kiểu file không đúng
            if (!formDetail.Questions[ques].Content.File.FileType.includes(selectedFile.type)) {
                formResponses[ques].error = 'Sai định dạng File cho phép';
            }
            //Số lượng file vượt giới hạnf
            else if (numOfFile >= formDetail.Questions[ques].Content.File.MaxFileAmount) {
                formResponses[ques].error = 'Vượt quá số lượng File cho phép';
            }
            //fileSize vượt giới hạn
            else if (totalFileSize + fileSize >= formDetail.Questions[ques].Content.File.MaxFileSize) {
                formResponses[ques].error = 'Vượt quá dung lượng File cho phép';
            }
            //Thêm được bình thường
            else {
                const response = await uploadFileToS3(selectedFile);

                formResponses[ques].content.files.push(response[0])

                // Set error to blank
                formResponses[ques].error = ''

                console.log(formResponses[ques].content.files);
            }
            setRender(!render);
        }
    }

    const uploadFileToS3 = async (files: File) => {
        const formData = new FormData();

        // files.map((file) => (formData.append('files', file)
        // ))
        formData.append('files', files)

        const apiUrl = 'http://localhost:8080/upload-to-s3';

        // console.log(file);
        console.log(formData)

        // Gửi yêu cầu POST sử dụng fetch
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            },
            body: formData,
        });

        // Kiểm tra nếu yêu cầu thành công (status code 2xx)
        if (response.ok) {
            const responseData = await response.json();
            console.log('Server Response:', responseData);
            return responseData;
        } else {
            // Xử lý lỗi nếu có
            const errorData = await response.json();
            console.error('Server Error:', errorData);
        }
    };

    //Lưu giá trị cho các field dạng linkedData
    const [firstField, setFirstField] = useState('');
    const handleFirstFieldChange = (ques: number) => (e) => {
        setFirstField(e.target.value);
        setSecondField('');
        setThirdField('');

        const firstChoice = formDetail.Questions[ques].Content.LinkedData.ListOfOptions[e.target.value].Key;
        formResponses[ques].content.linkedData.push(firstChoice);
    };

    const [secondField, setSecondField] = useState('');
    const handleSecondFieldChange = (ques: number) => (e) => {
        setSecondField(e.target.value);
        setThirdField('');

        const secondChoice = formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField].Value[e.target.value].Key;
        formResponses[ques].content.linkedData.push(secondChoice);
    };

    const [thirdField, setThirdField] = useState('');
    const handleThirdFieldChange = (ques: number) => (e) => {
        setThirdField(e.target.value);

        const thirdChoice = formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField].Value[secondField].Value;
        formResponses[ques].content.linkedData.push(thirdChoice);
    };

    const [height, setHeight] = useState('100%')

    console.log(formResponses);
    console.log(formDetail);

    return (
        <div>
            <Box sx={{ backgroundColor: '#E9F2F4', border: "2px solid #DEDEDE", height: { height }, width: '100vw' }}>
                <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", borderRadius: '10px', marginX: '25vw', marginTop: '70px' }}>
                    {/* Header of Form */}
                    <Box sx={{ textAlign: 'center', backgroundColor: '#008272', paddingY: '30px', borderRadius: '10px 10px 0 0' }}>
                        <Typography sx={{ color: 'white', padding: '15px', fontWeight: 600 }} variant="h4" noWrap component="div">
                            {Object.keys(formDetail).length !== 0 ? formDetail.header.Title : null}
                        </Typography>
                        <Typography sx={{ color: 'white', padding: '5px', fontWeight: 400 }} variant='body1' noWrap component="div">
                            {Object.keys(formDetail).length !== 0 ? formDetail.header.Description : null}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Body of Form | In case: Unsubmit form */}
                    {!submit && <Box sx={{ margin: '60px' }}>
                        {formDetail.Questions !== undefined ? formDetail.QuestionOrder.map((ques, index) => (
                            <Box
                                key={index}
                                sx={{ marginY: '15px' }}
                            >
                                {/* Câu hỏi */}
                                <Box sx={{ display: 'flex' }}>
                                    <Typography
                                        sx={{ color: '#008272', justifySelft: 'left', paddingTop: '10px', fontWeight: 500 }} variant='h5' noWrap component="div">
                                        {index + 1}. {formDetail.Questions[ques].Question}
                                    </Typography>
                                    {
                                        formDetail.Questions[ques].Required &&
                                        <Typography sx={{ color: 'red', fontSize: '18px' }}>*</Typography>
                                    }
                                </Box>

                                {/* Nội dung | Dạng câu hỏi */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginX: '30px', marginY: '15px' }}>
                                    {formDetail.Questions[ques].Type === 'multi-choice' ?
                                        <Box>
                                            <FormControl>
                                                <RadioGroup
                                                    key={index}
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="female"
                                                    name="radio-buttons-group"
                                                >
                                                    {formDetail.Questions[ques].Content.MultiChoice.Options.map((item, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            onChange={handleChange(ques, index)}
                                                            value={item}
                                                            control={<Radio />}
                                                            label={item}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            {formResponses[ques].error !== '' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Vui lòng hoàn thành câu hỏi bắt buộc</Alert> : null}
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'dropdown' ?
                                        <Box>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={value}
                                                    onChange={handleChangeDropdown(ques)}
                                                    onBlur={checkErrDropdown(ques)}
                                                >
                                                    {formDetail.Questions[ques].Content.MultiChoice.Options.map((item, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={index}>
                                                            {item}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {formResponses[ques].error !== '' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Vui lòng hoàn thành câu hỏi bắt buộc</Alert> : null}
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'checkbox' ?
                                        <Box>
                                            {formResponses[ques].content.multiChoice.constraint === 'at-most' ?
                                                <Typography sx={{ color: 'gray', paddingBottom: '10px' }}>Vui lòng chọn tối đa {formResponses[ques].content.multiChoice.maxOptions} phương án.</Typography>
                                                : null
                                            }
                                            <FormControl>
                                                {formDetail.Questions[ques].Content.MultiChoice.Options.map((item, index) => (
                                                    <FormControlLabel
                                                        key={index}
                                                        onChange={handleChangeCheckbox(ques, index)}
                                                        // onBlur={checkErrCheckbox(ques)}
                                                        value={item}
                                                        control={<Checkbox
                                                            disabled={formResponses[ques].content.multiChoice.disabled && (formResponses[ques].content.multiChoice.result[index] !== true)}
                                                        />}
                                                        label={item}
                                                    />
                                                ))}
                                            </FormControl>
                                            {formResponses[ques].error !== '' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">{formResponses[ques].error}</Alert> : null}
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'shortText' ?
                                        <Box>
                                            <TextField
                                                // value={inputValue}
                                                value={ques === active ? inputValue : formResponses[ques].content.shortText}
                                                onChange={handleChangeInputValue}
                                                onBlur={saveInputValue(ques)}
                                                onClick={handleActive(ques)}
                                                sx={{ width: '100%', mb: '1px' }}
                                                id="outlined-basic"
                                                label="Điền ngắn"
                                                variant="outlined" />
                                            {formResponses[ques].error !== '' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Vui lòng hoàn thành câu hỏi bắt buộc</Alert> : null}
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'date-single' && formDetail.Questions[ques].Content.Date === 0 ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker onChange={handleChangeDate(ques)} />
                                        </LocalizationProvider>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'date-single' && formDetail.Questions[ques].Content.Date === 1 ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <TimePicker
                                                    label="Chọn giờ"
                                                    // value={time}
                                                    onChange={handleChangeHour(ques)}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'file' ?
                                        <Box>
                                            <Button
                                                sx={{
                                                    backgroundColor: '#008272', color: 'white', fontSize: '16px', py: '6px',
                                                    textTransform: 'initial', px: '20px',
                                                    '&:hover': {
                                                        backgroundColor: '#008272',
                                                        color: 'white'
                                                    },
                                                }}
                                                component="label"
                                            >
                                                Thêm file
                                                <input
                                                    onChange={handleFileChange(ques)}
                                                    type="file"
                                                    hidden
                                                />
                                            </Button>
                                            {formResponses[ques].content.files.map((file, index) => (
                                                <Grid container xs={12} sx={{ marginTop: '10px' }}>
                                                    <Grid item xs={11} sx={{ overflow: 'hidden' }}>
                                                        <Button fullWidth href={file.fileURL} key={file.fileName}
                                                            sx={{
                                                                color: '#737373',
                                                                padding: '10px',
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
                                                            {file.fileName}
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton
                                                            onClick={handleDeleteFile(file.fileName, ques, index)}
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
                                                    </Grid>
                                                </Grid>
                                            ))
                                            }
                                            {/* {fileError !== '' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">{fileError}</Alert> : null} */}
                                            {formResponses[ques].error !== '' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">{formResponses[ques].error}</Alert> : null}
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'linkedData' ?
                                        <Grid container spacing={2}>
                                            {formDetail.Questions[ques].Content.LinkedData.ImportedLink.map((field, index) => (
                                                <Grid item xs={4} key={field}>
                                                    {index === 0 ?
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select
                                                                value={firstField}
                                                                sx={{ marginTop: '10px' }}
                                                                onChange={handleFirstFieldChange(ques)}
                                                            >
                                                                {formDetail.Questions[ques].Content.LinkedData.ListOfOptions.map((obj, idx) => (
                                                                    <MenuItem key={obj.Key} value={idx} >{obj.Key}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                    {index === 1 && firstField !== '' ?
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select
                                                                value={secondField}
                                                                sx={{ marginTop: '10px' }}
                                                                onChange={handleSecondFieldChange(ques)}
                                                            >
                                                                {formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField].Value.map((obj, idx) => (
                                                                    <MenuItem key={obj.Key} value={idx} >{obj.Key}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                    {index === 1 && firstField === '' ?
                                                        <FormControl fullWidth disabled>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select sx={{ marginTop: '10px' }}>
                                                                <MenuItem></MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                    {index === 2 && secondField !== '' ?
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select
                                                                value={thirdField}
                                                                sx={{ marginTop: '10px' }}
                                                                onChange={handleThirdFieldChange(ques)}
                                                            >
                                                                <MenuItem value={formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField].Value[secondField].Value}>{formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField].Value[secondField].Value}</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                    {index === 2 && secondField === '' ?
                                                        <FormControl fullWidth disabled>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select sx={{ marginTop: '10px' }}>
                                                                <MenuItem></MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                </Grid>
                                            ))
                                            }
                                        </Grid>
                                        : null
                                    }
                                </Box>
                            </Box>
                        ))
                            : null}
                    </Box>}

                    {/* Body of Form | In case: Form submitted */}
                    {submit && <Box sx={{ margin: '50px' }}>
                        Phản hồi đã được gửi thành công.
                    </Box>
                    }
                </Box>
                {!submit && <Box sx={{ display: 'grid', justifyItems: 'right', width: '100%' }}>
                    <Button
                        onClick={handleSubmitForm}
                        sx={{
                            background: '#008272', color: 'white', marginRight: '30vw', marginBottom: '30px', marginTop: '30px', width: '100px', height: '50px', '&:hover': {
                                backgroundColor: '#008272', // Màu nền thay đổi khi hover
                                color: 'white'
                            },
                        }}>
                        Gửi
                    </Button>
                </Box>}
            </Box>
        </div >
    )
}

export default Form
