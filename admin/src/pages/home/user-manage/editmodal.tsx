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
import COLORS from '../../../constants/colors';
import { updateUser } from '../../../apis/user';

interface User {
    ID: number
    UserName: string
    Email: string
    Role: 'admin' | 'user'
    Password: string
    FirstName: string
    LastName: string
    AvataPath: string
    Disabled: boolean
}

export function EditModal(props: any) {

    const [user, setUser] = useState<User>({
        ID: 0,
        UserName: '',
        Email: '',
        Role: 'user',
        Password: '',
        FirstName: '',
        LastName: '',
        AvataPath: '',
        Disabled: false
    })

    const closeEditModal = () => {
        props.setOpen(false);
    }

    useEffect(() => {
        const selectUser = props.users.find((user: { ID: any; }) => user.ID === props.selectID)
        setUser(selectUser)
    }, [props.selectID])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        updateUser(
            {
                "username": data.get('username') as string,
                "email": data.get('email') as string,
                "firstName": data.get('firstname') as string,
                "lastName": data.get('lastname') as string,
            },
            props.selectID
        )

        window.location.reload();
        closeEditModal()
    }

    return (
        <div>
            {user ? <Modal
                open={props.open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography variant='h6' component="div">
                        Chỉnh sửa thông tin người dùng
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ marginY: '10px', display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            margin="normal"
                            defaultValue={user.UserName}
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            defaultValue={user.Email}
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                            <TextField
                                margin="normal"
                                defaultValue={user.FirstName}
                                required
                                fullWidth
                                id="firstname"
                                name="firstname"
                                autoComplete="firstname"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                defaultValue={user.LastName}
                                required
                                fullWidth
                                id="lastname"
                                name="lastname"
                                autoComplete="lastname"
                                autoFocus
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <CancelButton title='Hủy' onClick={closeEditModal} />
                            <Button
                                type="submit"
                                sx={{ margin: '10px', borderRadius: '10px', backgroundColor: COLORS.darkBlue, color: 'white', '&:hover': { backgroundColor: COLORS.darkBlue, color: 'white', opacity: '0.8' } }}
                            >
                                Xác nhận
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal> : null}
        </div>
    )
}

export default EditModal


