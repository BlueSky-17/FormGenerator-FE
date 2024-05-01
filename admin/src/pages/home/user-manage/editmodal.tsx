/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useLayoutEffect } from 'react'

import { Box, Typography, Drawer, Avatar, IconButton, Toolbar, List, Divider, Icon, Modal, Grid, Switch } from '@mui/material'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { UndoRounded } from '@mui/icons-material';
import AcceptButton from '../../../components/custom-button/acceptButton';
import CancelButton from '../../../components/custom-button/cancelButton';
import { modalStyle } from '../home.page';

// interface User {
//     ID: number;
//     UserName: string;
//     Email: string;
//     Role: 'admin' | 'user';
// }

export function EditModal(props: any) {

    // const [user, setUser] = useState<User>({
    //     ID: 0,
    //     UserName: '',
    //     Email: '',
    //     Role: 'user'
    // })

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState('');

    // useEffect(() => {
    //     const selectUser = props.users.find((us: { ID: any; }) => us.ID === props.selectID)

    //     if (props.selectID !== '') setUser(selectUser)

    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props.selectID])

    //get init value of name & description form (avoid undefined)
    // useEffect(() => {
    //     if (props.formDetail.name) {
    //         setName(props.formDetail.name);
    //         setDescription(props.formDetail.header.Description)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props.formDetail.name]);

    const handleName = (e: any) => {
        setName(e.target.value);
    }

    const handleDescription = (e: any) => {
        setDescription(e.target.value);
    }
    const closeEditModal = () => {
        props.setOpen(false);
    }

    const saveEditModal = () => {
        props.updateObjectInDatabase({
            "name": name,
            "header": {
                "title": name,
                "description": description,
                "imagePath": ""
            }
        })

        window.location.reload();
        closeEditModal()
    }
    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Box sx={modalStyle}>
                        <Typography variant='h6' component="div">
                            Thông tin người dùng
                        </Typography>

                        <Box component="form" sx={{ marginY: '10px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='subtitle1' component="div">
                                <b>Tài khoản</b>
                            </Typography>
                            <TextField
                                required
                                value={name}
                                // onChange={handleName}
                                sx={{ margin: '10px', width: '100%' }}
                                variant="outlined"
                                placeholder='Tên form'
                            />
                            <Typography variant='subtitle1' component="div">
                                <b>Họ và tên</b>
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
                            <AcceptButton title='Xác nhận' onClick={saveEditModal} />
                            <CancelButton title='Hủy' onClick={closeEditModal} />
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default EditModal


