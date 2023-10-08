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

const ariaLabel = { 'aria-label': 'description' };

function createData(
    name: string,
    owner: string,
    response: number,
    isOpen: boolean
) {
    return { name, owner, response, isOpen };
}

const countrys = [
    { label: 'Nghệ An', year: 1994 },
    { label: 'Tây Ninh', year: 1972 },
    { label: 'Quảng Trị', year: 1974 },
    { label: 'Cà Mau', year: 2008 },
    { label: 'TP.HCM', year: 1957 }
]

const rows = [
    createData('KHẢO SÁT CHẤT LƯỢNG SINH VIÊN K22', 'Tôi', 124, true),
    createData('KHẢO SÁT ỨNG DỤNG ĐẶT MÓN ĂN', 'Tôi', 15, false),
    createData('KHẢO SÁT ĐĂNG KÝ VỀ QUÊ NGHỈ LỄ 2/9', 'Tôi', 10, false),
    createData('KHẢO SÁT TỶ LỆ SINH VIÊN ĐI XE GẮN MÁY', 'Tôi', 5, false),
    createData('ĐÁNH GIÁ HỆ THỐNG QUẢN LÝ NHÂN VIÊN', 'Tôi', 14, false),
];

function Form() {
    const [formDetail, setFormDetail] = useState<any>({})

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;

    //get detail of form (from API)
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

    const [selectedValue, setSelectedValue] = React.useState('');

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };

    console.log(selectedValue);
    console.log(formDetail);

    const ResponseAPI_URL = `http://localhost:8080/form-response/${useParams()?.formID}`;

    //update question in database
    const addResponsetoDatabase = async (formID, data) => {
        try {
            const response = await fetch(ResponseAPI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
                },
                body: JSON.stringify(data),
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

    const [submitForm, setSubmitForm] = React.useState(false);

    const handleSubmitForm = () => {

        console.log(formDetail.id);
        addResponsetoDatabase(formDetail.id,"Hello");
    }

    return (
        <div>
            <Box sx={{ backgroundColor: '#E9F2F4', border: "2px solid #DEDEDE", height: '100%', width: '100%' }}>
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

                    {/* Body of Form */}
                    <Box sx={{ margin: '50px' }}>
                        {formDetail.Questions !== undefined ? formDetail.QuestionOrder.map((ques, index) => (
                            <Box
                                key={index}
                            >
                                {/* Câu hỏi */}
                                <Typography
                                    sx={{ color: '#008272', justifySelft: 'left', padding: '5px', fontWeight: 500 }} variant='h5' noWrap component="div">
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
                                                        checked={selectedValue === item}
                                                        onChange={handleChange}
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
                                    <TextField sx={{ width: '100%' }} id="standard-basic" label="Điền ngắn" variant="standard" />
                                    : null
                                }
                            </Box>
                        ))
                            : null}
                    </Box>
                    {/* <Box sx={{ border: "2px solid #364F6B", borderTop: '6px solid #364F6B', margin: '35px' }}>
                        <Typography sx={{ color: '#364F6B', justifySelft: 'left', padding: '5px', fontWeight: 500 }} variant='h5' noWrap component="div">
                            2. Giới tính
                        </Typography>
                        <FormControl sx={{ marginLeft: '15px' }}>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Nam" />
                                <FormControlLabel value="male" control={<Radio />} label="Nữ" />
                                <FormControlLabel value="other" control={<Radio />} label="Khác" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Box sx={{ border: "2px solid #364F6B", borderTop: '6px solid #364F6B', margin: '35px' }}>
                        <Typography sx={{ color: '#364F6B', justifySelft: 'left', padding: '5px', fontWeight: 500 }} variant='h5' noWrap component="div">
                            3. Ngày sinh
                        </Typography>
                        <Box sx={{ marginLeft: '15px', marginBottom: '15px' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker />
                            </LocalizationProvider>
                        </Box>
                    </Box>
                    <Box sx={{ border: "2px solid #364F6B", borderTop: '6px solid #364F6B', margin: '35px' }}>
                        <Typography sx={{ color: '#364F6B', justifySelft: 'left', padding: '5px', fontWeight: 500 }} variant='h5' noWrap component="div">
                            4. Nơi sinh
                        </Typography>
                        <Box sx={{ marginLeft: '15px', marginY: '15px', display: 'flex' }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={countrys}
                                sx={{ width: 200, marginRight: '10px' }}
                                renderInput={(params) => <TextField {...params} label="Chọn tỉnh" />}
                            />
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={countrys}
                                sx={{ width: 200, marginRight: '10px' }}
                                renderInput={(params) => <TextField {...params} label="Chọn huyện" />}
                            />
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={countrys}
                                sx={{ width: 200, marginRight: '10px' }}
                                renderInput={(params) => <TextField {...params} label="Chọn xã" />}
                            />
                        </Box>
                    </Box>*/}
                </Box>
                <Box sx={{ display: 'grid', justifyItems: 'right', width: '100%' }}>
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
                </Box>
            </Box>
        </div>
    )
}

export default Form
