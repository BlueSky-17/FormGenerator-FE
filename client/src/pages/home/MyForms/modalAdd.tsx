// HOOK
import React from 'react'
import { useNavigate } from 'react-router-dom'

// MUI COMPONENTs
import { Box, Typography, TextField, Modal } from '@mui/material'

// APIs
import { createForm,  } from '../../../apis/form';

// REDUX
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setName, setDescription, setModal } from '../../../redux/reducers/form.reducer';

// COMPONENTs
import AcceptButton from '../../../components/custom-button/acceptButton';
import CancelButton from '../../../components/custom-button/cancelButton';

function ModalAdd(props) {
    const navigate = useNavigate();

    const formState = useAppSelector((state) => state.formReducer)

    const dispatch = useAppDispatch()

    // console.log(isOpen, modal)

    const handleCreateForm = async () => {
        // Close modal
        dispatch(setModal({ modal: '', isOpen: false }))

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

    const handleCloseModal = () => dispatch(setModal({ modal: '', isOpen: false }))

    return (
        <Modal
            open={formState.isOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                {
                    formState.modal === 'add' ?
                        <Box sx={modalStyle}>
                            <Typography variant='h6' component="div">
                                Vui lòng điền thông tin form
                            </Typography>

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
