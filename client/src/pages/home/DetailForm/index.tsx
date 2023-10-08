import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal } from '@mui/material'
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NotesIcon from '@mui/icons-material/Notes';
import ClearIcon from '@mui/icons-material/Clear';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const style = {
    position: 'absolute' as 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

function addShortTextType(
    Question: string,
    Description: string,
    Required: boolean,
    ImagePath: string,
    Type: string,
    Content: {}
) {
    return { Question, Description, Required, ImagePath, Type, Content };
}

function addOption(
    multiChoice: { Options: string[], ImportedData: string }
) {
    return { multiChoice };
}

function DetailForm() {
    const [formDetail, setFormDetail] = useState<any>({})

    const FormDetailAPI_URL = `http://localhost:8080/form/${useParams()?.formID}`;

    const UpdateFormAPI_URL = `http://localhost:8080/update-form/${useParams()?.formID}`;

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

    // open + close Modal edit form
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        // return default value when open modal: type and title
        setType('');
        setTextFieldValue('');

        // return default value when open modal: options
        setOptionFieldValueArray([]);
        setOptionLength(0);
        setActive(-1);

        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    //add question into form (front-end)
    const addQuestion = () => {
        // Tạo một Question có 5 trường: Question, Description, Required, ImagePath, Type, Content
        formDetail.Questions.push(addShortTextType(textFieldValue, "", true, "", type, {}));

        // Push index vào QuestionOrder
        const newIndex = formDetail.Questions.length - 1;
        formDetail.QuestionOrder.push(newIndex);

        // Lấy Object: Options có chứa Option[] và ImportedData
        const updatedMultiChoice = handleOptionArrayChange();

        Object.assign(formDetail.Questions[newIndex].Content, updatedMultiChoice);

        setOpen(false);
        updateObjectInDatabase(formDetail.id, formDetail)
    };

    const [deleted, setDelete] = React.useState(false);

    //delete question in form (front-end)
    const deleteQuestion = (index: string) => (event: any) => {
        // Xóa 1 phần tử ở vị trí index
        formDetail.Questions.splice(index, 1)

        // lọc mảng các num mà khác index, chỉnh lại cho các num
        formDetail.QuestionOrder = formDetail.QuestionOrder.filter(num => num !== index);
        formDetail.QuestionOrder = formDetail.QuestionOrder.map((num) => {
            if (num > index)
                return --num;
            else
                return num;
        })

        if (deleted === true) setDelete(false);
        else setDelete(true);
        updateObjectInDatabase(formDetail.id, formDetail)
    };

    //update question in database
    const updateObjectInDatabase = async (formID, updateData) => {
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

    // set type of question
    const [type, setType] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    // set title of question
    const [textFieldValue, setTextFieldValue] = useState('');
    const handleTextFieldChange = (e) => {
        setTextFieldValue(e.target.value);
    };

    // Biến tạm: optionFieldValue
    const [optionFieldValue, setOptionFieldValue] = useState('');

    const handleOptionFieldChange = (e) => {
        setOptionFieldValue(e.target.value);
    };

    // Lưu giá trị các options[]
    const [optionFieldValueArray, setOptionFieldValueArray] = useState<string[]>(['']);

    // Lưu chiều dài của options, sử dụng để re-render khi bấm nút "Thêm" option
    const [optionLength, setOptionLength] = useState<number>(1);

    // active === index thì value của TextField sẽ thay đổi
    const [active, setActive] = useState<number>(-1);

    // active === index thì value của TextField sẽ thay đổi
    const handleActive = (index: number) => (e) =>
    {
        setActive(index);
        setOptionFieldValue(optionFieldValueArray[index]);
    }

    // Khi onBlur thì sẽ lưu value vào mảng options[]
    const saveOption = (index: number) => (e) => {
        optionFieldValueArray[index] = optionFieldValue;

        console.log(optionFieldValueArray);
    };

    //Lưu array tạm optionFieldValueArray vào một Object
    const handleOptionArrayChange = () => {
        const updatedMultiChoice = addOption({
            Options: optionFieldValueArray,
            ImportedData: '',
        });
        // console.log(updatedMultiChoice);
        // console.log(formDetail.Questions);
        // formDetail.Questions.Content.MultiChoice.push(...updatedMultiChoice.MultiChoice.Options);
        return updatedMultiChoice;
    };

    // Thêm option trống 
    const handleOption = () => {
        // const newIndex = optionFieldArray.length - 1;
        const newIndex = optionLength + 1;

        optionFieldValueArray.push('')

        console.log(optionFieldValueArray);

        setOptionLength(newIndex);
    }

    // console.log(optionFieldValue);

    console.log(optionFieldValueArray);

    // console.log(formDetail.Questions.Content.option)

    // const addOption = () => {
    //     options: string[];

    // }

    // Navigate to view form page
    const navigate = useNavigate();

    const viewForm = () => {
        navigate('/form/' + formDetail.id + '/view');
    };

    const [duplicated, setDuplicate] = React.useState('');

    // const handleDuplicate = (id_: string, index: number) => (event: any) => {
    //     // console.log(rows, id_, index);
    //     let temp = rows.filter(row => row.id === id_);
    //     let result = temp[0];
    //     temp = [];
    //     // console.log(result);
    //     rows.splice(index + 1, 0, createData(uuid(), result.title, result.type, result.note, result.isHead, false));
    //     setDuplicate(rows[index].id);
    // }

    const [swaped, setSwap] = React.useState('');

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

    // const handleSwap = (id_: string, index: number) => (event: any) => {
    //     rows = swapElements(rows, index);
    //     console.log(rows[index].title)
    //     setSwap(rows[index].id);
    // }

    // Tùy chỉnh nút Settings
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseSetting = () => {
        setAnchorEl(null);
    };

    const open_avatar = Boolean(anchorEl);
    const id = open_avatar ? 'simple-popover' : undefined;

    console.log(formDetail.Questions);

    return (
        <div>
            <DrawerHeader />
            <Box sx={{ backgroundColor: 'white' }}>

                {/*Header of Form: Title, Save Form and Settings*/}
                <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ color: '#364F6B', padding: '12px', fontWeight: 600 }} variant="h4" noWrap component="div">
                        {Object.keys(formDetail).length !== 0 ? formDetail.header.Title : null}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* <Button sx={{
                        color: '#364F6B',
                        backgroundColor: 'white',
                        border: '2px solid #364F6B',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        marginY: '18px',
                        textTransform: 'initial',
                        '&:hover': {
                            backgroundColor: '#364F6B', // Màu nền thay đổi khi hover
                            color: 'white'
                        },
                    }}>
                        <VisibilityIcon sx={{ marginRight: '5px', height: '90%' }} />
                        Xem trước
                    </Button> */}

                    <Button
                        sx={{
                            color: 'white',
                            backgroundColor: '#364F6B',
                            borderRadius: '10px',
                            marginY: '12px',
                            '&:hover': {
                                backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                            },
                        }}>
                        Lưu
                    </Button>

                    <IconButton
                        aria-describedby={id} onClick={handleClick}
                        sx={{
                            color: '#364F6B',
                            backgroundColor: 'white',
                            margin: '5px',
                            marginY: '15px',
                        }}>
                        <SettingsIcon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={open_avatar}
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

                {/*Header of Form: Chỉnh sửa & Xem phản hồi*/}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px', borderBottom: "10px solid #364F6B" }}>
                    <Button sx={{
                        color: 'white',
                        border: '2px solid #364F6B',
                        backgroundColor: '#364F6B',
                        borderRadius: '10px',
                        marginY: '10px',
                        paddingX: '15px',
                        '&:hover': {
                            backgroundColor: '#2E4155', // Màu nền thay đổi khi hover
                        },
                    }}>
                        Chỉnh sửa
                    </Button>
                    <Button sx={{
                        color: '#364F6B',
                        backgroundColor: 'white',
                        border: '2px solid #364F6B',
                        borderRadius: '10px',
                        margin: '10px',
                        paddingX: '15px',
                        '&:hover': {
                            backgroundColor: '#364F6B', // Màu nền thay đổi khi hover
                            color: 'white'
                        },
                    }}>
                        Xem phản hồi
                    </Button>
                </Box>

                {/*Header of Form: Description and Modal Edit */}
                <Box sx={{ display: 'flex', alignContent: 'center', margin: '15px' }}>
                    {/* Form Description */}
                    <Typography sx={{}} variant='body1' component="div">
                        {Object.keys(formDetail).length !== 0 ? formDetail.header.Description : null}
                    </Typography>

                    {/* Modal: Thêm mới Question */}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={{ ...style, width: 400 }}>
                            <Modal
                                open={open}
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
                                                value={type}
                                                label="Dạng"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={'multi-choice'}>
                                                    <RadioButtonCheckedIcon sx={{ paddingRight: '5px' }} />
                                                    Trắc nghiệm
                                                </MenuItem>
                                                <MenuItem value={'checkbox'}>
                                                    <CheckBoxIcon sx={{ paddingRight: '5px' }} />
                                                    Ô đánh dấu
                                                </MenuItem>
                                                <MenuItem value={'shortText'}>
                                                    <NotesIcon sx={{ paddingRight: '5px' }} />
                                                    Điền ngắn
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    {type === 'multi-choice' ?
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {
                                                optionFieldValueArray.map((item, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <RadioButtonUncheckedIcon
                                                            sx={{ color: 'gray', marginRight: '10px' }}
                                                        />
                                                        <TextField
                                                            value={index === active ? optionFieldValue : optionFieldValueArray[index]}
                                                            onChange={handleOptionFieldChange}
                                                            onBlur={saveOption(index)}
                                                            onClick={handleActive(index)}
                                                            sx={{ marginRight: '10px', width: '100%' }}
                                                            // id={index.toString()}
                                                            variant="standard"
                                                        // defaultValue='Tùy chọn 1'
                                                        >
                                                            {/* {optionFieldValue} */}
                                                        </TextField>
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
                                                onClick={handleOption}
                                            >
                                                Thêm tùy chọn
                                            </Button>
                                        </Box >
                                        : null
                                    }
                                    {type === 'checkbox' ?
                                        <FormControl>
                                            {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                                            <FormControlLabel required control={<Checkbox />} label="Required" />
                                            <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                                        </FormControl>
                                        : null
                                    }
                                    {type === 'shortText' ?
                                        <TextField sx={{ width: '100%' }} id="standard-basic" label="Điền ngắn" variant="standard" />
                                        : null
                                    }
                                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                                        <Button
                                            onClick={addQuestion}
                                            // onClick={handleOptionArrayChange}
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
                        </Box>
                    </Modal>
                </Box>

                <Divider />

                {/* Body of Form */}
                <Box sx={{ margin: '15px' }}>
                    <TableContainer component={Paper}>
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
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{formDetail.Questions[ques].Type}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="left">{formDetail.Questions[ques].Description}</TableCell>
                                        <TableCell sx={{ padding: 1, fontWeight: 400, fontSize: '1.05rem' }} align="center">
                                            <IconButton
                                                onClick={handleOpen}
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
                                                // onClick={handleDuplicate(row.id, index)}
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
                                                // onClick={handleSwap(row.id, index)}
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
                                            <IconButton sx={{
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
                </Box>
            </Box>
        </div>
    )
}

export default DetailForm
