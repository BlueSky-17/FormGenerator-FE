/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-loop-func */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Grid } from '@mui/material'
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import ClearIcon from '@mui/icons-material/Clear';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
import OTPInput from '../../components/otp-input/otp-input';

import { Response, ResultMultiChoice, ResultShortText, ResultDate, ResultLinkedData, ResultFile, ResultTable, ResultSpecialText, ResultOTPText } from './interface';
import bg from "../../assets/background.png"

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// APIs
import { deleteFile, uploadFileToS3 } from '../../apis/file';
import Error404 from '../../components/error-page/404';
import LoadingPage from '../../components/loading-page/loading';
// import { addResponsetoDatabase } from '../../apis/responses';



function FormViewer() {
    // render: use to re-render after create or delete form
    const [render, setRender] = useState(false);
    const [height, setHeight] = useState('100%')

    const [loading, setLoading] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    const [formDetail, setFormDetail] = useState<any>({})
    const [formResponses, setFormResponse] = useState<any[]>([])

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;

    const ResponsesAPI_URL = `http://localhost:8080/form-response/${useParams()?.formID}`

    const addResponsetoDatabase = async (data) => {
        try {
            const response = await fetch(ResponsesAPI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
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

    useEffect(() => {
        fetch(FormDetailAPI_URL, {
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
                    // throw new Error('Server returned ' + response.status);
                }
                return response.json();
            })
            .then(formDetail => {
                setFormDetail(formDetail);
                setLoading(false);
                if (formDetail.Questions) setOtpArrayLength(formDetail.Questions.length);

                setLoading(false);
            })

    }, [])

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
                else if (formDetail.Questions[i].Type === "email" || formDetail.Questions[i].Type === "phone") {
                    const result: ResultSpecialText = {
                        specialText: ""
                    };

                    Object.assign(newResponse.content, result)
                }
                else if (formDetail.Questions[i].Type === "OTPInput") {
                    const result: ResultOTPText = {
                        OTPInput: ""
                    };

                    Object.assign(newResponse.content, result)
                }
                else if (formDetail.Questions[i].Type === "date-single" || formDetail.Questions[i].Type === "date-range") {
                    let dateString: string = "1000-1-1";

                    const result: ResultDate = {
                        date: {
                            single: {
                                time: new Date(dateString),
                                type: -1
                            },
                            range: {
                                from: new Date(dateString),
                                to: new Date(dateString),
                                type: -1
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
                        linkedData: [],
                        index: []
                    };

                    Object.assign(newResponse.content, result)
                }
                else if (formDetail.Questions[i].Type === "table") {
                    const result: ResultTable = {
                        table: {
                            listOfColumn: []
                        }
                    };

                    //Với mỗi listOfColum thì sẽ init responses như dưới đây (content sẽ có 1 phần từ (row) trỗng sẵn)
                    formDetail.Questions[i].Content.Table.ListOfColumn.forEach((item, index) => {
                        if (item.Type === 'shortText') {
                            result.table.listOfColumn.push({
                                columnName: item.ColumnName,
                                type: item.Type,
                                content: [{
                                    shortText: ""
                                }]
                            })
                        }
                        else if (item.Type === 'dropdown') {
                            let res = new Array(item.Content.MultiChoice.Options.length).fill(false);

                            result.table.listOfColumn.push({
                                columnName: item.ColumnName,
                                type: item.Type,
                                content: [{
                                    multiChoice: {
                                        options: item.Content.MultiChoice.Options,
                                        result: res,
                                        constraint: "",
                                        maxOptions: 1,
                                        disabled: false
                                    }
                                }]
                            })
                        }
                        else if (item.Type === 'date-single') {
                            let dateString: string = "1000-1-1";

                            result.table.listOfColumn.push({
                                columnName: item.ColumnName,
                                type: item.Type,
                                content: [{
                                    date: {
                                        single: {
                                            time: new Date(dateString),
                                            type: -1
                                        },
                                        range: {
                                            from: new Date(dateString),
                                            to: new Date(dateString),
                                            type: -1
                                        }
                                    }
                                }]
                            })
                        }
                    })

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

    // MULTI-CHOICE, CHECK-BOX
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

    // SHORT TEXT, EMAIL, PHONE NUMBER
    const [inputValue, setInputValue] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');

    const saveInputValue = (ques: number) => (e) => {
        console.log(inputValue)
        switch (formResponses[ques].type) {
            case "shortText":
                formResponses[ques].content.shortText = inputValue;
                break;
            case "email":
                formResponses[ques].content.specialText = email;

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    formResponses[ques].error = 'Email không hợp lệ';
                } else {
                    formResponses[ques].error = '';
                }
                break;
            case "phone":
                formResponses[ques].content.specialText = phone;

                const phoneNumberRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
                if (!phoneNumberRegex.test(phone)) {
                    formResponses[ques].error = 'Số điện thoại không hợp lệ';
                } else {
                    formResponses[ques].error = '';
                }
                break;
            default:
                break;
        }
    };

    const [active, setActive] = useState<number>(-1);

    const handleActive = useCallback((ques: number) => (e) => {
        //If re-active 
        if (ques === active) return;

        if (formResponses[ques].type === "shortText") {
            //Nếu field trống thì set inputValue vễ rỗng, còn không rỗng thì set về giá trị cũ
            if (formResponses[ques].content.shortText === '') {
                setInputValue('')
            }
            else {
                setInputValue(formResponses[ques].content.shortText)
            }
        }
        else if (formResponses[ques].type === "email") {
            if (formResponses[ques].content.specialText === '') {
                setEmail('')
            }
            else {
                setEmail(formResponses[ques].content.specialText)
            }
        }
        else if (formResponses[ques].type === 'phone') {
            if (formResponses[ques].content.specialText === '') {
                setPhone('')
            }
            else {
                setPhone(formResponses[ques].content.specialText)
            }
        }

        console.log(ques);
        //lưu vị trí field được active
        setActive(ques);
    }, [active, inputValue])

    // LONG TEXT - TEXT EDITOR
    const [valueLongText, setValueLongText] = useState<string[]>([]);

    const setLongTextLength = (length) => {
        setValueLongText(Array(length).fill(''));
    };

    const handleValueLongText = (index) => (e) => {

        const newValueLongText = [...valueLongText];
        newValueLongText[index] = e;
        setValueLongText(newValueLongText);

        formResponses[index].content.shortText = e;
    }

    // TABLE
    const [tableText, setTableText] = React.useState('');

    const handleChangeTableText = (e) => {
        setTableText(e.target.value);
    };

    const saveTableText = (ques: number, rowIndex: number, colIndex: number) => (e) => {
        formResponses[ques].content.table.listOfColumn[colIndex].content[rowIndex].shortText = tableText;
    };

    const handleChangeTableDropdown = (ques: number, rowIndex: number, colIndex: number) => (e) => {
        //Set all options to result 0
        formResponses[ques].content.table.listOfColumn[colIndex].content[rowIndex].multiChoice.result.fill(false);

        formResponses[ques].content.table.listOfColumn[colIndex].content[rowIndex].multiChoice.result[e.target.value] = true;
    };

    const [activeTable, setActiveTable] = useState<[number, number, number]>([-1, -1, -1]);
    const handleActiveTable = (ques: number, rowIndex: number, colIndex: number) => (e) => {
        //Nếu field trống thì set tableText vễ rỗng, còn không rỗng thì set về giá trị cũ
        if (formResponses[ques].content.table.listOfColumn[colIndex].content[rowIndex].shortText === '') {
            setTableText('')
        }
        else {
            setTableText(formResponses[ques].content.table.listOfColumn[colIndex].content[rowIndex].shortText)
        }

        //lưu vị trí tableText được active
        setActiveTable([ques, rowIndex, colIndex]);
    }

    const addRowTable = (ques: number) => (e) => {
        formDetail.Questions[ques].Content.Table.ListOfColumn.forEach((item, index) => {
            if (item.Type === 'shortText') {
                formResponses[ques].content.table.listOfColumn[index].content.push
                    ({
                        shortText: ''
                    })
            }
            else if (item.Type === 'dropdown') {
                let res = new Array(formDetail.Questions[ques].Content.Table.ListOfColumn[index].Content.MultiChoice.Options.length).fill(false);

                formResponses[ques].content.table.listOfColumn[index].content.push
                    ({
                        multiChoice: {
                            options: item.Content.MultiChoice.Options,
                            result: res,
                            constraint: "",
                            maxOptions: 1,
                            disabled: false
                        }
                    })
            }
            else if (item.Type === 'date-single') {
                let dateString: string = "1000-1-1";

                formResponses[ques].content.table.listOfColumn[index].content.push({
                    date: {
                        single: {
                            time: new Date(dateString),
                            type: -1
                        },
                        range: {
                            from: new Date(dateString),
                            to: new Date(dateString),
                            type: -1
                        }
                    }
                })
            }
        })

        setRender(!render)
    };

    // DATE 
    const handleChangeDate = (ques: number) => (e) => {
        formResponses[ques].content.date.single.time = e.$d;
        formResponses[ques].content.date.single.type = formDetail.Questions[ques].Content.Date;
    };

    const handleChangeDateTable = (ques: number, rowIndex: number, colIndex: number) => (e) => {
        formResponses[ques].content.table.listOfColumn[colIndex].content[rowIndex].date.single.time = e.$d;
        formResponses[ques].content.table.listOfColumn[colIndex].content[rowIndex].date.single.type = formDetail.Questions[ques].Content.Table.ListOfColumn[colIndex].Content.Date;
    }

    const handleChangeDateRange = (ques: number, pos: string) => (e) => {
        formResponses[ques].content.date.range.type = formDetail.Questions[ques].Content.Date;
        if (pos === 'start') {
            formResponses[ques].content.date.range.from = e.$d;
        }
        else if (pos === 'end') {
            formResponses[ques].content.date.range.to = e.$d;
        };

        console.log(formResponses[ques].content.date.range.from)
        console.log(formResponses[ques].content.date.range.to)
        console.log(formResponses[ques].content.date.range.to <= formResponses[ques].content.date.range.from)

        if (formDetail.Questions[ques].Content.Date === 5) {
            let dateString: string = "1000-1-1";
            let time = new Date(dateString)

            if ((formResponses[ques].content.date.range.to <= formResponses[ques].content.date.range.from)
                && (formResponses[ques].content.date.range.to !== time)
                && (formResponses[ques].content.date.range.from !== time)
            ) {
                formResponses[ques].error = 'Thời gian bắt đầu phải trước thời gian kết thúc'
                setRender(!render)
            }
            else {
                formResponses[ques].error = ''
                setRender(!render)
            }
        }
        else if (formDetail.Questions[ques].Content.Date === 6) {
            let dateString: string = "1000-1-1";
            let time = new Date(dateString)

            if ((formResponses[ques].content.date.range.to <= formResponses[ques].content.date.range.from)
                && (formResponses[ques].content.date.range.to.getMonth() !== time.getMonth())
                && (formResponses[ques].content.date.range.to.getFullYear() !== time.getFullYear())
                && (formResponses[ques].content.date.range.from.getMonth() !== time.getMonth())
                && (formResponses[ques].content.date.range.from.getFullYear() !== time.getFullYear())
            ) {
                formResponses[ques].error = 'Thời gian bắt đầu phải trước thời gian kết thúc'
                setRender(!render)
            }
            else {
                formResponses[ques].error = ''
                setRender(!render)
            }
        }
        else if (formDetail.Questions[ques].Content.Date === 7) {
            let dateString: string = "1000-1-1";
            let time = new Date(dateString)

            if ((formResponses[ques].content.date.range.to <= formResponses[ques].content.date.range.from)
                && (formResponses[ques].content.date.range.to.getFullYear() !== time.getFullYear())
                && (formResponses[ques].content.date.range.from.getFullYear() !== time.getFullYear())
            ) {
                formResponses[ques].error = 'Thời gian bắt đầu phải trước thời gian kết thúc'
                setRender(!render)
            }
            else {
                formResponses[ques].error = ''
                setRender(!render)
            }
        }
        else if (formDetail.Questions[ques].Content.Date === 8) {
            let dateString: string = "1000-1-1";
            let time = new Date(dateString)
            console.log(time)
            console.log(formResponses[ques].content.date.range.to === time)

            if ((formResponses[ques].content.date.range.to <= formResponses[ques].content.date.range.from)
                && (formResponses[ques].content.date.range.to !== time)
                && (formResponses[ques].content.date.range.from !== time)
            ) {
                formResponses[ques].error = 'Thời gian bắt đầu phải trước thời gian kết thúc'
                setRender(!render)
            }
            else {
                formResponses[ques].error = ''
                setRender(!render)
            }
        }

    }

    // DROP-DOWN 
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

    // LINKED DATA 
    const handleFirstFieldChange = (ques: number) => (e) => {
        if (formResponses[ques].content.linkedData.length !== 0) {
            formResponses[ques].content.linkedData = []
            formResponses[ques].content.index = []
        }

        const firstChoice = formDetail.Questions[ques].Content.LinkedData.ListOfOptions[e.target.value].Key;
        formResponses[ques].content.linkedData.push(firstChoice);
        formResponses[ques].content.index.push(e.target.value);

        setRender(!render);
    };

    const handleSecondFieldChange = (ques: number) => (e) => {
        if (formResponses[ques].content.linkedData.length !== 1) {
            let subArray1 = formResponses[ques].content.linkedData.slice(0, 1);
            let subArray2 = formResponses[ques].content.index.slice(0, 1);

            formResponses[ques].content.linkedData = subArray1;
            formResponses[ques].content.index = subArray2;
        }

        const secondChoice = formDetail.Questions[ques].Content.LinkedData.ListOfOptions[formResponses[ques].content.index[0]].Value[e.target.value].Key;
        formResponses[ques].content.linkedData.push(secondChoice);
        formResponses[ques].content.index.push(e.target.value);

        setRender(!render);
    };

    const handleThirdFieldChange = (ques: number) => (e) => {
        const thirdChoice = formDetail.Questions[ques].Content.LinkedData.ListOfOptions[formResponses[ques].content.index[0]].Value[formResponses[ques].content.index[1]].Value[e.target.value];
        formResponses[ques].content.linkedData.push(thirdChoice);
        formResponses[ques].content.index.push(e.target.value);

        setRender(!render);
    };

    // OTP INPUT
    const [otpArray, setOtpArray] = useState<string[]>([]);

    const setOtpArrayLength = (length) => {
        setOtpArray(Array(length).fill(''));
    };

    const handleSaveOTP = (index) => (e) => {
        const newOtpArray = [...otpArray];
        newOtpArray[index] = e;
        setOtpArray(newOtpArray);

        formResponses[index].content.OTPInput = e;
    };

    // FILE
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

    const handleDeleteFile = (fileName: any, ques: number, index: number) => (e) => {
        //Call API to delete file (in aws s3)
        deleteFile(fileName);

        //delete file (in front-end)
        formResponses[ques].content.files.splice(index, 1);

        //re-render UI
        setRender(!render);
    }

    // HANDLE SUBMIT FORM
    const [submit, setSubmit] = useState<boolean>();

    const handleSubmitForm = async () => {
        let checkRequired = true;
        let checkFromTo = true;

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
                else if (item.type === 'date-range') {
                    if (item.content.files.length === 0) {
                        checkRequired = false;
                        item.error = 'Vui lòng hoàn thành những câu hỏi bắt buộc';
                    }
                    else {
                        item.error = '';
                    }
                }
            }

            if (item.type === 'date-range' && item.error !== '') {
                checkFromTo = false;
            }
        });

        console.log(formResponses)

        const tokenString = localStorage.getItem('token');

        //Success: Fill correctly required questions 
        if (checkRequired && checkFromTo) {
            console.log(formResponses);
            await addResponsetoDatabase({
                "id": "6526518a6b149bcb2510172f",
                "formID": "651dbc9d49502243191371e3",
                "formName": formDetail.name,
                "username": tokenString ? JSON.parse(tokenString).user.FirstName + " " + JSON.parse(tokenString).user.LastName : "",
                "userID": tokenString ? JSON.parse(tokenString).user.ID : "",
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

    if (loading) {
        return <LoadingPage />
    }

    if (notFound) {
        return <Error404 />
    }

    // console.log(formResponses);
    // console.log(formDetail);
    return (
        <div>
            <Box sx={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                border: "2px solid #DEDEDE",
                height: { height },
                width: '100vw'
            }}>
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
                                                fullWidth
                                                value={ques === active ? inputValue : formResponses[ques].content.shortText}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onBlur={saveInputValue(ques)}
                                                onClick={handleActive(ques)}
                                                sx={{ mb: '1px' }}
                                                id="outlined-basic"
                                                label="Điền ngắn"
                                                variant="outlined" />
                                            {formResponses[ques].error === 'Vui lòng hoàn thành câu hỏi bắt buộc' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Vui lòng hoàn thành câu hỏi bắt buộc</Alert> : null}
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'longText' ?
                                        <Box>
                                            <ReactQuill
                                                theme="snow"
                                                value={valueLongText[ques]}
                                                onChange={handleValueLongText(ques)} />
                                            {formResponses[ques].error === 'Vui lòng hoàn thành câu hỏi bắt buộc' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Vui lòng hoàn thành câu hỏi bắt buộc</Alert> : null}
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'date-single' ?
                                        <Box>
                                            {formDetail.Questions[ques].Content.Date === 1 ?
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker label={'Ngày - Tháng - Năm'}
                                                        views={['year', 'month', 'day']}
                                                        onChange={handleChangeDate(ques)} />
                                                </LocalizationProvider> : null
                                            }
                                            {formDetail.Questions[ques].Content.Date === 2 ?
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker label={'Tháng - Năm'}
                                                        views={['year', 'month']}
                                                        onChange={handleChangeDate(ques)} />
                                                </LocalizationProvider> : null
                                            }
                                            {formDetail.Questions[ques].Content.Date === 3 ?
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker label={'Năm'}
                                                        views={['year']}
                                                        onChange={handleChangeDate(ques)} />
                                                </LocalizationProvider> : null
                                            }
                                            {formDetail.Questions[ques].Content.Date === 4 ?
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={['TimePicker']}>
                                                        <TimePicker
                                                            label="Chọn giờ"
                                                            // value={time}
                                                            onChange={handleChangeDate(ques)}
                                                        />
                                                    </DemoContainer>
                                                </LocalizationProvider> : null
                                            }
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'date-range' ?
                                        <Box>
                                            {formDetail.Questions[ques].Content.Date === 5 ?
                                                <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Grid item xs={5}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker label={'Bắt đầu'}
                                                                views={['year', 'month', 'day']}
                                                                onChange={handleChangeDateRange(ques, 'start')} />
                                                        </LocalizationProvider>
                                                    </Grid>

                                                    <Typography>_</Typography>

                                                    <Grid item xs={5}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker label={'Kết thúc'}
                                                                views={['year', 'month', 'day']}
                                                                onChange={handleChangeDateRange(ques, 'end')} />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid> : null
                                            }
                                            {formDetail.Questions[ques].Content.Date === 6 ?
                                                <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Grid item xs={5}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker label={'Bắt đầu'}
                                                                views={['year', 'month']}
                                                                onChange={handleChangeDateRange(ques, 'start')} />
                                                        </LocalizationProvider>
                                                    </Grid>

                                                    <Typography>_</Typography>

                                                    <Grid item xs={5}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker label={'Kết thúc'}
                                                                views={['year', 'month']}
                                                                onChange={handleChangeDateRange(ques, 'end')} />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid> : null
                                            }
                                            {formDetail.Questions[ques].Content.Date === 7 ?
                                                <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Grid item xs={5}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker label={'Bắt đầu'}
                                                                views={['year']}
                                                                onChange={handleChangeDateRange(ques, 'start')} />
                                                        </LocalizationProvider>
                                                    </Grid>

                                                    <Typography>_</Typography>

                                                    <Grid item xs={5}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker label={'Kết thúc'}
                                                                views={['year']}
                                                                onChange={handleChangeDateRange(ques, 'end')} />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid> : null
                                            }
                                            {formDetail.Questions[ques].Content.Date === 8 ?
                                                <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Grid item xs={5}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={['TimePicker']}>
                                                                <TimePicker
                                                                    label="Giờ bắt đầu"
                                                                    // value={time}
                                                                    onChange={handleChangeDateRange(ques, 'start')}
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </Grid>

                                                    <Typography>_</Typography>

                                                    <Grid item xs={5}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={['TimePicker']}>
                                                                <TimePicker
                                                                    label="Giờ kết thúc"
                                                                    // value={time}
                                                                    onChange={handleChangeDateRange(ques, 'end')}
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid> : null
                                            }
                                            {formResponses[ques].error !== '' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">{formResponses[ques].error}</Alert> : null}
                                        </Box> : null
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
                                            {formDetail.Questions[ques].Content.LinkedData.ImportedLink ? formDetail.Questions[ques].Content.LinkedData.ImportedLink.map((field, index) => (
                                                <Grid item xs={4} key={field}>
                                                    {index === 0 ?
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select
                                                                value={formResponses[ques].content.linkedData[index]}
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
                                                    {index === 1 && formResponses[ques].content.linkedData[0] !== undefined ?
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select
                                                                value={formResponses[ques].content.linkedData[index]}
                                                                sx={{ marginTop: '10px' }}
                                                                onChange={handleSecondFieldChange(ques)}
                                                            >
                                                                {formDetail.Questions[ques].Content.LinkedData.ListOfOptions[formResponses[ques].content.index[0]].Value.map((obj, idx) => (
                                                                    <MenuItem key={obj.Key} value={idx} >{obj.Key}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                    {index === 1 && formResponses[ques].content.linkedData[0] === undefined ?
                                                        <FormControl fullWidth disabled>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select sx={{ marginTop: '10px' }}>
                                                                <MenuItem></MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                    {index === 2 && formResponses[ques].content.linkedData[1] !== undefined ?
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select
                                                                value={formResponses[ques].content.linkedData[index]}
                                                                sx={{ marginTop: '10px' }}
                                                                onChange={handleThirdFieldChange(ques)}
                                                            >
                                                                {formDetail.Questions[ques].Content.LinkedData.ListOfOptions[formResponses[ques].content.index[0]].Value[formResponses[ques].content.index[1]].Value.map((obj, idx) => (
                                                                    <MenuItem key={obj} value={idx} >{obj}</MenuItem>
                                                                ))}
                                                                {/* <MenuItem value={formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField].Value[secondField].Value}>{formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField].Value[secondField].Value}</MenuItem> */}
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                    {index === 2 && formResponses[ques].content.linkedData[1] === undefined ?
                                                        <FormControl fullWidth disabled>
                                                            <InputLabel id="demo-simple-select-label">{field}</InputLabel>
                                                            <Select sx={{ marginTop: '10px' }}>
                                                                <MenuItem></MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                    }
                                                </Grid>
                                            )):null
                                            }
                                        </Grid>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'table' ?
                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        {formDetail.Questions[ques].Content.Table.ListOfColumn.map((item) => (
                                                            <TableCell align="left" sx={{ width: `${100 / formDetail.Questions[ques].Content.Table.ListOfColumn.length}%` }}>{item.ColumnName}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {formResponses[ques].content.table.listOfColumn[0].content.map((row, rowIndex) => (
                                                        <TableRow
                                                            key={rowIndex}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            {/* <TableCell component="th" scope="row">
                                                                {row.name}
                                                            </TableCell> */}
                                                            {formDetail.Questions[ques].Content.Table.ListOfColumn.map((item, colIndex) => (
                                                                <TableCell key={colIndex} align="left">
                                                                    {item.Type === 'shortText' ? <TextField
                                                                        // value={tableText}
                                                                        onChange={handleChangeTableText}
                                                                        value={(ques === activeTable[0] && rowIndex === activeTable[1] && colIndex === activeTable[2]) ? tableText : formResponses[ques].content.table.listOfColumn[colIndex].content[rowIndex].shortText}
                                                                        onBlur={saveTableText(ques, rowIndex, colIndex)}
                                                                        onClick={handleActiveTable(ques, rowIndex, colIndex)}
                                                                        size="small"
                                                                        fullWidth>
                                                                    </TextField> : null}
                                                                    {item.Type === 'dropdown' ?
                                                                        <FormControl fullWidth>
                                                                            <Select
                                                                                // value={item.Content.MultiChoice.Options[item.Content.MultiChoice.result]}
                                                                                onChange={handleChangeTableDropdown(ques, rowIndex, colIndex)}
                                                                            >
                                                                                {item.Content.MultiChoice.Options.map((item, index) => (
                                                                                    <MenuItem
                                                                                        key={index}
                                                                                        value={index}>
                                                                                        {item}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl> : null}
                                                                    {item.Type === 'date-single' ?
                                                                        <Box>
                                                                            {item.Content.Date === 1 ?
                                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                    <DatePicker label={'Ngày - Tháng - Năm'}
                                                                                        views={['year', 'month', 'day']}
                                                                                        onChange={handleChangeDateTable(ques, rowIndex, colIndex)} />
                                                                                </LocalizationProvider> : null
                                                                            }
                                                                            {item.Content.Date === 2 ?
                                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                    <DatePicker label={'Tháng - Năm'}
                                                                                        views={['year', 'month']}
                                                                                        onChange={handleChangeDateTable(ques, rowIndex, colIndex)} />
                                                                                </LocalizationProvider> : null
                                                                            }
                                                                            {item.Content.Date === 3 ?
                                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                    <DatePicker label={'Năm'}
                                                                                        views={['year']}
                                                                                        onChange={handleChangeDateTable(ques, rowIndex, colIndex)} />
                                                                                </LocalizationProvider> : null
                                                                            }
                                                                            {item.Content.Date === 4 ?
                                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                    <DemoContainer components={['TimePicker']}>
                                                                                        <TimePicker
                                                                                            label="Chọn giờ"
                                                                                            // value={time}
                                                                                            onChange={handleChangeDateTable(ques, rowIndex, colIndex)}
                                                                                        />
                                                                                    </DemoContainer>
                                                                                </LocalizationProvider> : null
                                                                            }
                                                                        </Box> : null}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                    <Button
                                                        onClick={addRowTable(ques)}
                                                        sx={{
                                                            color: 'white',
                                                            backgroundColor: '#008272',
                                                            borderRadius: '15px',
                                                            textTransform: 'initial',
                                                            paddingX: '15px',
                                                            margin: '15px',
                                                            '&:hover': {
                                                                backgroundColor: '#008272',
                                                                color: 'white'
                                                            },
                                                        }}>
                                                        Thêm 1 dòng
                                                    </Button>
                                                </TableBody>
                                            </Table>
                                        </TableContainer> : null
                                    }
                                    {formDetail.Questions[ques].Type === 'phone' ?
                                        <Box>
                                            <TextField
                                                fullWidth
                                                name='phoneNumber'
                                                value={ques === active ? phone : formResponses[ques].content.specialText}
                                                variant='outlined'
                                                onChange={(e) => setPhone(e.target.value)}
                                                onBlur={saveInputValue(ques)}
                                                onClick={handleActive(ques)}
                                            />
                                            {formResponses[ques].error === 'Số điện thoại không hợp lệ' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Số điện thoại không hợp lệ</Alert> : null}
                                        </Box>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'email' ?
                                        <Box>
                                            <TextField
                                                fullWidth
                                                name='email'
                                                value={ques === active ? email : formResponses[ques].content.specialText}
                                                variant='outlined'
                                                onChange={(e) => setEmail(e.target.value)}
                                                onBlur={saveInputValue(ques)}
                                                onClick={handleActive(ques)}
                                            />
                                            {formResponses[ques].error === 'Email không hợp lệ' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">Email không hợp lệ</Alert> : null}
                                        </Box>
                                        : null

                                    }
                                    {formDetail.Questions[ques].Type === 'OTPInput' ?
                                        <OTPInput
                                            value={otpArray[ques]}
                                            onChange={handleSaveOTP(ques)}
                                            numInputs={formDetail.Questions[ques].Content.OtpInput}
                                            renderSeparator={<span>&nbsp;</span>}
                                            renderInput={(props) => <input {...props} />}
                                            inputStyle={{ width: '32px', height: '32px', border: '1px solid gray', borderRadius: '5px' }}
                                        />
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

export default FormViewer
