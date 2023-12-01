import React, { useState, useEffect } from 'react'
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon } from '@mui/material'
import { styled, useTheme, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';

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
import Input from '@mui/material/Input';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useParams } from 'react-router-dom';
import { stringify } from 'querystring';

function Responses(
    questionName: string,
    type: string,
    content: {}
) {
    return { questionName, type, content };
}

function addResultMultiChoice(
    multiChoice: string
) {
    return { multiChoice }
}

function addResultShortText(
    shortText: string
) {
    return { shortText }
}

function addResultDate(
    date: string
) {
    return { date }
}

function ViewForm() {
    const [formDetail, setFormDetail] = useState<any>({})
    const [formResponses, setFormResponse] = useState<any[]>([])

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;
    const ResponseAPI_URL = `http://localhost:8080/form-response/${useParams()?.formID}`;

    //API GET: get detail of form 
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Initial mảng FormResponses tương ứng với các Question trong Form
    // Vì render lần đâu lấy length bị lỗi -> nên dùng try catch 
    try {
        let i = 0;
        // Tránh push thêm khi re-render component 
        if (formDetail.QuestionOrder.length !== formResponses.length) {
            while (i < formDetail.QuestionOrder.length) {
                if (formDetail.Questions[i].Type === "multi-choice") {
                    formResponses.push(
                        Responses(
                            formDetail.Questions[i].Question,
                            formDetail.Questions[i].Type,
                            addResultMultiChoice("")
                        )
                    )
                }
                else if (formDetail.Questions[i].Type === "shortText") {
                    formResponses.push(
                        Responses(
                            formDetail.Questions[i].Question,
                            formDetail.Questions[i].Type,
                            addResultShortText("")
                        )
                    )
                }
                else if (formDetail.Questions[i].Type === "datePicker") {
                    formResponses.push(
                        Responses(
                            formDetail.Questions[i].Question,
                            formDetail.Questions[i].Type,
                            addResultDate("")
                        )
                    )
                }
                // setFormResponse(formResponses);
                i++;
            }
        }
    }
    catch (error) {
        console.log("Error");
    }
    
    // Lưu giá trị cho các field dạng multi-choice
    const handleChange = (ques: number, index: number) => (e) => {
        formResponses[ques].content.multiChoice = formDetail.Questions[ques].Content.MultiChoice.Options[index];
    };

    //Lưu giá trị cho các field dạng shortText
    const [inputValue, setInputValue] = React.useState('');
    const handleChangeInputValue = (ques: number) => (e) => {
        setInputValue(e.target.value);
    };
    const saveInputValue = (ques:number) => (e) =>{
        formResponses[ques].content.shortText = inputValue;
    };

    //Lưu giá trị cho các field dạng Date
    const handleChangeDate = (ques: number) => (e) => {
        formResponses[ques].content.date = e.$d;
    };

    const [submit, setSubmit] = useState(false);
    const handleSubmitForm = () => {
        addResponsetoDatabase({
            "ID": "6526518a6b149bcb2510172f",
            "FormID": "651dbc9d49502243191371e3",
            "Username": formDetail.owner,
            "UserID": formDetail.owner,
            "SubmitTime": "2023-10-11T07:40:58.1078101Z",
            "Responses": formResponses
        });

        setSubmit(true);
    }

    return (
        <div>
            <Box sx={{ backgroundColor: '#E9F2F4', border: "2px solid #DEDEDE", height: '100vh', width: '100vw' }}>
                <Box sx={{ backgroundColor: 'white', border: "2px solid #DEDEDE", marginX: '300px', marginTop: '70px' }}>
                    {/* Header of Form */}
                    <Box sx={{ textAlign: 'center', backgroundColor: '#008272', paddingY: '30px' }}>
                        <Typography sx={{ color: 'white', padding: '15px', fontWeight: 600 }} variant="h4" noWrap component="div">
                            {Object.keys(formDetail).length !== 0 ? formDetail.header.Title : null}
                        </Typography>
                        <Typography sx={{ color: 'white', padding: '5px', fontWeight: 400 }} variant='body1' noWrap component="div">
                            {Object.keys(formDetail).length !== 0 ? formDetail.header.Description : null}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Body of Form | In case: Unsubmit form */}
                    {!submit && <Box sx={{ margin: '50px' }}>
                        {formDetail.Questions !== undefined ? formDetail.QuestionOrder.map((ques, index) => (
                            <Box
                                key={index}
                            >
                                {/* Câu hỏi */}
                                <Typography
                                    sx={{ color: '#008272', justifySelft: 'left', padding: '10px', fontWeight: 500 }} variant='h5' noWrap component="div">
                                    {index + 1}. {formDetail.Questions[ques].Question}
                                </Typography>
                                {/* Nội dung | Dạng câu hỏi */}
                                {formDetail.Questions[ques].Type === 'multi-choice' ?
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <FormControl sx={{ marginLeft: '15px' }}>
                                            <RadioGroup
                                                key={index}
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                defaultValue="female"
                                                name="radio-buttons-group"
                                            >
                                                {formDetail.Questions[ques].Content.MultiChoice.Options.map((item, index) => (
                                                    <FormControlLabel
                                                        key={index}
                                                        // checked={selectedValue === item}
                                                        onChange={handleChange(ques, index)}
                                                        value={item}
                                                        control={<Radio />}
                                                        label={item}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </Box >
                                    : null
                                }
                                {formDetail.Questions[ques].Type === 'checkbox' ?
                                    <FormControl sx={{ marginLeft: '15px' }}>
                                        {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                                        <FormControlLabel required control={<Checkbox />} label="Required" />
                                        <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                                    </FormControl>
                                    : null
                                }
                                {formDetail.Questions[ques].Type === 'shortText' ?
                                    <TextField
                                        value={inputValue}
                                        onChange={handleChangeInputValue(ques)}
                                        onBlur={saveInputValue(ques)}
                                        sx={{ width: '100%' }}
                                        id="filled-basic"
                                        label="Điền ngắn"
                                        variant="filled" />
                                    : null
                                }
                                {formDetail.Questions[ques].Type === 'datePicker' ?
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker onChange={handleChangeDate(ques)}/>
                                    </LocalizationProvider>
                                    : null
                                }
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
                            background: '#008272', color: 'white', marginRight: '300px', marginBottom: '30px', marginTop: '30px', width: '100px', height: '50px', '&:hover': {
                                backgroundColor: '#008272', // Màu nền thay đổi khi hover
                                color: 'white'
                            },
                        }}>
                        Gửi
                    </Button>
                </Box>}
            </Box>
        </div>
    )
}

export default ViewForm
