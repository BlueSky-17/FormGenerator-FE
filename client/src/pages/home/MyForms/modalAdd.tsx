// HOOK
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// MUI COMPONENTs
import { Box, Typography, TextField, Modal, Button, Divider } from '@mui/material'

// APIs
import { createForm, } from '../../../apis/form';

// REDUX
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setName, setDescription, setModal } from '../../../redux/reducers/form.reducer';

// COMPONENTs
import AcceptButton from '../../../components/custom-button/acceptButton';
import CancelButton from '../../../components/custom-button/cancelButton';
import SelectButton from '../../../components/custom-button/selectButton';
import InputFileUpload from '../../../components/custom-button/fileUploadButton';
import COLORS from '../../../constants/colors';
import { error } from 'console';
import { generateFormByDataSheet } from '../../../apis/file';

type ADD_TYPE = 'manual' | 'describe' | 'image' | 'data'

function ModalAdd(props) {
    const navigate = useNavigate();

    const formState = useAppSelector((state) => state.formReducer)

    const dispatch = useAppDispatch()

    const [addType, setAddType] = useState<ADD_TYPE>('manual')

    const handleCreateForm = async () => {
        // Close modal
        dispatch(setModal({ modal: '', isOpen: false }))

        if (addType === 'manual') {
            // Call API POST to create a new form
            const dataFromServer = await createForm(
                {
                    "name": formState.name,
                    "header": {
                        "title": formState.name,
                        "description": formState.description,
                        "imagePath": ""
                    },
                    "owner": JSON.parse(localStorage.getItem('token') as string)?.user.ID,
                    "answersCounter": 0,
                    "latestModified": "2023-10-14T12:34:56Z",
                    "createDate": "2023-10-14T12:34:56Z",
                    "closedDate": "2023-10-14T12:34:56Z",
                    "Questions": [],
                    "QuestionOrder": []
                }
            )

            navigate('/form/' + dataFromServer.newID, { state: 'ViewEdit' });

            // Return default value of Create Modal
            dispatch(setName(''));
            dispatch(setDescription(''));
        }
        else if (addType === 'data') {
            if (fileData) {
                const dataFromServer = await generateFormByDataSheet(fileData)
                
                navigate('/form/' + dataFromServer.id, { state: 'ViewEdit' });
            }
        }


    }

    const handleCloseModal = () => dispatch(setModal({ modal: '', isOpen: false }))

    const [fileImage, setFileImage] = useState<File>();

    const [fileData, setFileData] = useState<File>();

    const [errorFile, setErrorFile] = useState<string>('');

    return (
        <Modal
            open={formState.isOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                {
                    formState.modal === 'select' ?
                        <Box sx={modalStyle}>
                            <Typography variant='h6' component="div">
                                Chọn phương thức tạo biểu mẫu
                            </Typography>

                            <Box component="form" sx={{ marginY: '10px', marginX: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '20px' }}>
                                <SelectButton selectType={addType} type='manual' title='Thủ công' onClick={() => { setAddType('manual') }} />
                                <SelectButton selectType={addType} type='describe' title='Mô tả biểu mẫu' onClick={() => { setAddType('describe') }} />
                                <SelectButton selectType={addType} type='image' title='Từ ảnh/PDF' onClick={() => { setAddType('image') }} />
                                <SelectButton selectType={addType} type='data' title='Từ file dữ liệu' onClick={() => { setAddType('data') }} />
                            </Box>

                            {addType === 'manual' ?
                                <Box component="form" sx={{ marginY: '10px', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant='subtitle1' component="div">
                                        <b>Tên form</b>
                                    </Typography>
                                    <TextField
                                        required
                                        value={formState.name}
                                        onChange={e => { dispatch(setName(e.target.value)) }}
                                        sx={{ margin: '10px', width: '100%' }}
                                        variant="outlined"
                                        placeholder='Tên form'
                                    />
                                    <Typography variant='subtitle1' component="div">
                                        <b>Mô tả</b>
                                    </Typography>
                                    <TextField
                                        required
                                        value={formState.description}
                                        onChange={e => { dispatch(setDescription(e.target.value)) }}
                                        sx={{ margin: '10px', width: '100%' }}
                                        variant="outlined"
                                        placeholder='Mô tả'
                                    />
                                </Box>
                                : null
                            }

                            {addType === 'describe' ?
                                <Box component="form" sx={{ marginY: '10px', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant='subtitle1' component="div">
                                        <b>Nhập mô tả biểu mẫu</b>
                                    </Typography>
                                    <TextField
                                        required
                                        multiline
                                        rows={5}
                                        // value={formState.name}
                                        // onChange={e => { dispatch(setName(e.target.value)) }}
                                        sx={{ width: '100%', marginY: '10px' }}
                                        variant="outlined"
                                        placeholder='Biểu mẫu gồm các trường...'
                                    />
                                </Box>
                                : null
                            }

                            {addType === 'image' ?
                                <Box component="form" sx={{ marginY: '10px', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant='subtitle1' component="div">
                                        <b>Nhập file </b>
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <InputFileUpload setFileProps={setFileImage} setErrorFile={setErrorFile} requiredType={['image/png', '', 'application/pdf', 'image/jpeg']} />
                                        <Typography style={{ color: COLORS.darkBlue, fontWeight: '500' }}>{fileImage ? fileImage.name : errorFile !== '' ? <span style={{ color: '#E3242B' }}>{errorFile}</span> : 'Chưa có file được thêm'}</Typography>
                                    </Box>
                                    <Divider sx={{ marginY: '10px' }} />
                                    <Typography variant='subtitle1' component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'gray' }}>Chỉ chấp nhận file .pdf .png .jpg</span>
                                        <span style={{ color: 'gray' }}>Kích thước giới hạn: 5MB</span>
                                    </Typography>
                                </Box>
                                : null
                            }

                            {addType === 'data' ?
                                <Box component="form" sx={{ marginY: '10px', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant='subtitle1' component="div">
                                        <b>Nhập file </b>
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <InputFileUpload setFileProps={setFileData} setErrorFile={setErrorFile} requiredType={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']} />
                                        <Typography style={{ color: COLORS.darkBlue, fontWeight: '500' }}>{fileData ? fileData.name : errorFile !== '' ? <span style={{ color: '#E3242B' }}>{errorFile}</span> : 'Chưa có file được thêm'}</Typography>
                                    </Box>
                                    <Divider sx={{ marginY: '10px' }} />
                                    <Typography variant='subtitle1' component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'gray' }}>Chỉ chấp nhận file .xlsx</span>
                                    </Typography>
                                </Box>
                                : null
                            }

                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                                <AcceptButton title='Xác nhận' onClick={handleCreateForm} />
                                <CancelButton title='Hủy' onClick={handleCloseModal} />
                            </Box>
                        </Box>
                        : null}
                {
                    formState.modal === 'delete' ?
                        <Box sx={{ ...modalStyle }}>
                            <Typography variant='h5'><b>Xác nhận xóa form?</b></Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }} >
                                <AcceptButton title='Xác nhận' onClick={props.handleDeleteForm} />
                                <CancelButton title='Hủy' onClick={handleCloseModal} />
                            </Box>
                        </Box>
                        : null
                }
            </Box>
        </Modal>
    )
}

export default ModalAdd

export const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};
