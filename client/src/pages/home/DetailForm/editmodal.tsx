/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useLayoutEffect } from 'react'

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';

// Style cho modal edit
const style = {
    position: 'absolute' as 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

export function EditModal(props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleDescription = (e) => {
        setDescription(e.target.value);
    }
    const closeEditModal = () => {
        props.setOpenEditModal(false);
    }

    const saveEditModal = () => {
        props.updateObjectInDatabase({
            "name": name,
            "header": {
                "title": name,
                "description" :description,
                "imagePath": ""
            }
        })

        window.location.reload();
        closeEditModal()
    }

    return (
        <div>
            <Modal
                open={props.openEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Box sx={style}>
                        <Typography variant='h6' component="div">
                            Vui lòng điền thông tin chỉnh sửa form
                        </Typography>

                        <Box component="form" sx={{ marginY: '10px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='subtitle1' component="div">
                                <b>Tên form</b>
                            </Typography>
                            <TextField
                                required
                                value={name}
                                onChange={handleName}
                                sx={{ margin: '10px', width: '100%' }}
                                variant="outlined"
                                placeholder='Tên form'
                            />
                            <Typography variant='subtitle1' component="div">
                                <b>Mô tả</b>
                            </Typography>
                            <TextField
                                required
                                value={description}
                                onChange={handleDescription}
                                sx={{ margin: '10px', width: '100%' }}
                                variant="outlined"
                                placeholder='Mô tả'
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }} >
                            <Button
                                onClick={saveEditModal}
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
                                Xác nhận
                            </Button>
                            <Button
                                onClick={closeEditModal}
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
                </Box>
            </Modal>
        </div>
    )
}

export default EditModal


