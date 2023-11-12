import React, { useState, useEffect } from 'react'
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Grid } from '@mui/material'
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

function Responses(
    questionName: string,
    type: string,
    content: {}
) {
    return { questionName, type, content };
}

function addResultMultiChoice(
    multiChoice: {
        options: string[],
        result: boolean[]
    }
) {
    return { multiChoice }
}

function addResultShortText(
    shortText: string
) {
    return { shortText }
}

function addResultLinkedData(
    linkedData: string[]
) {
    return { linkedData }
}

function addResultDate(
    date: string
) {
    return { date }
}

function Form({ getToken }) {
    // render: use to re-render after create or delete form
    const [render, setRender] = useState(false);

    const [formDetail, setFormDetail] = useState<any>({})
    const [formResponses, setFormResponse] = useState<any[]>([])

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;
    const ResponseAPI_URL = `http://localhost:8080/form-response/${useParams()?.formID}`;

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

    // Initial mảng FormResponses tương ứng với các Question trong Form
    // Vì render lần đâu lấy length bị lỗi -> nên dùng try catch 
    try {
        let i = 0;
        // Tránh push thêm khi re-render component 
        if (formDetail.QuestionOrder.length !== formResponses.length) {
            while (i < formDetail.QuestionOrder.length) {
                if (formDetail.Questions[i].Type === "multi-choice" || formDetail.Questions[i].Type === "checkbox") {
                    let res = new Array(formDetail.Questions[i].Content.MultiChoice.Options.length).fill(false);
                    formResponses.push(
                        Responses(
                            formDetail.Questions[i].Question,
                            formDetail.Questions[i].Type,
                            addResultMultiChoice({
                                options: formDetail.Questions[i].Content.MultiChoice.Options,
                                result: res
                            })
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
                else if (formDetail.Questions[i].Type === "linkedData") {
                    formResponses.push(
                        Responses(
                            formDetail.Questions[i].Question,
                            formDetail.Questions[i].Type,
                            addResultLinkedData([])
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
        //set all options to result 0
        formResponses[ques].content.multiChoice.result.fill(false);

        //set select options to result 1
        formResponses[ques].content.multiChoice.result[index] = true;
        console.log(formResponses[ques].content.multiChoice.result)
    };

    //Lưu giá trị cho các field dạng shortText
    const [inputValue, setInputValue] = React.useState('');
    const handleChangeInputValue = (ques: number) => (e) => {
        setInputValue(e.target.value);
    };
    const saveInputValue = (ques: number) => (e) => {
        formResponses[ques].content.shortText = inputValue;
    };

    //Lưu giá trị cho các field dạng Date
    const handleChangeDate = (ques: number) => (e) => {
        formResponses[ques].content.date = e.$d;
    };

    const [submit, setSubmit] = useState(false);
    const handleSubmitForm = () => {
        addResponsetoDatabase({
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

    const [firstField, setFirstField] = useState('');
    const handleFirstFieldChange = (ques: number) => (e) => {
        setFirstField(e.target.value);
        setSecondField('');
        setThirdField('');

        const firstChoice = formDetail.Questions[ques].Content.LinkedData.ListOfOptions[e.target.value].Key;
        formResponses[ques].content.linkedData.push(firstChoice);
    };

    console.log(firstField)

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

    console.log(formResponses);

    console.log(formDetail);

    const [height, setHeight] = useState('100%')

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
                                        sx={{ color: '#008272', justifySelft: 'left', paddingY: '10px', fontWeight: 500 }} variant='h5' noWrap component="div">
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
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'checkbox' ?
                                        <FormControl sx={{ marginLeft: '15px' }}>
                                            {formDetail.Questions[ques].Content.MultiChoice.Options.map((item, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    // checked={selectedValue === item}
                                                    // onChange={handleChange(ques, index)}
                                                    value={item}
                                                    control={<Checkbox />}
                                                    label={item}
                                                />
                                            ))}
                                        </FormControl>
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'shortText' ?
                                        <TextField
                                            value={inputValue}
                                            onChange={handleChangeInputValue(ques)}
                                            onBlur={saveInputValue(ques)}
                                            sx={{ width: '100%' }}
                                            id="outlined-basic"
                                            label="Điền ngắn"
                                            variant="outlined" />
                                        : null
                                    }
                                    {formDetail.Questions[ques].Type === 'datePicker' ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker onChange={handleChangeDate(ques)} />
                                        </LocalizationProvider>
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
                                                                {/* {formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField].Value[secondField].Value.map((obj,idx) => (
                                                                <MenuItem key={obj.Key} value={idx} >{obj.Key}</MenuItem>
                                                            ))} */}
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
        </div>
    )
}

export default Form
